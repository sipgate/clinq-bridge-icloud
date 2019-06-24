import { Config } from "@clinq/bridge";
import * as ICloud from "apple-icloud";
import { IExportedCloudSession } from "../model/icloud.model";
import { PromiseRedisClient } from "../util/promise-redis-client";

// session cache if no redis instance is provided
const sessions: Map<string, ICloud> = new Map<string, ICloud>();

const CACHE_TTL_SECONDS: number = 60 * 60 * 24 * 30; // 30 days

async function getOrCreateUserSession(config: Config, redisClient?: PromiseRedisClient): Promise<ICloud> {
	const cachedSession: IExportedCloudSession | null = await loadSession(config, redisClient);
	return new Promise((resolve, reject) => {
		const [username, password] = config.apiKey.split(":");
		const instance: ICloud = new ICloud(cachedSession || {}, username, password);
		if (cachedSession) {
			console.log("Using cached iCloud session for", instance.clientId);
			resolve(instance);
			return;
		} else {
			console.log("Creating new iCloud session for", instance.clientId);
		}
		instance.on("err", err => {
			console.error("Unable to create icloud client", err);
			reject(err);
		});
		instance.on("ready", async () => {
			console.log("iCloud client ready", instance.clientId);
			resolve(instance);
		});
		instance.on("sessionUpdate", () => {
			console.log("Session updated", instance.clientId);
			saveSession(config, instance, redisClient);
		});
	});
}

function saveSession(config: Config, iCloudInstance: ICloud, redisClient?: PromiseRedisClient): void {
	const exportedSession: IExportedCloudSession = iCloudInstance.exportSession();
	const stringSession: string = JSON.stringify(exportedSession);
	const sessionKey: string = getSessionKey(config);
	if (redisClient) {
		redisClient.set(sessionKey, stringSession, "EX", CACHE_TTL_SECONDS);
	} else {
		sessions.set(sessionKey, iCloudInstance.exportSession());
	}
}

function getSessionKey(config: Config): string {
	return `iCloudSession_${config.apiKey}`;
}

async function loadSession(
	config: Config,
	redisClient?: PromiseRedisClient
): Promise<IExportedCloudSession> {
	const sessionKey: string = getSessionKey(config);
	if (redisClient) {
		try {
			const maybeRedisSession: ICloud = await redisClient.get(sessionKey);
			return JSON.parse(maybeRedisSession);
		} catch(e) {
			console.warn("Error deserializing iCloud session", e);
			return null;
		}
	} else {
		return sessions.get(sessionKey);
	}
}

export async function getICloudSession(config: Config, redisClient?: PromiseRedisClient): Promise<ICloud> {
	const userSession: ICloud = await getOrCreateUserSession(config, redisClient);
	return userSession;
}

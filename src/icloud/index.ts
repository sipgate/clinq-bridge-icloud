import { Config } from "@clinq/bridge";
import * as ICloud from "apple-icloud";
import { ICloudContact } from "../model/icloud.model";

const sessions: Map<string, ICloud> = new Map<string, ICloud>();

async function getOrCreateUserSession(config: Config): Promise<ICloud> {
	return new Promise((resolve, reject) => {
		const [username, password] = config.apiKey.split(":");
		const cachedSession: ICloud = sessions.get(config.apiKey);
		const instance: ICloud = new ICloud(cachedSession || {}, username, password);
		if (cachedSession) {
			console.log("Found cached iCloud session for", instance.clientId);
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
			sessions.set(config.apiKey, instance.exportSession());
		});
	});
}

export async function getICloudSession(config: Config): Promise<ICloud> {
	const userSession: ICloud = await getOrCreateUserSession(config);
	return userSession;
}

export async function getICloudContacts(iCloudSession: ICloud): Promise<ICloudContact[]> {
	console.log("Fetching iCloud contacts for", iCloudSession.clientId);
	const iCloudContacts: { contacts: ICloudContact[] } = await iCloudSession.Contacts.list();
	const contacts: ICloudContact[] = iCloudContacts.contacts;
	// console.log(`Found ${contacts.length} iCloud contacts for ${iCloudSession.clientId}`, contacts);
	return contacts;
}

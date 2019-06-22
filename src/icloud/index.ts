import * as ICloud from "apple-icloud";
import { Config } from "@clinq/bridge";
import { ICloudContact } from "../model/icloud.model";

const sessions = new Map<string, ICloud>();

async function getOrCreateUserSession(config: Config): Promise<ICloud> {
	return new Promise((resolve, reject) => {
		const [username, password] = config.apiKey.split(":");
		const cachedSession = sessions.get(config.apiKey);
		const instance = new ICloud(cachedSession || {}, username, password);
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
		instance.on("sessionUpdate", function() {
			console.log("Session updated", instance.clientId);
			sessions.set(config.apiKey, instance.exportSession());
		});
	});
}

export async function getICloudSession(config: Config): Promise<ICloud> {
	const userSession = await getOrCreateUserSession(config);
	return userSession;
}

export async function getICloudContacts(iCloudSession: ICloud): Promise<ICloudContact[]> {
	console.log("Fetching iCloud contacts for", iCloudSession.clientId);
	const iCloudContacts = await iCloudSession.Contacts.list();
	const contacts = iCloudContacts.contacts;
	// console.log(`Found ${contacts.length} iCloud contacts for ${iCloudSession.clientId}`, contacts);
	return contacts;
}

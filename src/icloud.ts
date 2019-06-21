import * as iCloud from "apple-icloud";
import { Config } from "@clinq/bridge";

const SESSION_PATH = "/tmp/session.json";

async function initSession(instance: any) {
	return new Promise((resolve, reject) => {
		instance.on("err", function(err) {
			reject(err);
		});
		instance.on("ready", async function() {
			// This event fires when your session is ready to use. If you used a valid session as argument, it will be fired directly after calling 'new iCloud()' but sometimes your session is invalid and the constructor has to re-login your account. In this case this event will be fired after the time that is needed to login your account.
			console.log("iCloud client ready", instance.clientId);
			instance.saveSession(SESSION_PATH);
			resolve(instance);
		});
	});
}

export async function getSession(config: Config) {
	const [username, password] = config.apiKey.split(":");
	const iCloudInstance = new iCloud(SESSION_PATH, username, password);
	return await initSession(iCloudInstance);
}

export async function getContacts(iCloudSession: any) {
	console.log("Get contact for", iCloudSession.clientId);
	return await iCloudSession.Contacts.list();
}

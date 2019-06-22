import * as ICloud from "apple-icloud";
import { Config } from "@clinq/bridge";

const SESSION_PATH = "/tmp/session.json";

async function initSession(instance: ICloud): Promise<ICloud> {
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

export async function getICloudSession(config: Config): ICloud {
	const [username, password] = config.apiKey.split(":");
	const instance = new ICloud(SESSION_PATH, username, password);
	return await initSession(instance);
}

export async function getICloudContacts(iCloudSession: ICloud) {
	const iCloudContacts = await iCloudSession.Contacts.list();
	console.log(`Found ${iCloudContacts.contacts.length} iCloud contacts for ${iCloudSession.clientId}`);
	return iCloudContacts;
}

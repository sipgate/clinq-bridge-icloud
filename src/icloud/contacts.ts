import * as ICloud from "apple-icloud";
import { promisify } from "util";
import { ICloudContact } from "../model/icloud.model";

export async function getAllICloudContacts(iCloudSession: ICloud): Promise<ICloudContact[]> {
	const { contacts } = await promisify(iCloudSession.Contacts.list)();
	console.log(`Found ${contacts.length} iCloud contacts`, { clientId: iCloudSession.clientId });
	return contacts;
}

export async function updateICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContact> {
	return promisify(iCloudSession.Contacts.change)(contact);
}

export async function createICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContact> {
	return promisify(iCloudSession.Contacts.new)(contact);
}

export async function deleteICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<any> {
	return promisify(iCloudSession.Contacts.delete)(contact);
}

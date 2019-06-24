import { ServerError } from "@clinq/bridge";
import * as ICloud from "apple-icloud";
import { promisify } from "util";
import { CreateContactResponse as ICloudContactUpdateResponse, ICloudContact } from "../model/icloud.model";

export async function getAllICloudContacts(iCloudSession: ICloud): Promise<ICloudContact[]> {
	const { contacts } = await promisify(iCloudSession.Contacts.list)();
	console.log(`Fetched ${contacts.length} iCloud contacts`, { clientId: iCloudSession.clientId });
	return contacts;
}

export async function updateICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContactUpdateResponse> {
	return promisify(iCloudSession.Contacts.change)(contact);
}

export async function createICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContactUpdateResponse> {
	// Call list() here because apple expects a syncToken that is obtained during that operation
	await getAllICloudContacts(iCloudSession);
	return promisify(iCloudSession.Contacts.new)(contact);
}

export async function deleteICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<any> {
	return promisify(iCloudSession.Contacts.delete)(contact);
}

export async function getContactById(iCloudSession: ICloud, contactId: string): Promise<ICloudContact> {
			const contacts: ICloudContact[] = await getAllICloudContacts(iCloudSession);
			const contact: ICloudContact = contacts.find(c => c.contactId === contactId);
			if (!contact) {
				console.warn("Contact not found", { contactId });
				throw new ServerError(404, "Unknown contact");
			}
			return contact;
}

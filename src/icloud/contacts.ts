import * as ICloud from "apple-icloud";
import { ICloudContact } from "../model/icloud.model";
import { handleApiError } from "./util";

export async function getAllICloudContacts(iCloudSession: ICloud): Promise<ICloudContact[]> {
	console.log("Fetching iCloud contacts for", iCloudSession.clientId);
	const iCloudContacts: { contacts: ICloudContact[] } = await iCloudSession.Contacts.list();
	const contacts: ICloudContact[] = iCloudContacts.contacts;
	console.log(`Found ${contacts.length} iCloud contacts for ${iCloudSession.clientId}`);
	return contacts;
}

export async function updateICloudContact(iCloudSession: ICloud, contact: any): Promise<ICloudContact> {
	console.log(`Updating iCloud contact ${contact.contactId}`, { contact });
	iCloudSession.Contacts.change(contact, (err, result) => {
		handleApiError("Cannot update iCloud contact", err);
		console.log(`Updated iCloud contact ${contact.contactId}`, { result });
	});
	return contact;
}

export async function createICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContact> {
	console.log(`Creating iCloud contact`, { contact });
	iCloudSession.Contacts.new(contact, (err, result) => {
		handleApiError("Cannot create iCloud contact", err);
		console.log(`Created iCloud contact ${contact.contactId}`, { result });
	});
	return contact;
}

export async function deleteICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<void> {
	console.log(`Deleting iCloud contact ${contact.contactId}`, contact);
	iCloudSession.Contacts.delete(contact, (err, result) => {
		handleApiError("Cannot delete iCloud contact", err);
		console.log(`Deleted iCloud contact ${contact.contactId}`, { result });
	});
}

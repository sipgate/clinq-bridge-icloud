import * as ICloud from "apple-icloud";
import { ICloudContact } from "../model/icloud.model";

export async function getAllICloudContacts(iCloudSession: ICloud): Promise<ICloudContact[]> {
	return new Promise((resolve, reject) => {
		console.log("Fetching iCloud contacts for", iCloudSession.clientId);
		iCloudSession.Contacts.list((err, result) => {
			if (err) {
				console.error("Error fething iCloud contacts", err);
				reject(err);
			} else {
				const { contacts } = result;
				console.log(`Found ${contacts.length} iCloud contacts for ${iCloudSession.clientId}`);
				resolve(contacts);
			}
		});
	});
}

export async function updateICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContact> {
	return new Promise((resolve, reject) => {
		console.log(`Updating iCloud contact ${contact.contactId}`, { contact });
		iCloudSession.Contacts.change(contact, (err, result) => {
			if (err) {
				console.error("Error updating iCloud contact", err);
				reject(err);
			} else {
				console.log(`Updated iCloud contact ${contact.contactId}`, { result });
				resolve(result);
			}
		});
	});
}

export async function createICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<ICloudContact> {
	return new Promise((resolve, reject) => {
		console.log(`Creating iCloud contact`, { contact });
		iCloudSession.Contacts.new(contact, (err, result) => {
			if (err) {
				console.error("Error creating iCloud contact", err);
				reject(err);
			} else {
				console.log(`Created iCloud contact ${contact.contactId}`);
				resolve(result);
			}
		});
	});
}

export async function deleteICloudContact(iCloudSession: ICloud, contact: ICloudContact): Promise<any> {
	return new Promise((resolve, reject) => {
		iCloudSession.Contacts.delete(contact, (err, result) => {
			if (err) {
				console.error("Error deleting iCloud contact", err);
				reject(err);
			} else {
				console.log(`Deleted iCloud contact ${contact.contactId}`);
				resolve(result);
			}
		});
	});
}

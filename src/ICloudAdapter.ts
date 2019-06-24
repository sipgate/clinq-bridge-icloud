import { Adapter, Config, Contact, ContactUpdate, ServerError } from "@clinq/bridge";
import * as ICloud from "apple-icloud";
import * as redis from "redis";
import { deleteICloudContact, getAllICloudContacts, getICloudSession, updateICloudContact } from "./icloud";
import { convertToClinqContact, getICloudPhoneNumberLabel } from "./mapper";
import { ICloudContact } from "./model/icloud.model";
import { handleApiError } from "./util/error";
import { PromiseRedisClient } from "./util/promise-redis-client";

export class ICloudAdapter implements Adapter {

	private redisClient: PromiseRedisClient;

	constructor(redisUrl?: string) {
		if(!redisUrl) {
			console.warn("No REDIS_URL url provided.");
			return;
		}
		const client: redis.RedisClient = redis.createClient({
			url: redisUrl
		});
		this.redisClient = new PromiseRedisClient(client);

		console.log(`Initialized Redis storage with URL ${redisUrl} .`);
		client.on("error", error => {
			console.warn("Redis error: ", error.message);
		});
	}

	public async getContacts(config: Config): Promise<Contact[]> {
		try {
			const session: ICloud = await getICloudSession(config, this.redisClient);
			const contacts: ICloudContact[] = await getAllICloudContacts(session);
			return contacts.map(convertToClinqContact);
		} catch (e) {
			handleApiError("Error fetching contacts", e);
		}
	}

	public async deleteContact(config: Config, id: string): Promise<void> {
		try {
			const session: ICloud = await getICloudSession(config, this.redisClient);
			const contacts: ICloudContact[] = await getAllICloudContacts(session);
			const contactToDelete: ICloudContact = contacts.find(c => c.contactId === id);
			await deleteICloudContact(session, contactToDelete);
		} catch (e) {
			handleApiError("Error deleting contact", e);
		}
	}

	public async updateContact(config: Config, id: string, contact: ContactUpdate): Promise<Contact> {
		try {
			const session: ICloud = await getICloudSession(config,this.redisClient);
			const contacts: ICloudContact[] = await getAllICloudContacts(session);
			const contactToUpdate: ICloudContact = contacts.find(c => c.contactId === id);
			if (!contactToUpdate) {
				throw new Error("Contact unknown");
			}
			const updatedContact: ICloudContact = await updateICloudContact(session, {
				...contactToUpdate,
				firstName: contact.firstName,
				lastName: contact.lastName,
				companyName: contact.organization,
				phones: contact.phoneNumbers.map(p => ({
					field: p.phoneNumber,
					label: getICloudPhoneNumberLabel(p.label)
				}))
			});
			return convertToClinqContact(updatedContact);
		} catch (e) {
			handleApiError("Error updating contact", e);
		}
	}
}

import { Adapter, Config, Contact, ContactTemplate, ContactUpdate, ServerError } from "@clinq/bridge";
import * as ICloud from "apple-icloud";
import { head } from "lodash";
import * as redis from "redis";
import {
	createICloudContact,
	deleteICloudContact,
	getAllICloudContacts,
	getContactById,
	getICloudSession,
	updateICloudContact
} from "./icloud";
import { convertToClinqContact, convertToICloudContact, getICloudPhoneNumberLabel } from "./mapper";
import { ICloudContact } from "./model/icloud.model";
import { handleICloudApiError } from "./util/api";
import { PromiseRedisClient } from "./util/promise-redis-client";

export class ICloudAdapter implements Adapter {
	private redisClient: PromiseRedisClient;

	constructor(redisUrl?: string) {
		if (!redisUrl) {
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
			handleICloudApiError("Error fetching contacts", e);
		}
	}

	public async deleteContact(config: Config, contactId: string): Promise<void> {
		try {
			const session: ICloud = await getICloudSession(config, this.redisClient);
			const contact: ICloudContact = await getContactById(session, contactId);
			await deleteICloudContact(session, contact);
			console.log("Contact successfully deleted", { contactId });
		} catch (e) {
			handleICloudApiError("Error deleting contact", e);
		}
	}

	public async createContact(config: Config, contact: ContactTemplate): Promise<Contact> {
		try {
			const session: ICloud = await getICloudSession(config, this.redisClient);
			const iCloudContact: ICloudContact = convertToICloudContact(contact);
			const { contacts }: { contacts: ICloudContact[] } = await createICloudContact(session, iCloudContact);
			const createdContact: ICloudContact = head(contacts);
			if (createdContact) {
				console.log("Contact successfully created", { contactId: createdContact.contactId });
				return convertToClinqContact(createdContact);
			}
			console.log("Contact successfully created");
			return null;
		} catch (e) {
			handleICloudApiError("Error creating contact", e);
		}
	}

	public async updateContact(config: Config, contactId: string, contactUpdate: ContactUpdate): Promise<Contact> {
		try {
			const session: ICloud = await getICloudSession(config, this.redisClient);
			const contact: ICloudContact = await getContactById(session, contactId);
			const updateRequest: ICloudContact = {
				contactId: contact.contactId,
				...convertToICloudContact(contactUpdate)
			};
			const { contacts } = await updateICloudContact(session, updateRequest);
			console.log("Contact successfully updated", { contactId });
			const updatedContact: ICloudContact = head(contacts);
			return updatedContact ? convertToClinqContact(updatedContact) : null;
		} catch (e) {
			handleICloudApiError("Error updating contact", e);
		}
	}
}

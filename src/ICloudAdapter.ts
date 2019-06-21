import { Adapter, Config, Contact } from "@clinq/bridge";
import { getSession, getContacts } from "./icloud";

function mapToClinqContacts(icloudContacts: any): Contact[] {
	const { contacts } = icloudContacts;
	console.log("Mapping icloud contacts", contacts);
	const mapped = contacts.map(c => {
		const phoneNumbers = c.phones
			? c.phones.map(p => ({
					phoneNumber: p.field,
					label: p.label
			  }))
			: [];
		return {
			id: c.contactId,
			name: null,
			firstName: c.firstName,
			lastName: c.lastName,
			organization: c.companyName || null,
			email: null,
			phoneNumbers,
			contactUrl: null,
			avatarUrl: null
		};
	});

	console.log("Mapped contacts", mapped);
	return mapped;
}

export class ICloudAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		const session = await getSession(config);
		const contacts = await getContacts(session);
		return mapToClinqContacts(contacts);
	}
}

import { Adapter, Config, Contact } from "@clinq/bridge";
import { getICloudContacts, getICloudSession } from "./icloud";

function mapToClinqContacts(icloudContacts: any): Contact[] {
	const { contacts } = icloudContacts;
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

	return mapped;
}

export class ICloudAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		const session = await getICloudSession(config);
		const contacts = await getICloudContacts(session);
		return mapToClinqContacts(contacts);
	}
}

import { Adapter, Config, Contact, PhoneNumber, PhoneNumberLabel } from "@clinq/bridge";
import { getICloudContacts, getICloudSession } from "./icloud";
import { ICloudContact } from "./model/icloud.model";

function parsePhoneNumberLabel(label: string = ""): PhoneNumberLabel {
	switch (label.toLowerCase()) {
		case "mobile":
			return PhoneNumberLabel.MOBILE;
		case "home":
			return PhoneNumberLabel.HOME;
		default:
			return PhoneNumberLabel.WORK;
	}
}

function parseEmailAddress(c: ICloudContact): string {
	return c.emailAddresses ? c.emailAddresses.map(e => e.field).find(e => Boolean(e)) : null;
}

function mapPhoneNumbers(c: ICloudContact): PhoneNumber[] {
	return c.phones
		? c.phones.map(p => ({
				phoneNumber: p.field,
				label: parsePhoneNumberLabel(p.label)
		  }))
		: [];
}

function mapToClinqContacts(icloudContacts: ICloudContact[]): Contact[] {
	return icloudContacts.map(c => {
		const phoneNumbers = mapPhoneNumbers(c);
		return {
			id: c.contactId,
			name: `${c.firstName} ${c.lastName}`,
			firstName: c.firstName,
			lastName: c.lastName,
			organization: c.companyName || null,
			email: parseEmailAddress(c),
			phoneNumbers,
			contactUrl: null,
			avatarUrl: null
		};
	});
}

export class ICloudAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		const session = await getICloudSession(config);
		const contacts = await getICloudContacts(session);
		return mapToClinqContacts(contacts);
	}
}


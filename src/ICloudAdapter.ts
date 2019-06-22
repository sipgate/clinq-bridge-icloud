import { Adapter, Config, Contact, PhoneNumber, PhoneNumberLabel } from "@clinq/bridge";
import { getICloudContacts, getICloudSession } from "./icloud";
import { ICloudContact, ICloudPhoneNumberLabel } from "./model/icloud.model";

function parsePhoneNumberLabel(label: string): ICloudPhoneNumberLabel {
	switch (label) {
		case "HOME":
			return ICloudPhoneNumberLabel.HOME;
		case "WORK":
			return ICloudPhoneNumberLabel.WORK;
		case "MOBILE":
		case "IPHONE":
			return ICloudPhoneNumberLabel.MOBILE;
		case "HOME FAX":
			return ICloudPhoneNumberLabel.HOMEFAX;
		case "WORK FAX":
			return ICloudPhoneNumberLabel.WORKFAX;
		case "OTHER":
			return ICloudPhoneNumberLabel.OTHER;
		default:
			// hack to allow all labels
			return ((label || ICloudPhoneNumberLabel.OTHER) as unknown) as ICloudPhoneNumberLabel;
	}
}

function parseEmailAddress(c: ICloudContact): string {
	return c.emailAddresses ? c.emailAddresses.map(e => e.field).find(e => Boolean(e)) : null;
}

function mapPhoneNumbers(c: ICloudContact): PhoneNumber[] {
	return c.phones
		? c.phones.map(p => ({
				phoneNumber: p.field,
				label: (parsePhoneNumberLabel(p.label) as unknown) as PhoneNumberLabel
		  }))
		: [];
}

function convertToClinqContacts(icloudContacts: ICloudContact[]): Contact[] {
	return icloudContacts.map(c => {
		const phoneNumbers = mapPhoneNumbers(c);
		return {
			id: c.contactId || null,
			name: null,
			firstName: c.firstName || null,
			lastName: c.lastName || null,
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
		return convertToClinqContacts(contacts);
	}
}



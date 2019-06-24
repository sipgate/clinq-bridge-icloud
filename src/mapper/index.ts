import { Contact, PhoneNumber, PhoneNumberLabel } from "@clinq/bridge";
import { ICloudContact, ICloudPhoneNumberLabel } from "../model/icloud.model";

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

export function getICloudPhoneNumberLabel(label: string): string {
	switch (label) {
		case "HOME":
		case "WORK":
		case "MOBILE":
		case "OTHER":
			return label;
		case ICloudPhoneNumberLabel.HOMEFAX:
			return "HOME FAX";
		case ICloudPhoneNumberLabel.WORKFAX:
			return "WORK FAX";
		default:
			return label || ICloudPhoneNumberLabel.OTHER;
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

export function convertToClinqContact(icloudContact: ICloudContact): Contact {
	const phoneNumbers: PhoneNumber[] = mapPhoneNumbers(icloudContact);
	return {
		id: icloudContact.contactId || null,
		name: null,
		firstName: icloudContact.firstName || null,
		lastName: icloudContact.lastName || null,
		organization: icloudContact.companyName || null,
		email: parseEmailAddress(icloudContact),
		phoneNumbers,
		contactUrl: null,
		avatarUrl: null
	};
}

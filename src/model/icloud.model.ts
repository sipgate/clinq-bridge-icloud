export interface ICloudContact {
	firstName: string;
	lastName: string;
	notes: string;
	contactId: string;
	normalized: string;
	prefix: string;
	companyName?: string;
	phones: Array<{
		field: string;
		label: string;
	}>;
	emailAddresses?: Array<{
		field: string;
		label: string;
	}>;
	etag: string;
	middleName: string;
	isCompany: boolean;
	suffix: string;
}

export enum ICloudPhoneNumberLabel {
	HOME = "HOME",
	WORK = "WORK",
	MOBILE = "MOBILE",
	HOMEFAX = "HOMEFAX",
	WORKFAX = "WORKFAX",
	PAGER = "PAGER",
	MAIN = "MAIN",
	OTHER = "OTHER"
}

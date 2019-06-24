export interface ICloudContact {
	firstName?: string;
	lastName?: string;
	notes?: string;
	contactId?: string;
	normalized?: string;
	prefix?: string;
	companyName?: string;
	phones?: Array<{
		field: string;
		label: string;
	}>;
	emailAddresses?: Array<{
		field: string;
		label: string;
	}>;
	etag?: string;
	middleName?: string;
	isCompany?: boolean;
	suffix?: string;
	photo?: {
		signature: string;
		url: string;
		crop: {
			x: number;
			width: number;
			y: number;
			height: number;
		};
	};
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

export interface IExportedCloudSession {
	username: string;
	password: string;
	twoFactorAuthentication: boolean;
	securityCode: string;
	auth: {
		token: string;
		xAppleTwosvTrustToken: string;
		cookies: any[];
		created: number;
	};
	clientId: string;
	push: {
		topics: any[];
		token: string;
		ttl: number;
		courierUrl: string;
		registered: any[];
	};
	account: any;
	logins: any[];
	clientSettings: any;
}

export interface CreateContactResponse {
	contacts: ICloudContact[];
}

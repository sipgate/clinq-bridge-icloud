import { Adapter, Config, Contact } from "@clinq/bridge";

export class ICloudAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		return [];
	}
}

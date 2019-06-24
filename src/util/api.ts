import { ServerError } from "@clinq/bridge";

export function handleICloudApiError(message: string, error: any): void {
	if (error) {
		console.log(error);
		const { errorCode, errorReason } = error;
		if (errorCode && errorReason) {
			throw new ServerError(500, `iCloud API error - ${message}: ${errorCode} ${errorReason}`);
		} else {
			throw new ServerError(500, `${message} - ${error.message}`);
		}
	}
}

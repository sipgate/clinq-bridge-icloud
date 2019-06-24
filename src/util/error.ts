import { ServerError } from "@clinq/bridge";

export function handleApiError(message: string, error: any): void {
	if (error) {
		throw new ServerError(500, `iCloud API error - ${message}: ${error.errorCode} ${error.errorReason}`);
	}
}
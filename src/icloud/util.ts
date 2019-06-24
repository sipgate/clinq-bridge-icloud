
export function handleApiError(message:string, error: any): void  {
	if(error) {
		throw new Error(`iCloud API error - ${message}: ${error.errorCode} ${error.errorReason}`);
	}
}
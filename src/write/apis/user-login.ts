import 'isomorphic-fetch';

import { apiErrorType, ErrorWithData } from '../../utils/error';

export const userLoginApi = async ({
	email,
	password,
	apiHost,
	apiKey,
	appName,
	requestContext: {
		remoteIp,
		browserUserAgent: userAgent,
		countryCode
	}
}) => {
	const errorMsg = 'Could not log user in';
	const url = `${apiHost}/idm/v1/reauthenticate`;
	const platform = `n-user-api-client-${appName}`;
	try {
		if (!password) {
			throw new Error('password not supplied to userLoginApi');
		}
		const body = {
			email,
			password,
			rememberMe: true,
			context: {
				remoteIp,
				userAgent,
				countryCode,
				platform
			}
		};
		const options = {
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey,
				'User-Agent': platform
			},
			method: 'POST',
			body: JSON.stringify(body)
		} as RequestInit;

		const response = await fetch(url, options);
		if (response.ok) {
			return await response.json();
		}
		throw new Error(apiErrorType(response.status));
	} catch (error) {
		throw new ErrorWithData(errorMsg, {
			url,
			error
		});
	}
};

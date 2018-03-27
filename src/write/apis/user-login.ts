import 'isomorphic-fetch';

import { apiErrorType, ErrorWithData } from '../../utils/error';

export const userLoginApi = async ({ email, password, apiHost, apiKey }) => {
	const errorMsg = 'Could not log user in';
	const url = `${apiHost}/login`;
	try {
		if (!password) {
			throw new Error('password not supplied to userLoginApi');
		}
		const body = {
			email,
			password,
			rememberMe: true
		};
		const options = {
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': apiKey
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

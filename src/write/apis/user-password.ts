import 'isomorphic-fetch';

import { apiErrorType, ErrorWithData } from '../../utils/error';

export const updateUserPasswordApi = async ({
	userId,
	passwordData,
	authToken,
	apiHost,
	apiKey
}) => {
	const errorMsg = 'Could not change user password';
	const url = `${apiHost}/users/${userId}/credentials/change-password`;
	const body = {
		password: passwordData.newPassword,
		oldPassword: passwordData.oldPassword,
		reasonForChange: 'owner-requested'
	};
	const options = {
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey,
			Authorization: `Bearer ${authToken}`
		},
		method: 'POST',
		body: JSON.stringify(body)
	} as RequestInit;

	try {
		const response = await fetch(url, options);
		if (response.ok) {
			return passwordData.newPassword;
		}
		throw new Error(apiErrorType(response.status));
	} catch (error) {
		throw new ErrorWithData(errorMsg, {
			url,
			error
		});
	}
};

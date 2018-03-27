import 'isomorphic-fetch';
import { errorTypes, ErrorWithData } from '../../utils/error';
import { isSessionStale } from '../transforms/session-freshness';

export const getSessionData = async ({ session, apiHost, apiKey }) => {
	const url = `${apiHost}/sessions/s/${session}`;
	const errorMsg = 'Could not get session data';
	const options = {
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey
		},
		method: 'GET'
	};
	const response = await fetch(url, options);
	if (response.ok) {
		const body = await response.json();
		if (!body.uuid)
			throw new ErrorWithData('Valid user ID not returned', {
				type: errorTypes.API
			});
		return {
			userId: body.uuid,
			isSessionStale: isSessionStale(body.creationTime)
		};
	}
	throw new ErrorWithData(errorMsg, {
		url,
		statusCode: response.status,
		type: response.status === 403 ? errorTypes.API_KEY : errorTypes.API
	});
};

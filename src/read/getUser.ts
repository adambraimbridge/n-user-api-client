import { canned } from '@financial-times/n-memb-gql-client';
import { logger } from '../utils/logger';
import { GraphQlUserApiResponse } from '../types';
import * as R from 'ramda';
import { readTransforms } from './transforms';
import { ErrorWithData, errorTypes } from '../utils/error';
import { getSessionData } from './apis/session-service';
import { validateOptions } from '../utils/validate';

const handleGraphQlError = (res: any, defaultErrorMsg: string, data?: any): Error => {
	let errorMsg = defaultErrorMsg;
	if (res && !res._ok && res.errors.length) {
		errorMsg = res.errors[0].message;
	}
	const error = new ErrorWithData(errorMsg, {
		...data,
		statusCode: 500
	});
	logger.error(errorMsg);
	return error;
};

export const getUserBySession = async (session: string): Promise<GraphQlUserApiResponse> => {
	let res;
	const graphQlQuery = 'mma-user-by-session';
	try {
		if (!session) {
			throw new ErrorWithData('Session not supplied', {
				type: errorTypes.VALIDATION
			});
		}
		res = await canned(graphQlQuery, { session }, { timeout: 10000 });
		const user = R.path(['data', 'user'], res);
		if (user) {
			const transformed = readTransforms(user);
			return transformed;
		}
	} catch (error) {
		const errorMsg =
			error.data && error.data.type === errorTypes.VALIDATION
				? error.message
				: 'Unable to retrieve user';
		throw handleGraphQlError(res, errorMsg, {
			graphQlQuery,
			error
		});
	}
};

export const getUserIdAndSessionData = async (opts): Promise<any> => {
	validateOptions(opts, null, ['session', 'apiHost', 'apiKey']);
	return await getSessionData(opts);
};

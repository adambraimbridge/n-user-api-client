import {canned} from '@financial-times/n-memb-gql-client';
import {metrics} from '@financial-times/n-ui';
import {logger} from '../utils/logger';
import {GraphQlUserApiResponse} from '../types';
import * as R from 'ramda';
import {readTransforms} from './transforms';
import {ErrorWithData} from '../utils/error';

const handleError = (res, defaultErrorMsg, data) => {
    let errorMsg = defaultErrorMsg;
    if (res && !res._ok && res.errors.length)
        errorMsg = res.errors[0].message;
    metrics.count(`graphQl.${data.graphQlQuery}.failure`, 1);
    const error = new ErrorWithData(errorMsg, {
        endpoint: data.graphQlQuery,
        session: data.session,
        statusCode: 500
    });
    logger.error(errorMsg);
    return error;
};

export const getUserBySession = ({session, demographicsLists}:{session: string, demographicsLists?: any}): Promise<GraphQlUserApiResponse> => {
    return new Promise(async (resolve, reject) => {
        let res;
        const graphQlQuery = 'mma-user-by-session';
        try {
            res = await canned(graphQlQuery, {session}, {timeout: 10000});
            const user = R.path(['data', 'user'], res);
            if (user) {
                const transformed = readTransforms(user, demographicsLists);
                return resolve(transformed);
            }
        } catch (err) {
            let defaultErrorMsg = `Unable to retrieve user for session ${session}`;
            const error = handleError(res, defaultErrorMsg, {
                graphQlQuery, err, session
            });
            reject(error);
        }
    });
};

export const getUserIdBySession = (session: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const graphQlQuery = 'user-id-by-session';
        let res;
        try {
            res = await canned(graphQlQuery, {session}, {timeout: 5000});
            const userId = R.path(['data', 'userBySession', 'id'], res);
            if (userId)
                return resolve(userId);
        } catch (err) {
            let defaultErrorMsg = `Unable to retrieve userId for session ${session}`;
            const error = handleError(res, defaultErrorMsg, {
                graphQlQuery, err, session
            });
            reject(error);
        }
    });
};
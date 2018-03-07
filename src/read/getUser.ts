import {canned} from '@financial-times/n-memb-gql-client';
import {metrics} from '@financial-times/n-ui';
import {logger} from '../utils/logger';
import {GraphQlUserApiResponse} from '../types';
import * as R from 'ramda';
import {readTransforms} from './transforms';
import {ErrorWithData, errorTypes} from '../utils/error';

const handleError = (res: any, defaultErrorMsg: string, data?: any) => {
    let errorMsg = defaultErrorMsg;
    if (res && !res._ok && res.errors.length)
        errorMsg = res.errors[0].message;
    if (data.graphQlQuery)
        metrics.count(`graphQl.${data.graphQlQuery}.failure`, 1);
    const error = new ErrorWithData(errorMsg, {
        ...data,
        statusCode: 500
    });
    logger.error(errorMsg);
    return error;
};

export const getUserBySession = (session: string): Promise<GraphQlUserApiResponse> => {
    return new Promise(async (resolve, reject) => {
        let res;
        const graphQlQuery = 'mma-user-by-session';
        try {
            if (!session)
                throw new ErrorWithData('Session not supplied', { type: errorTypes.VALIDATION});
            res = await canned(graphQlQuery, {session}, {timeout: 10000});
            const user = R.path(['data', 'user'], res);
            if (user) {
                const transformed = readTransforms(user);
                return resolve(transformed);
            }
        } catch (err) {
            let defaultErrorMsg = err.data && err.data.type === errorTypes.VALIDATION ? err.message : 'Unable to retrieve user';
            const error = handleError(res, defaultErrorMsg, {
                graphQlQuery, err
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
            if (!session)
                throw new ErrorWithData('Session not supplied', { type: errorTypes.VALIDATION});
            res = await canned(graphQlQuery, {session}, {timeout: 5000});
            const userId = R.path(['data', 'userBySession', 'id'], res);
            if (userId)
                return resolve(userId);
        } catch (err) {
            let defaultErrorMsg = err.data && err.data.type === errorTypes.VALIDATION ? err.message : 'Unable to retrieve userId';
            const error = handleError(res, defaultErrorMsg, {
                graphQlQuery, err, session
            });
            reject(error);
        }
    });
};
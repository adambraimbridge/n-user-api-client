import {canned} from '@financial-times/n-memb-gql-client';
import {metrics} from '@financial-times/n-ui';
import {logger} from '../logger';
import {GraphQlUserApiResponse} from '../types';
import * as R from 'ramda';
import {graphQlToUserApi} from './transforms/graphql-to-user-api';

const handleError = (res, defaultErrorMsg, graphQlQuery) => {
    let errorMsg = defaultErrorMsg;
    if (!res._ok && res.errors.length)
        errorMsg = res.errors[0].message;
    logger.error(errorMsg);
    metrics.count(`graphQl.${graphQlQuery}.failure`, 1);
    return new Error(errorMsg);
};

export const getUserBySession = (session: string): Promise<GraphQlUserApiResponse> => {
    return new Promise(async (resolve, reject) => {
        const graphQlQuery = 'mma-user-by-session';
        const res = await canned(graphQlQuery, {session}, {timeout: 10000});
        const user = R.path(['data', 'user'], res);
        if (user) {
            const transformed = graphQlToUserApi(user);
            return resolve(transformed);
        }
        let defaultErrorMsg = `Unable to retrieve user for session ${session}`;
        const error = handleError(res, defaultErrorMsg, graphQlQuery);
        reject(error);
    });
};

export const getUserIdBySession = (session: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const graphQlQuery = 'user-id-by-session';
        const res = await canned(graphQlQuery, {session}, {timeout: 5000});
        const userId = R.path(['data', 'userBySession', 'id'], res);
        if (userId)
            return resolve(userId);
        let defaultErrorMsg = `Unable to retrieve userId for session ${session}`;
        handleError(res, defaultErrorMsg, graphQlQuery);
        const error = handleError(res, defaultErrorMsg, graphQlQuery);
        reject(error);
    });
};
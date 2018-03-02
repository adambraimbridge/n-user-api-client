"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_memb_gql_client_1 = require("@financial-times/n-memb-gql-client");
const n_ui_1 = require("@financial-times/n-ui");
const logger_1 = require("../logger");
const R = require("ramda");
const graphql_to_user_api_1 = require("./transforms/graphql-to-user-api");
const handleError = (res, defaultErrorMsg, graphQlQuery) => {
    let errorMsg = defaultErrorMsg;
    if (!res._ok && res.errors.length)
        errorMsg = res.errors[0].message;
    logger_1.logger.error(errorMsg);
    n_ui_1.metrics.count(`graphQl.${graphQlQuery}.failure`, 1);
    return new Error(errorMsg);
};
exports.getUserBySession = ({ session, demographicsLists }) => {
    return new Promise(async (resolve, reject) => {
        const graphQlQuery = 'mma-user-by-session';
        const res = await n_memb_gql_client_1.canned(graphQlQuery, { session }, { timeout: 10000 });
        const user = R.path(['data', 'user'], res);
        if (user) {
            const transformed = graphql_to_user_api_1.graphQlToUserApi(user, demographicsLists);
            return resolve(transformed);
        }
        let defaultErrorMsg = `Unable to retrieve user for session ${session}`;
        const error = handleError(res, defaultErrorMsg, graphQlQuery);
        reject(error);
    });
};
exports.getUserIdBySession = (session) => {
    return new Promise(async (resolve, reject) => {
        const graphQlQuery = 'user-id-by-session';
        const res = await n_memb_gql_client_1.canned(graphQlQuery, { session }, { timeout: 5000 });
        const userId = R.path(['data', 'userBySession', 'id'], res);
        if (userId)
            return resolve(userId);
        let defaultErrorMsg = `Unable to retrieve userId for session ${session}`;
        handleError(res, defaultErrorMsg, graphQlQuery);
        const error = handleError(res, defaultErrorMsg, graphQlQuery);
        reject(error);
    });
};

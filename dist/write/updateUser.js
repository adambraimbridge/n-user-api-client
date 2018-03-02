"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_profile_1 = require("./apis/user-profile");
const user_password_1 = require("./apis/user-password");
const user_login_1 = require("./apis/user-login");
const getUser_1 = require("../read/getUser");
const auth_service_1 = require("./apis/auth-service");
const merge_two_objects_1 = require("./transforms/merge-two-objects");
const getUserAndAuthToken = ({ session, apiHost, apiClientId }) => {
    return Promise.all([
        getUser_1.getUserBySession({ session }),
        auth_service_1.getAuthToken({ session, apiHost, apiClientId })
    ]);
};
const mergeUserUpdateWithFetchedUser = (userUpdate, fetchedUser) => {
    return {
        user: merge_two_objects_1.mergeObjects(fetchedUser.profile, userUpdate.profile)
    };
};
exports.changeUserPassword = async ({ session, apiHost, apiKey, apiClientId, userId, passwordData }) => {
    const [userApiResponse, authToken] = await getUserAndAuthToken({ session, apiHost, apiClientId });
    const password = await user_password_1.updateUserPasswordApi({ userId, passwordData, authToken, apiHost, apiKey });
    return await user_login_1.userLoginApi({ email: userApiResponse.profile.email, password, authToken, apiHost, apiKey });
};
exports.updateUserProfile = async ({ session, apiHost, apiKey, apiClientId, userId, userUpdate }) => {
    const [userApiResponse, authToken] = await getUserAndAuthToken({ session, apiHost, apiClientId });
    const updateMergedWithFetchedUser = mergeUserUpdateWithFetchedUser(userUpdate, userApiResponse);
    return await user_profile_1.updateUserProfileApi({
        userId,
        userUpdate: updateMergedWithFetchedUser,
        authToken,
        apiHost,
        apiKey
    });
};

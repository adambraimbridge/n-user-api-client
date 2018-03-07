import {updateUserProfileApi} from './apis/user-profile';
import {updateUserPasswordApi} from './apis/user-password';
import {userLoginApi} from './apis/user-login';
import {getUserBySession} from '../read/getUser';
import {getAuthToken} from './apis/auth-service';
import {mergeObjects} from './transforms/merge-two-objects';
import {GraphQlUserApiResponse, UpdateUserOptions, UserObject} from '../types';

const getUserAndAuthToken = ({session, apiHost, apiClientId}): Promise<[any, any]> => {
    return Promise.all([
        getUserBySession({session}),
        getAuthToken({session, apiHost, apiClientId})
    ])
};

const mergeUserUpdateWithFetchedUser = ({userUpdate, userApiResponse}: {userUpdate: UserObject, userApiResponse: GraphQlUserApiResponse}) => {
    if (!userApiResponse.profile || !userUpdate.profile)
        throw new Error('mergeUserUpdateWithFetchedUser not supplied with valid user object or update');
    return {
        user: mergeObjects(userApiResponse.profile, userUpdate.profile)
    };
};

const validateStringOptions = (opts, dataOption) => {
    if (!opts)
        throw new Error('Options not supplied');
    const stringOpts = ['session', 'apiHost', 'apiKey', 'apiClientId', 'userId'];
    let invalidOptions = [];
    stringOpts.forEach(stringOpt => {
        if (typeof opts[stringOpt] !== 'string')
            invalidOptions.push(stringOpt);
    });
    if (typeof opts[dataOption] !== 'object')
        invalidOptions.push(dataOption);
    if (invalidOptions.length)
        throw new Error(`Invalid option(s): ${invalidOptions.join(', ')}`);
};

export const changeUserPassword = async (opts: UpdateUserOptions): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            validateStringOptions(opts, 'passwordData');
            const {session, apiHost, apiKey, apiClientId, userId, passwordData} = opts;
            const [userApiResponse, authToken] = await getUserAndAuthToken({session, apiHost, apiClientId});
            const password = await updateUserPasswordApi({userId, passwordData, authToken, apiHost, apiKey});
            resolve(await userLoginApi({email: userApiResponse.profile.email, password, apiHost, apiKey}));
        } catch (err) {
            reject(err);
        }
    });
};

export const updateUserProfile = async (opts: UpdateUserOptions): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            validateStringOptions(opts, 'userUpdate');
            const {session, apiHost, apiKey, apiClientId, userId, userUpdate} = opts;
            const [userApiResponse, authToken] = await getUserAndAuthToken({session, apiHost, apiClientId});
            const updateMergedWithFetchedUser = mergeUserUpdateWithFetchedUser({userUpdate, userApiResponse});
            resolve(await updateUserProfileApi({
                userId,
                userUpdate: updateMergedWithFetchedUser,
                authToken,
                apiHost,
                apiKey
            }));
        } catch (err) {
            reject(err);
        }
    });
};
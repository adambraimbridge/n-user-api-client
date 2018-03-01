import {updateUserProfileApi} from './apis/user-profile';
import {updateUserPasswordApi} from './apis/user-password';
import {getUserBySession} from '../read/getUser';
import {getAuthToken} from './apis/auth-service';
import {mergeObjects} from './transforms/merge-two-objects';
import {GraphQlUserApiResponse, UserObject} from '../types';

const getUserAndAuthToken = ({session, apiHost, apiClientId}) => {
    return Promise.all([
        getUserBySession(session),
        getAuthToken({session, apiHost, apiClientId})
    ])
};

const mergeUserUpdateWithFetchedUser = (userUpdate: UserObject, fetchedUser: GraphQlUserApiResponse) => {
	return{
		user: mergeObjects(fetchedUser.profile, userUpdate.profile)
	};
};

export const changeUserPassword = async ({session, apiHost, apiKey, apiClientId, userId, passwordData}) => {
    const authToken = await getAuthToken({session, apiHost, apiClientId});
    return await updateUserPasswordApi({userId, passwordData, authToken, apiHost, apiKey})
};

export const updateUserProfile = async ({session, apiHost, apiKey, apiClientId, userId, userUpdate}) => {
	const [userApiResponse, authToken] = await getUserAndAuthToken({session, apiHost, apiClientId});
	const updateMergedWithFetchedUser = mergeUserUpdateWithFetchedUser(userUpdate, userApiResponse);
	return await updateUserProfileApi({
		userId,
		userUpdate: updateMergedWithFetchedUser,
		authToken,
		apiHost,
        apiKey
	});
};
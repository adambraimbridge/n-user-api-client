import { updateUserProfileApi } from './apis/user-profile';
import { updateUserPasswordApi } from './apis/user-password';
import { userLoginApi } from './apis/user-login';
import { getUserBySession } from '../read/getUser';
import { getAuthToken } from './apis/auth-service';
import { mergeObjects } from './transforms/merge-two-objects';
import {
	GraphQlUserApiResponse,
	UpdateUserOptions,
	UserObject
} from '../types';
import { validateOptions } from '../utils/validate';

const KEY_PROPERTIES = [
	'session',
	'apiHost',
	'apiKey',
	'apiClientId',
	'userId'
];

const getUserAndAuthToken = ({
	session,
	apiHost,
	apiClientId
}): Promise<[any, any]> => {
	return Promise.all([
		getUserBySession(session),
		getAuthToken({ session, apiHost, apiClientId })
	]);
};

const mergeUserUpdateWithFetchedUser = ({
	userUpdate,
	userApiResponse
}: {
	userUpdate: UserObject;
	userApiResponse: GraphQlUserApiResponse;
}) => {
	if (!userApiResponse.profile || !userUpdate.profile)
		throw new Error(
			'mergeUserUpdateWithFetchedUser not supplied with valid user object or update'
		);
	return {
		user: mergeObjects(userApiResponse.profile, userUpdate.profile)
	};
};

export const changeUserPassword = async (
	opts: UpdateUserOptions
): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		try {
			validateOptions(opts, 'passwordData', KEY_PROPERTIES);
			const {
				session,
				apiHost,
				apiKey,
				apiClientId,
				userId,
				passwordData
			} = opts;
			const [userApiResponse, authToken] = await getUserAndAuthToken({
				session,
				apiHost,
				apiClientId
			});
			const password = await updateUserPasswordApi({
				userId,
				passwordData,
				authToken,
				apiHost,
				apiKey
			});
			resolve(
				await userLoginApi({
					email: userApiResponse.profile.email,
					password,
					apiHost,
					apiKey
				})
			);
		} catch (err) {
			reject(err);
		}
	});
};

export const updateUserProfile = async (
	opts: UpdateUserOptions
): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		try {
			validateOptions(opts, 'userUpdate', KEY_PROPERTIES);
			const {
				session,
				apiHost,
				apiKey,
				apiClientId,
				userId,
				userUpdate
			} = opts;
			const [userApiResponse, authToken] = await getUserAndAuthToken({
				session,
				apiHost,
				apiClientId
			});
			const updateMergedWithFetchedUser = mergeUserUpdateWithFetchedUser({
				userUpdate,
				userApiResponse
			});
			resolve(
				await updateUserProfileApi({
					userId,
					userUpdate: updateMergedWithFetchedUser,
					authToken,
					apiHost,
					apiKey
				})
			);
		} catch (err) {
			reject(err);
		}
	});
};

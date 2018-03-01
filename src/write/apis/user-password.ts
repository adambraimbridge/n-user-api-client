import {ErrorWithData} from '../../error';

export const updateUserPasswordApi = ({userId, passwordData, authToken, apiHost, apiKey}) => {
    return new Promise(async (resolve, reject) => {
        const errorMsg = 'Could not change user password';
        const url = `${apiHost}/users/${userId}/credentials/change-password`;
        const body = {
            password: passwordData.newPassword,
            oldPassword: passwordData.oldPassword,
            reasonForChange: 'reset-password',
            token: authToken
        };
        const options = {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey
            },
            method: 'POST',
            body: JSON.stringify(body)
        } as RequestInit;
        try {
            const response = await fetch(url, options);
            if (response.ok)
                return resolve(response.json());
            reject(new ErrorWithData(errorMsg));
        } catch (err) {
            reject(new ErrorWithData(errorMsg));
        }
    });
};

import {ErrorWithData} from '../../error';

export const userLoginApi = ({email, password, authToken, apiHost, apiKey}) => {
    return new Promise(async (resolve, reject) => {
        const errorMsg = 'Could not log user in';
        const url = `${apiHost}/login`;
        const body = {
            email,
            password,
            rememberMe: true
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

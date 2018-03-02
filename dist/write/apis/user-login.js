"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../error");
exports.userLoginApi = ({ email, password, authToken, apiHost, apiKey }) => {
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
        };
        try {
            const response = await fetch(url, options);
            if (response.ok)
                return resolve(response.json());
            reject(new error_1.ErrorWithData(errorMsg));
        }
        catch (err) {
            reject(new error_1.ErrorWithData(errorMsg));
        }
    });
};

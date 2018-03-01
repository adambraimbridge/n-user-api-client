import * as url from 'url';
import * as querystring from 'querystring';
import {ErrorWithData} from '../../error';
import {logger} from '../../logger';

const parseLocationHeader = res => {
    const locationHeader = res.headers.get('location');
    if (!locationHeader)
        return null;
    const hash = url.parse(locationHeader).hash.replace(/^#/, '');
    return querystring.parse(hash);
};

const parseErrorFromLocationHeader = locationHeaderParams => {
    if (locationHeaderParams.error) {
        let errorType;
        if (locationHeaderParams.error_description.startsWith('Missing ')) {
            errorType = 'MISSING_SESSION_TOKEN';
        } else if (locationHeaderParams.error_description.startsWith('Invalid')) {
            errorType = 'INVALID_SESSION_TOKEN';
        } else if (locationHeaderParams.error === 'invalid_scope') {
            errorType = 'INVALID_SCOPE';
        } else {
            errorType = 'OTHER';
        }
        return new ErrorWithData(`${locationHeaderParams.error}: ${locationHeaderParams.error_description}`, {
            type: errorType,
            error: locationHeaderParams.error,
            description: locationHeaderParams.error_description
        });
    }

    if (!locationHeaderParams.access_token)
        return new ErrorWithData('No access_token in Location header', {type: 'NO_ACCESS_TOKEN'});

    return null;
};

const checkResponseCode = ({res, apiClientId}) => {
    if (res.status === 400)
        return new ErrorWithData('Invalid client ID', {type: 'INVALID_CLIENT_ID', clientId: apiClientId});
    if (res.status !== 302)
        return new ErrorWithData(`Bad response status=${res.status}`, {type: 'UNEXPECTED_RESPONSE'});
    return null;
};

const handleError = (reject, err) => {
    logger.error(err);
    return reject(err);
};

const getFetchOptions = (session: string): RequestInit => ({
    headers: {
        Cookie: `FTSession_s=${session}`
    },
    method: 'GET',
    redirect: 'manual'
});

export const getAuthToken = ({session, apiHost, apiClientId}) => {
    return new Promise(async (resolve, reject) => {
        const params = {
            response_type: 'token',
            client_id: apiClientId
        };

        const url = `${apiHost}/authorize?${querystring.stringify(params)}`;

        const res = await fetch(url, getFetchOptions(session));

        const responseCodeError = checkResponseCode({res, apiClientId});
        if (responseCodeError)
            return handleError(reject, responseCodeError);

        const locationHeaderParams = parseLocationHeader(res);
        if (!locationHeaderParams)
            return handleError(reject, new ErrorWithData('Location header missing', {type: 'LOCATION_HEADER_MISSING'}));

        const locationHeaderError = parseErrorFromLocationHeader(locationHeaderParams);
        if (locationHeaderError)
            return handleError(reject, locationHeaderError);

        resolve(locationHeaderParams.access_token)
    });
};

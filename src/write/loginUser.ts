import { userLoginApi } from './apis/user-login';
import { LoginUserOptions } from '../types';
import { validateOptions } from '../utils/validate';

export const loginUser = (opts: LoginUserOptions): Promise<any> => {
	validateOptions(opts, null, ['email', 'password', 'apiHost', 'apiKey']);
	const { email, password, apiHost, apiKey } = opts;
	return userLoginApi({ email, password, apiHost, apiKey });
};

export interface SimpleListItem {
	description?: string;
	code?: string;
	name?: string;
	selected?: boolean;
}

export interface SimpleList extends Array<SimpleListItem> {}

export interface GraphQlUserApiResponse {
	subscriber: object;
	profile: any;
	id: string;
}

export const UserId: string;

export interface UserHomeAddress {
	line1: string;
	line2: string;
	state: string;
	townCity: string;
	postcode: string;
}

export interface UserMarketing {
	ftByPost: boolean;
	ftByEmail: boolean;
}

export interface UserProfileObject {
	firstName: string;
	lastName: string;
	title: string;
	phoneNumber: string;
	email: string;
	homeAddress: UserHomeAddress;
	marketing: UserMarketing;
}

export interface UserObject {
	profile: UserProfileObject;
	subscription: any;
}

export interface UpdateUserOptions {
	session: string;
	apiHost: string;
	apiKey: string;
	apiClientId: string;
	userId: string;
	passwordData?: any;
	userUpdate?: any;
	remoteIp: string;
	countryCode: string;
	userAgent: string;
	appName: string;
	useTestUserApi?: boolean;
}

export interface LoginUserOptions {
	email: string;
	password: string;
	remoteIp: string;
	countryCode: string;
	userAgent: string;
	apiHost: string;
	apiKey: string;
	appName: string;
}

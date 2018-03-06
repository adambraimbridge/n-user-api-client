const nock = require('nock');

const responses = {
	userIdBySessionSuccess: {
		data: {
			userBySession: {
				id: '123'
			}
		}
	},
	genericError: {
		errors: [{
			message: 'Error message'
		}]
	},
	noSubscription: require('./responses/graphql-no-subscription.json'),
	subscribed: require('./responses/graphql-subscribed.json'),
	unsubscribed: require('./responses/graphql-subscribed.json'),
	trialActive: require('./responses/graphql-trial-active.json'),
	trialCancelled: require('./responses/graphql-trial-cancelled.json'),
	loginSuccess: require('./responses/login-api')
};

const getResponse = (statusCode, responseType) => {
	let response;
	if (statusCode === 200) {
		response = responses[responseType];
		if (!response)
			throw new Error(`The specified Nock response '${responseType}' doesn't exist`);
	}
	return response;
};

const nocks = {
	graphQlUserIdBySession: ({ statusCode = 200 } = {}) => {
		const response = statusCode === 200 ? { data: { userBySession: { id: 'user-456' } } } : {};
		return nock('https://api.ft.com')
			.get('/memb-query/api/user-id-by-session')
			.query(true)
			.reply(statusCode, response);
	},

	graphQlUserBySession: ({ responseType, statusCode = 200 }) => {
		const response = getResponse(statusCode, responseType);

		return nock('https://api.ft.com')
			.get('/memb-query/api/mma-user-by-session')
			.query(true)
			.reply(statusCode, response);
	},

	authApi: ({ statusCode = 302 } = {}) => {
		let authApiNock = nock('https://api.ft.com')
			.defaultReplyHeaders({ Location: 'https://ft.com/signup/upgrade#access_token=a1b2c3' })
			.get('/authorize')
			.query(true)
			.reply(statusCode, function () {
				authApiNock.request = this.req;
			});
		return authApiNock;
	},

	userApi: ({ statusCode = 200, userId } = {}) => {
		let requestBody;
		return nock('https://api.ft.com')
			.put(`/users/${userId}/profile`, body => requestBody = body)
			.reply(statusCode, () => {
				return new Response(requestBody)
			});
	},

	userPasswordApi: ({ statusCode = 200, userId } = {}) => {
		const response = statusCode === 200 ? {} : responses.genericError;
		return nock('https://api.ft.com')
			.post(`/users/${userId}/credentials/change-password`)
			.reply(statusCode, response);
	},

	loginApi: ({ statusCode = 200 } = {}) => {
		const response = statusCode === 200 ? responses.loginSuccess : responses.genericError;
		const loginApiNock = nock('https://api.ft.com')
			.post('/login', body => loginApiNock.requestBody = body)
			.reply(statusCode, response);
		return loginApiNock;
	}

};

afterEach(() => {
	nock.cleanAll();
});

module.exports = nocks;
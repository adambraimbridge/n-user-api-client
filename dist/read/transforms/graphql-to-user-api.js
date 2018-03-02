"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
const static_data_1 = require("../static-data");
const selectValueInList = (list, userValue) => {
    if (!userValue)
        return list;
    return list.map((item) => ({
        description: item.description,
        code: item.code,
        selected: item.code === userValue
    }));
};
exports.addListsToUserData = (userData) => {
    return R.mergeDeepWith((a, b) => b ? b : a, userData, {
        profile: {
            titles: selectValueInList(static_data_1.titles, userData.profile.title),
            demographics: {
                positions: selectValueInList(static_data_1.demographics.positions, userData.profile.demographics.position.code),
                industries: selectValueInList(static_data_1.demographics.industries, userData.profile.demographics.industry.code),
                responsibilities: selectValueInList(static_data_1.demographics.responsibilities, userData.profile.demographics.responsibility.code)
            }
        }
    });
};
exports.graphQlToUserApi = (user, addListsToResponse) => {
    let transformed = R.clone(user);
    transformed.profile.title = R.path(['profile', 'name', 'title'], transformed);
    transformed.profile.firstName = R.path(['profile', 'name', 'first'], transformed);
    transformed.profile.lastName = R.path(['profile', 'name', 'last'], transformed);
    delete transformed.profile.name;
    if (addListsToResponse)
        transformed = exports.addListsToUserData(transformed);
    return transformed;
};

import * as R from 'ramda';
import {demographics, titles} from '../static-data';
import {SimpleList, SimpleListItem} from "../../types";

const selectValueInList = (list: SimpleList, userValue: string): SimpleList => {
    if (!userValue)
        return list;
    return list.map((item: SimpleListItem): SimpleListItem => ({
        description: item.description,
        code: item.code,
        selected: item.code === userValue
    }));
};

export const addListsToUserData = (userData) => {
    return R.mergeDeepWith(
        (a, b) => b ? b : a,
        userData,
        {
            profile: {
                titles: selectValueInList(titles, userData.profile.title),
                demographics: {
                    positions: selectValueInList(demographics.positions, userData.profile.demographics.position.code),
                    industries: selectValueInList(demographics.industries, userData.profile.demographics.industry.code),
                    responsibilities: selectValueInList(demographics.responsibilities, userData.profile.demographics.responsibility.code)
                }
            }
        });
};

export const graphQlToUserApi = (user, addListsToResponse) => {
    let transformed = R.clone(user);
    transformed.profile.title = R.path(['profile', 'name', 'title'], transformed);
    transformed.profile.firstName = R.path(['profile', 'name', 'first'], transformed);
    transformed.profile.lastName = R.path(['profile', 'name', 'last'], transformed);
    delete transformed.profile.name;
    if (addListsToResponse)
        transformed = addListsToUserData(transformed);
    return transformed;
};
import {userName} from './user-name';
import {addListsToUserData} from "./add-lists-to-user-data";

export const readTransforms = (user, demographicsLists) => {
    let transformed = userName(user);
    if (demographicsLists)
        return addListsToUserData(transformed, demographicsLists);
    return transformed;
};
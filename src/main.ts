import {getUserBySession, getUserIdBySession} from './read/getUser';
import {updateUserProfile, changeUserPassword} from './write/updateUser';

export default {
    getUserBySession,
    getUserIdBySession,
    updateUserProfile,
    changeUserPassword
};

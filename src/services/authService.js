import * as async from 'async'
import * as config from '../config'

module.exports = {
    async init(cb) {
        
    },

    /**
     * login
     *
     * @param username
     * @param password
     * @param cb - callback(error, user),
     *             if login is success, then returns user instance, else returns error
     */

    async login(username, password, cb) {
        if ( username=='admin', password=='admin'){
            cb(null, 'okay')
            return;
        }
        cb('error', null)
    },

    async logout() {
        
    },
    /**
     * signup
     *
     * @param userData - user information to create
     *                   must include username, password
     * @param cb - callback(error, user)
     *             if success, then returns created user instance, else return error
     *             created user is altivated already, so can logged in automatically
     */
    async signup(userData, cb) {
        
    },

}

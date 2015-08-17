/**
 * Created by billtt on 11/17/14.
 */

var config = require('config');

function AuthService() {
}

module.exports = AuthService;

AuthService.PERM_HOME = 'home';
AuthService.PERM_SWITCH = 'switch';

function getPermission(req) {
    var url = req.baseUrl + req.url;
    var idx = url.indexOf('?');
    if (idx >= 0) {
        url = url.substr(0, idx);
    }
    if (url.charAt(url.length-1) == '/') {
        url = url.substr(0, url.length - 1);
    }
    if(url == '/home') {
        return AuthService.PERM_HOME;
    }
    if (url == '/switch' || url == '/reconnect') {
        return AuthService.PERM_SWITCH;
    }
    return null;
}

function hasPermission(user, permission) {
    var auth = config.get('auth');
    var perms = auth[user];
    if (perms && perms.indexOf(permission) >= 0) {
        return true;
    } else if (user != '*') {
        return hasPermission('*', permission);
    }
}

AuthService.hasPermission = hasPermission;

/**
 * Check permission (whether user has permission for the route path), and set req.user
 * @param req
 * @return {Boolean} true if validated, false otherwise
 */
AuthService.auth = function(req) {
    var perm = getPermission(req);
    if (perm == null) {
        console.warn('Cannot find permission for url %s', req.originalUrl);
        return false;
    }
    var authInfo = req.get('authorization');
    var user = 'nobody';
    if (authInfo != null) {
        authInfo = authInfo.split(' ')[1];
        authInfo = new Buffer(authInfo, 'base64').toString('ascii');
        user = authInfo.split(':')[0];
    }
    req['user'] = user;
    if (!hasPermission(user, perm)) {
        return false;
    }
    return true;
};

var express = require('express');
var router = express.Router();
var AuthService = require('../service/AuthService');
var PeerService = require('../service/PeerService');
var SysService = require('../service/SysService');
var sprintf = require('sprintf-js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/home');
});

router.use(function(req, res, next) {
    if (!AuthService.auth(req)) {
        console.warn('Admin permission denied for user %s to access %s', req.user, req.originalUrl);
        res.write('Permission denied for ' + req.user + ' -_-');
        res.end();
        return;
    }
    res.locals.user = req.user;
    res.locals.sprintf = sprintf;
    next();
});

router.get('/home', function(req, res) {
    res.locals.servers = PeerService.servers;
    res.render('home');
    res.end();
});

router.get('/switch', function(req, res) {
    var name = req.query.name;
    var server = PeerService.findByName(name);
    if (!!server) {
        SysService.updateConf(server.conf);
        PeerService.setActiveServer(server.conf.address, server.conf.port);
        SysService.reconnect(function(err) {
            res.redirect('/home');
        });
    } else {
        res.redirect('/home');
    }
});

router.get('/reconnect', function(req, res) {
    var json = {};
    SysService.reconnect(function(err) {
        json.error = err;
        res.end(JSON.stringify(json));
    });
});

module.exports = router;

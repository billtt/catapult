/**
 * Created by billtt on 8/17/15.
 */

var config = require('config');
var ping = require('net-ping');

function PeerService() {
}

module.exports = PeerService;

var servers = [];
PeerService.servers = servers;

var pingSession = null;
const PING_TIMEOUT = 2000;
const PING_COUNT = 100;
var activeServer = null;

function init() {
    var list = config.get('peers');
    for (var i=0; i<list.length; i++) {
        var conf = list[i];
        var server = {
            conf: conf,
            pings: [],
            avgPingTime: 0,
            lossRate: 0,
            active: false
        };
        servers.push(server);
    }

    // init ping session
    var options = {
        retries: 0,
        timeout: PING_TIMEOUT
    };
    pingSession = ping.createSession(options);
}

PeerService.setActiveServer = function(address, port) {
    for (var i=0; i<servers.length; i++) {
        var server = servers[i];
        if (server.conf.address === address && server.conf.port === port) {
            server.active = true;
            activeServer = server;
        } else {
            server.active = false;
        }
    }
};

PeerService.findByName = function(name) {
    for (var i=0; i<servers.length; i++) {
        var server = servers[i];
        if (server.conf.name === name) {
            return server;
        }
    }
    return null;
};

PeerService.getActiveServer = function() {
    return activeServer;
};

function updatePingStats(server, time) {
    server.pings.push(time);
    if (server.pings.length > PING_COUNT) {
        server.pings.shift();
    }
    var loss = 0;
    var total = 0;
    var count = server.pings.length;
    for (var i=0; i<count; i++) {
        var t = server.pings[i];
        if (t >= PING_TIMEOUT) {
            loss++;
        }
        total += t;
    }
    server.avgPingTime = total / count;
    server.lossRate = loss / count;
}

function pingServer(server) {
    pingSession.pingHost(server.conf.address, function(err, target, sent, rcvd) {
        var time = rcvd - sent;
        updatePingStats(server, time);
        setTimeout(pingServer.bind(null, server), 1000);
    });
}

function startPings() {
    for (var i=0; i<servers.length; i++) {
        pingServer(servers[i]);
    }
}

init();
startPings();

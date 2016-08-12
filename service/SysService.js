/**
 * Created by billtt on 8/17/15.
 */

var config = require('config');
var fs = require('fs');
var exec = require('child_process').exec;

function SysService() {
}

module.exports = SysService;
SysService.shadowConf = null;

function init() {
    var strConf = fs.readFileSync(config.get('server.configPath'));
    SysService.shadowConf = JSON.parse(strConf);
}

SysService.updateConf = function(conf) {
    SysService.shadowConf = {
        server: conf.address,
        server_port: conf.port,
        password: conf.password,
        method: conf.method,
        local_address: '0.0.0.0',
        local: '0.0.0.0',
        timeout: 5
    };
    fs.writeFileSync(config.get('server.configPath'), JSON.stringify(SysService.shadowConf));
};

SysService.reconnect = function(server, callback) {
    var conf = config.get('server');
    exec(conf.stopCmd, function(err, stdout, stderr) {
        if (err) {
            return callback(stderr);
        }
        exec(conf.startCmd + ' ' + server.conf.dns, function(err, stdout, stderr) {
            if (err) {
                callback(stderr);
            } else {
                callback(null);
            }
        });
    });
};

init();

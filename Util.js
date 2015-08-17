/**
 * Created by billtt on 8/17/15.
 */

var log4js = require('log4js');
var config = require('config');

function Util() {
}

module.exports = Util;

Util.initLog4J = function() {
    var logConfig = {
        "appenders": [
            {
                "type": "console",
                "layout": {
                    "type": "pattern",
                    "pattern": "%[%d %x{line} %p %] %m",
                    "tokens": {
                        "line": function () {
                            var line = new Error().stack.split('\n')[10];
                            // fix for various display text
                            line = ( line.indexOf(' (') >= 0 ?
                                line.split(' (')[1].substring(0, line.length - 1) : line.split('at ')[1]
                            );
                            line = line.split("/");
                            line = line[line.length - 1];
                            line = "[" + line.substr(0, line.length - 1) + "]";
                            return line;
                        }
                    }
                }
            }
        ],
        replaceConsole: true
    };
    log4js.configure(logConfig, {});
    var debug = config.get('debug');
    log4js.setGlobalLogLevel(debug ? "DEBUG" : "INFO");
};

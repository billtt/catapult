# Catapult

**DESTROY THE WALL!!!**

Catapult is a web application which provides a console to make the management of Shadowsocks peers easier on your gateway.

If you have more than one Shadowsocks peer (outside the WALL), and want to monitor the network condition (ping latency and packet loss) to each of them, and switch between the peers by just clicking on the web portal, then try Catapult.

# Get Started
## Prerequisites
### Shadowsocks
You need to have Shadowsocks installed in your system. I assume that you use /etc/shadowsocks.json as the configuration file for Shadowsocks. As an example, please see shadowsocks/etc/shadowsocks.json.

Also, you need to have two scripts ready for stopping and starting Shadowsocks connection. You can find the sample scripts in shadowsocks/scripts (in these scripts, I use ss-redir and ss-tunnel to redirect TCP packets and DNS queries).

For instructions on how to setup Shadowsocks on your system, please visit its official site:

https://github.com/shadowsocks/shadowsocks
https://github.com/shadowsocks/shadowsocks-libev

Also you can visit my blog for step-by-step instructions (Chinese):

http://bit.ly/shadowsocks

### Node.js

Catapult needs Node.js to run.

```bash
sudo apt-get install nodejs
```

## Installation

### Clone project

```bash
git clone https://github.com/billtt/catapult.git
```

### Install NPM modules
```bash
cd catapult
npm update
```

### Modify configurations
Make a copy of config/default.json onto config/production.json, and edit it as you need.

## Run
In your Catapult directory:

```bash
export NODE_ENV=production
node bin/www
```

Now use your browser to see if it works.

# Access Control
Catapult uses a simple access control model. 

## Authentication
Catapult authenticates the user using basic HTTP authentication info. So you can configure your Apache or Nginx as a front-end proxy for Catapult, and use the basic auth modules.

## Authorization
In Catapult's config file (config/default.json), you can configure which users have the permissions to visit the console page, and to switch/reconnect peers. For example:

```JSON
"auth": {
    "Kate": ["home"],
    "Jack": ["home", "switch"]
}
```
In this configuration, the user "Kate" can visit the home page, while Jack can change the peers or initiate a reconnect.

By default, all users (*) have full permissions.

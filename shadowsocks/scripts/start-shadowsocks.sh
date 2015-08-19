#!/bin/bash

nohup /usr/bin/ss-redir -c /etc/shadowsocks.json -l 12345 &>> /var/log/ss-redir.log &
nohup /usr/bin/ss-tunnel -c /etc/shadowsocks.json -l 53 -u -L 8.8.8.8:53 &>> /var/log/ss-tunnel.log &


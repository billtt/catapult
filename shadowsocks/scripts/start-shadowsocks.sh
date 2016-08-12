#!/bin/bash

remote_dns="$1"

ulimit -n 99999
nohup /usr/bin/ss-redir -c /etc/shadowsocks.json -l 12345 &>> /var/log/ss-redir.log &
nohup /usr/bin/ss-tunnel -c /etc/shadowsocks.json -l 15353 -u -L ${remote_dns} &>> /var/log/ss-tunnel.log &


#!/bin/bash
echo "--------------------------> 自定义脚本 start.sh <--------------------------"

if [! -d "/home/export/Logs/nginx" ]; then
  mkdir /home/export/Logs/nginx
fi
if [! -d "/dev/shm/nginx_temp/client_body" ]; then
  mkdir -p /dev/shm/nginx_temp/client_body
fi
/home/export/servers/nginx/sbin/nginx -c /home/export/servers/nginx/conf/nginx.conf
exit 0

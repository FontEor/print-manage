upstream manage-server.jd.com {
  server 11.158.10.129:8081;
  server 11.158.131.155:8081;
}

upstream manage-plugin.jd.com {
  server 11.158.12.131:10001;
}

upstream proxy.jd.com {
  server 11.91.148.64:3000;
}

server {
  listen                   80;
  server_name              manage.jd.com ydy-test.jd.com;
  access_log              /export/Logs/manage.access.log;
  error_log                /export/Logs/manage.error.log warn;
  # chunkin on;
  etag    on;
  error_page 411 = @my_411_error;
  location ^~/api/proxy/ {
    proxy_pass http://proxy.jd.com/;
    proxy_set_header Host $host:80;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  location ^~/api/ {
    proxy_pass http://manage-server.jd.com/;
    proxy_set_header Host $host:80;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  location ^~/bpi/ {
    proxy_pass http://manage-plugin.jd.com/;
    proxy_set_header Host $host:80;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  location / {
    root      /export/App/manage;
    try_files $uri $uri/ /index.html last;
    index  index.html index.html;
  }
  location /editor {
    alias       /export/App/editor;
    try_files $uri $uri/ /index.html last;
    index  index.html index.html;
  }
  location /editor.html {
    rewrite ^/(.*) /editor permanent;
  }
}

upstream dev-server.jd.com {
  # server 11.80.23.99:8081;
  # server 11.80.34.175:8081;
  # server 11.80.25.58:8081;
  # server 11.80.33.55:8081;
  # server 11.50.161.223:8081;
  server 11.158.4.134:8081;
}

upstream dev-proxy.jd.com {
  server 11.91.148.64:3000;
}

server {
  listen                   80;
  server_name              devm.jd.com;
  access_log              /export/servers/nginx/logs/manage.access.log main;
  error_log                /export/servers/nginx/logs/manage.error.log warn;
  # chunkin on;
  etag    on;
  error_page 411 = @my_411_error;
  location ^~/api/proxy/ {
    proxy_pass http://dev-proxy.jd.com/;
    proxy_set_header Host $host:80;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  location ^~/api/ {
    proxy_pass http://dev-server.jd.com/;
    proxy_set_header Host $host:80;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  location / {
    root      /export/App/develop;
    try_files $uri $uri/ /index.html last;
    index  index.html index.html;
  }
}

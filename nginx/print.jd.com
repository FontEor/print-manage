upstream print-node.jd.com {
        server 11.91.148.64:3000;
}

server {

        listen                   80;

        server_name              print.jd.com;

        access_log              /export/servers/nginx/logs/access.log main;

        error_log                /export/servers/nginx/logs/error.log warn;

        #chunkin on;
	etag on;

        error_page 411 = @my_411_error;

        location ^~/api/ {
             proxy_pass http://print-node.jd.com/;
             proxy_set_header Host $host:80;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
	location ^~/manage/ {
             proxy_pass http://print-node.jd.com/;
             proxy_set_header Host $host:80;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location / {

              root      /export/servers/nginx/html;

              try_files $uri $uri/ /index.html last;

              index  index.html index.html;

         }
}

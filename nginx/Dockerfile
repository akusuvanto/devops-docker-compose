FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html

EXPOSE 8198

CMD ["nginx", "-g", "daemon off;"]
FROM node:12

COPY . /home/www

WORKDIR /home/www

ENTRYPOINT [ "node start" ]
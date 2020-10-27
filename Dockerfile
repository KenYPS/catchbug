FROM node:12

COPY . /home/www

WORKDIR /home/www

RUN yarn
RUN yarn build

EXPOSE 5000
CMD [ "node", "./back/index.js" ]
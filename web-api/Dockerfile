FROM node:latest

WORKDIR /src

COPY . .

RUN ls 
RUN cd unique-migrations-seeds
RUN yarn install

EXPOSE 5000

CMD ["yarn", "start"]
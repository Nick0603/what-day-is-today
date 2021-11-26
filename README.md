# What day is today
![](https://i.imgur.com/iPJyp6J.png)
## Description
The project is a simple funny application for telling you the number of days from anniversary to present by notification service.
- [x] Line Notify
- [ ] Make other schedule notifications.
## Setup

1. Make sure you have these tools in your env. [yarn](https://yarnpkg.com/), [ngrok](https://ngrok.com/)

2. Make sure you have a mysql server and connectable.
   - You can install it by [docker](https://hub.docker.com/_/mysql) easily.

3. Create a line-notify service for yourself. [link](https://notify-bot.line.me/my/services/)
   - You can set a random value for `服務網址` and `Callback URL` first, we will update correct value later.
   - After creating, you can get `Client ID` and `Client Secret	` from service page.
![](https://i.imgur.com/j0yPxD2.png)

1. Set environment variables
```bash
$ cp .env.example .env
```
Except for `SERVER_ORIGIN`, You have the corresponding values to fill in.

5. Start server
```bash
yarn install
yarn start:dev
```

6. You can test your server in default port(3000).

7. Create a user 
```bash
curl --location --request POST 'localhost:3000/auth/local/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "test",
    "password": "password",
    "subscribedPath": "test",
    "anniversaryDate": "2021-11-26"
}'
```

8. Create a proxy and public https server by `ngrok`.
```
ngrok http 3000
```

9. Update the ngrok url to line-notify service.
- Fill the ngrok proxy origin into `服務網址`
- Fill the ngrok proxy origin and path into `Callback URL`

For example, if I get a `https://c853-220-141-10-61.ngrok.io` ngrok proxy server, I will fill the following info in line-notify service.
![](https://i.imgur.com/WDxcn6G.png)

1. Update the ngrok origin to `SERVER_ORIGIN` in .env. Like `https://c853-220-141-10-61.ngrok.io`

2. Restart app server to update latest environment variables. (No means ngrok server)

## How to test the app

1. Key the subscribed link by the pattern, the link is unique for each user.
```
https://{{your-domain-name}}/subscribe/line_notify/{{user-subscribedPath}}/redirect
```
Like as `https://c853-220-141-10-61.ngrok.io/subscribe/line_notify/test/redirect`

2. When input the link into your browser, you will redirect to line-notify subscriber page.

3. Authenticate it and the line-notify service will redirect back to our service with token. And our service will save it into database.

![](https://i.imgur.com/caCxtyy.png)
![](https://i.imgur.com/Yv1Y7kL.png)

4. Use script to test the token by worker.
  - The api will auth by workerToken that's the value we just set in .env. (default is `secret`)
  - *The script will send message to all subscriber existing token in database.
```bash
curl --location --request POST 'localhost:3000/worker/trigger/line_notify' \
--header 'Content-Type: application/json' \
--data-raw '{
    "workerToken": "secret"
}'
```
![](https://i.imgur.com/PbiwxlN.png)

[optional] You can ger the token from database and send custom message to your subscriber.
```bash
curl --location --request POST 'localhost:3000/worker/test/line_notify/test' \
--header 'Content-Type: application/json' \
--data-raw '{
    "message": "custom message",
    "workerToken": "secret"
}'
```

## Deploy to heroku and setup a daily job to send notification.
- WIP
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## License

`What day is today` is [MIT licensed](LICENSE).

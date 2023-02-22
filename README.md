# Node/Express Vender RESTful API

This is the implementation for REST api for a react-store-front appllication
using Node.js with Nodejs/Typescript/Express/MongoDB, ESLint and Prettier

## Prerequisites

- Node.js 14+
- Yarn or NPM

## Installation

- Clone

```bash
git clone git@github.com:marvambi/mvp-vendr-api.git <optional project name>
```

- Install dependencies

```bash
cd <project name> && npm install
mv .env.sample .env
```
### Update the .env file with your unique details for the MONGODB_URI_DEV, etc
- Start Application

```bash
npm run start
```

- Run Test
```
cd <project root> && npm run test
[optionally] 👉 npm run test -- --coverage --collectCoverageFrom="./src/**" 
```



The application is configured to be launched by [Nodemon](https://nodemon.com)
so it's will restart automatically on file change

# Official involveMINT Web App Repository

## Setting Up Environment

Prerequisites:

- Nodejs
- Postgres database named `involvemint` running on localhost port 5432 with username `postgres` and password `1Qazxsw2`
- Visual Studio Code

### Steps

1. Clone repository

```sh
git clone git@ssh.dev.azure.com:v3/involvemint/involveMINT/involvemint2.0
```

2. Change directory into repository

```sh
cd involvemint2.0
```

3. Install dependencies

```sh
npm install
```

4. Start client

```sh
npx ng s
```

5. In another terminal, start server

```sh
npx ng s api
```

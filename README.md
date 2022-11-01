# Official involveMINT Web App Repository

## Setting Up Environment

Prerequisites:

- Nodejs
- Postgres database named `involvemint` running on localhost port 5432 with username `postgres` and password `yourpassword`
- Visual Studio Code

### Steps

1. Clone repository

```sh
git clone https://github.com/involveMINT/iM
```

2. Change directory into repository

```sh
cd iM
```

3. Install dependencies

```sh
npm install
```

4. Update environments.ts with your settings

5. Start client

```sh
npx ng s
```

6. In another terminal, start server

```sh
npx ng s api
```

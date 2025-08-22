# Fabric Technical Node.JS Test - Boris Anderson

## Summary

The application is a combination of the following frameworks:

- Frontend: VueJS + Vuetify
- Backend: NodeJS + Express
- Database: SQLite

Vue JS/Vuetify were chosen simply due to my prior experience therewith and the excellent features that the latter framework includes. SQLite was chosen as the lightweight and most sensible choice for the database.

### Launching the application

Although divided into frontend and backend, both components can be cloned, initialised (i.e. run `npm install`) and be started with the following commands inside the root directory:

```
git clone https://github.com/boris-r-anderson/fabric-test.git
cd fabric-test
npm run start
```

Launching the whole stack in one command is achieved through the use of [concurrently](https://github.com/open-cli-tools/concurrently).

### Structure

Due to the simple nature of the application, the structure is not so complicated and is as follows.

- /backend
  - /dist (JS transpilation of TS)
  - /node_modules
  - /src
    - api.ts - API endpoints
    - app.ts - starts the server and the application backend
    - db.ts - db initialisation and crud functions
    - variables.ts - repository for constants
    - database.db - physical DB location (gitignored)
  - /tests
    - api.test.ts - some basic API tests
    - db.test.ts - some basic DB tests
- /frontend
  - /src
    - /components
      - HomePage.vue - the entirety of the fronted is rendered there
  - ... the rest of the frontend is the default structure of freshly installed Vue with Vuetify, for which you can find more information [here](https://vuetifyjs.com/en/getting-started/installation/).

### Testing

Tests can be run on the backend with the following commands.

```
> cd backend
> npm test
```

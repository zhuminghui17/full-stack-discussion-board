# Discussion Board 

## Primary roles
Congcong Ma
Minghui Zhu
Quan Wang

## How to run the program
1. Open Docker
2. Run MongoDB via Docker from terminal `docker run -p 127.0.0.1:27017:27017 -d --rm --name mongo mongo:6.0.2`
3. Open MongoDB Compass
4. Start the server `cd server` -> `npm install` -> `npm run setup` -> `npm start` (keep this terminal open, and open another terminal)
5. Start the ui `cd ui` -> `npm install` -> `npm start` (keep this terminal open, and open another terminal)

## How to set up the Keycloak
1. On macOS/WSL2/Linux: `git clone https://github.com/keycloak/keycloak-containers`
2. `cd keycloak-containers/server`
3. `docker build -t keycloak18 .`

## Notes and assumptions

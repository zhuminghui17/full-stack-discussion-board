# vite build
FROM library/node:16-alpine as node
WORKDIR /home/node/app
COPY *.js* ./
COPY .npmrc ./
COPY index.html ./
COPY src ./src
RUN npm i
RUN ls -al && npm run build

# nginx
FROM library/nginx:1
COPY --from=node /home/node/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
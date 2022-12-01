FROM mcr.microsoft.com/playwright:v1.28.0-focal
COPY * ./tests/
COPY playwright.config.ts ./
COPY package*.json ./
RUN npm i
ENV APP_URL http://server1:8099
ENV CI true
ENTRYPOINT tail -f /dev/null
#ENTRYPOINT xvfb-run npx playwright test
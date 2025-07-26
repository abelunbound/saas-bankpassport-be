FROM node:18 as build

# RUN apt-get update && apt-get install -y \
#     chromium \
#     libx11-xcb1 \
#     libxcb1 \
#     libxcb-render0 \
#     libxcb-shm0 \
#     libxcomposite1 \
#     libxrandr2 \
#     libxi6 \
#     libxtst6 \
#     libnss3 \
#     libatk1.0-0 \
#     libcups2 \
#     libdrm2 \
#     libdbus-1-3 \
#     libglib2.0-0 \
#     libxdamage1 \
#     libpango1.0-0 \
#     libasound2 \
#     libpangocairo-1.0-0 \
#     libcairo2 \
#     fonts-liberation \
#     libgbm1 \
#     libgtk-3-0 \
#     --no-install-recommends \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

RUN npm run build

# RUN npm cache clean --force

# RUN npm install puppeteer --legacy-peer-deps

# # Install Chromium
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i google-chrome-stable_current_amd64.deb || apt-get install -f -y


FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=build /app/dist  ./dist
ENV MONO_BASE_URL=https://api.withmono.com/v2 \
    MONO_SK=test_sk_w9tkybojph3tkoiuxemw \
    JWT_SECRET_AT=1w7vbykvtoreoxsmsiavk8u2pvnf14dfzw1ypvb8 \
    JWT_SECRET_RT=cmcj696r2rljnoy0sff3ns8ezskf7io2x2ij39zc \
    MYSQL_DB_PASSWORD=smsiavk8u2pvnf14dfzw1ypvb8 \
    MYSQL_DB_USERNAME=boldid11_risk_profile \
    MYSQL_DB_DATABASE=boldid11_risk_profile \
    MYSQL_DB_HOST=www.boldideas.org \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    TINK_CLIENT_SECRET=2f544f5167174179966644f4f8664e65 \
    TINK_CLIENT_ID=648c951502134a43ab147e3124c9b6dd \
    WEB_CLIENT_URL_DEV=https://bankpassport.vercel.app \
    WEB_CLIENT_URL_PROD=https://bankpassport.vercel.app \
    TINK_API=https://api.tink.com \
    GMAIL_APP_PASSWORD="atrl fgnb wiid fpjf" \
    GMAIL_SENDER=info.bankpassport@gmail.com \
    GMAIL_HOST=smtp.gmail.com \
    GMAIL_PORT=465 \
    SERVER_URL=https://app-319954249314.us-central1.run.app \
    CLOUDINARY_API_KEY=757131557688191 \
    CLOUDINARY_SECRET=Ao8ax3ZQfbWxeW_HOOS5t-VXNyM \
    CLOUDINARY_NAME=dquiwka6j \
    POSTGRES_HOST=35.184.50.131 \
    POSTGRES_USERNAME=postgres \
    POSTGRES_PASSWORD=Bankpassport100% \
    POSTGRES_DATABASE=postgres \
    NODE_ENV=production

CMD npm run start:prod
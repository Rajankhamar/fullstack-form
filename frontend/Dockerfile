FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm install --no-audit --no-fund --fetch-retries=1 --fetch-timeout=120000
COPY index.html ./
COPY src ./src
RUN npm run build

FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY public/static-site/ /usr/share/nginx/html/static-site/
EXPOSE 80

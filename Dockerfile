FROM node:20-alpine AS build
WORKDIR /app

# Instala deps con mejor cache
COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
ENV NODE_ENV=production
# Deja el output en /app/dist
RUN npm run build

FROM nginx:1.27-alpine AS runtime

# Config de nginx (SPA + gzip + cache estática)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/app.conf

# Copia el build estático
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

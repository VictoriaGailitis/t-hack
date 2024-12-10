FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./

# Установка ajv и ajv-keywords для устранения проблем с зависимостями
RUN npm install ajv@^6.0.0 ajv-keywords@^3.5.2 --legacy-peer-deps

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

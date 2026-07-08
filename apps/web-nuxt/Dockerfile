FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web-nuxt/package.json apps/web-nuxt/package.json

RUN npm ci

COPY apps/web-nuxt apps/web-nuxt

RUN npm run build -w @menu-system/web-nuxt

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=build /app/apps/web-nuxt/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]


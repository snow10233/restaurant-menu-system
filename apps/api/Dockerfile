FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

RUN npm ci

COPY apps/api apps/api

RUN npm run build -w @menu-system/api
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/api/package.json ./package.json
COPY --from=build /app/apps/api/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]


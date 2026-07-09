FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

RUN npm ci

COPY apps/api apps/api
COPY data data

RUN npm run build -w @menu-system/api

FROM build AS migrations

WORKDIR /app

CMD ["npm", "run", "db:migrate", "-w", "@menu-system/api"]

FROM build AS pruned

RUN npm prune --omit=dev

FROM node:22-alpine AS runtime

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=pruned /app/node_modules /app/node_modules
COPY --from=pruned /app/apps/api/package.json ./package.json
COPY --from=pruned /app/apps/api/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]

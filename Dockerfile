# Development
FROM node:22.12.0-bookworm-slim AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]

# Build
FROM node:22.12.0-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:22.12.0-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
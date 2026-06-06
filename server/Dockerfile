# syntax=docker/dockerfile:1

# ── Stage 1: install deps (cached) ───────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: build TypeScript → dist ─────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: production runtime (slim) ───────────────────────
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Compiled output
COPY --from=build /app/dist ./dist

# Run as the built-in non-root node user
USER node

EXPOSE 4000
CMD ["node", "dist/server.js"]

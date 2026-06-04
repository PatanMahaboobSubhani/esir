FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=1001:65533 /app/public ./public
COPY --from=builder --chown=1001:65533 /app/.next/standalone ./
COPY --from=builder --chown=1001:65533 /app/.next/static ./.next/static

RUN mkdir -p /app/public/uploads \
    && chmod -R 777 /app/public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

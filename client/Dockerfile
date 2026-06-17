FROM node:20-alpine

WORKDIR /app
COPY . .

# VITE_API_URL is inlined at build time. Railway passes the service variable as a
# build arg; leave empty for local dev (relative /api via the Vite proxy).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm install
RUN npm run build

EXPOSE 4173
# Listen on Railway's injected $PORT (falls back to 4173 locally). Shell form so $PORT expands.
# ponytail: vite preview serves the built SPA fine at this scale; swap for a static host/CDN if traffic grows.
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-4173}"]
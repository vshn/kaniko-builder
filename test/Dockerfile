# syntax=docker/dockerfile:1.21

FROM node:24-alpine AS prod-deps

WORKDIR /app

COPY src/package.json src/package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY src/app.ts ./app.ts

FROM node:24-alpine AS firstStage

ARG CI_COMMIT_SHA

WORKDIR /app

ENV HTTP_PORT=8080

ADD marker.txt ./marker.txt
RUN sh -c 'echo "$CI_COMMIT_SHA" >> "marker.txt"'

FROM firstStage AS final

LABEL stage="final"

# Copy runtime dependencies and compiled app
COPY --from=prod-deps /app ./

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user and drop privileges
RUN adduser -S -D -H appuser
USER appuser

EXPOSE ${HTTP_PORT}

VOLUME /var/volume

HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
  CMD curl --fail http://localhost:${HTTP_PORT}/health || exit 1

ENTRYPOINT ["npm", "run", "start", "--"]
CMD ["--port", "8080"]

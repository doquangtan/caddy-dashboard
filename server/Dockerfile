FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb /app/

RUN bun install

EXPOSE 3001/tcp

CMD ["bun", "run", "index.ts"]
FROM oven/bun:1

WORKDIR /server

COPY package.json bun.lockb /server/

RUN bun install

EXPOSE 3001/tcp

CMD ["bun", "run", "index.ts"]
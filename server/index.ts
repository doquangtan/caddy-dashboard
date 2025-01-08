import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.use("/*", serveStatic({ root: "../frontend/build" }));

app.get("/api", async (c) => {
	const response = await fetch("http://192.168.31.174:2019/config", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const data = await response.json();

	return c.json(data);
});

export default {
	port: 3001,
	fetch: app.fetch,
};

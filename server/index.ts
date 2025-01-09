import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

const unix = "/var/run/docker.sock";
const fetchOptions: any = { unix };
const app = new Hono();

app.use("/*", cors());

app.use("/*", serveStatic({ root: "../frontend/build" }));

app.get("/api", async (c) => {
	const response = await fetch("http://caddy:2019/config", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const data = await response.json();

	return c.json(data);
});

app.get("/docker/api", async (c) => {
	const response = await fetch("http://localhost/info", fetchOptions);

	const body = await response.json();

	return c.json(body)
})

app.get("/docker/api/network", async (c) => {
	const response = await fetch("http://localhost/networks", fetchOptions);

	const body = await response.json();

	return c.json(body)
})

async function init() {
	console.log("Init caddy proxy manager...");

	const response = await fetch("http://localhost/networks/caddy-bridge-network", fetchOptions);

	const body = await response.json();

	if (body?.Containers != null) {
		console.log('Find frontend container');

		let frontendContainer = null;
		Object.keys(body?.Containers).map(v => {
			const container = body?.Containers[v];
			if (container.Name === "frontend") {
				frontendContainer = container;
			}
		});

		console.log(frontendContainer);

	}

	console.log(body);

}
init()

export default {
	port: 3001,
	fetch: app.fetch,
};

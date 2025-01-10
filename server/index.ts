import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

const unix = "/var/run/docker.sock";
const fetchOptions: any = { unix };
const app = new Hono();

const SERVICE = [
	'reverse_proxy',
	'file_server',
]

const MIDDLEWARE = [
	'static_response',
	'headers',
	'rewrite',
]

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

app.get("/api/httproutes", async (c) => {
	const response = await fetch("http://caddy:2019/config", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const data = await response.json();

	const http_routers: any = [];

	function row(server: any) {
		if (server.handle) {
			Object.keys(server.handle).map((v: any, handleIndex: number) => {
				const handle = server.handle[v];
				if (handle.handler === 'subroute') {
					for (const router of handle.routes) {
						if (server.match == null) {
							server.match = [];
						}
						if (router.match != null) {
							router.match = [...server.match, ...router.match]
						} else {
							router.match = [...server.match]
						}
						row({
							...router,
							name: server.name,
							port: server.port,
						});
					}
				} else {
					http_routers.push({
						...server,
						handle: handle,
					})
				}
			})
		}
	}

	const servers = (data?.apps?.http?.servers ?? [])
	for (const serverName in servers) {
		const server = servers[serverName];
		if (Array.isArray(server.routes)) {
			for (const router of server.routes) {
				router.name = serverName;
				router.port = server.listen;
				row(router);
			}
		}
	}

	const root_http_routers = [];
	const middleware = [];
	for (const router of http_routers) {
		if (SERVICE.includes(router.handle.handler)) {
			router.middleware = [];
			for (const m of middleware) {
				let isMatch = true;
				for (const match of m.match) {
					if (router.match == null) {
						isMatch = false;
						break;
					}

					if (!router.match.some((v: any) => JSON.stringify(v) === JSON.stringify(match))) {
						isMatch = false;
						break;
					}
				}
				if (isMatch) {
					router.middleware.push(m);
				}
			}
			root_http_routers.push(router);
		} else {
			middleware.push(router)
		}
	}

	return c.json({
		data: root_http_routers,
	});
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

app.get("/docker/api/network/:id", async (c) => {
	const { id } = c.req.param();

	const response = await fetch(`http://localhost/networks/${id}`, fetchOptions);

	const body = await response.json();

	return c.json(body)
})

async function AddNewServer(options: {
	name: string,
	port: string,
	loadbalance: string[],
}) {
	const { name, port, loadbalance } = options;
	const newServer = {
		listen: [port],
		routes: [{
			handle: [{
				handler: 'reverse_proxy',
				upstreams: loadbalance.map(v => ({ dial: v }))
			}]
		}],
	}

	const response = await fetch(`http://caddy:2019/config/apps/http/servers/${name}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newServer),
	});

	const data = await response.json();

	console.log(`Caddy ${data == null ? 'api' : 'error'}: new server`, data);

	if (data != null && data.error != null) {
		throw new Error(data.error)
	}

	return data;
}

async function init() {
	console.log("Init caddy proxy manager...");

	const response = await fetch("http://localhost/networks/caddy-bridge-network", fetchOptions);

	const body = await response.json();

	if (body?.Containers != null) {
		console.log('Find frontend container');

		let frontendContainer: any = null;
		Object.keys(body?.Containers).map(v => {
			const container = body?.Containers[v];
			if (container.Name === "frontend") {
				frontendContainer = container;
			}
		});

		const ip = frontendContainer['IPv4Address']?.split('/')[0];
		if (ip != null) {
			await AddNewServer({
				name: "frontend",
				port: ":81",
				loadbalance: [
					`${ip}:3001`
				]
			}).catch(_ => null);
		}
	}

	// console.log(body);

}

init()

export default {
	port: 3001,
	fetch: app.fetch,
};

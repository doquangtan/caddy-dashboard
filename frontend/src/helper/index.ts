import axios from "axios";

const URL_API = "http://localhost:81";

async function GetConfig() {
    const result = await axios({
        method: 'get',
        url: `${URL_API}/api`,
    });
    return result.data;
}

async function GetHttpRoutes() {
    const result = await axios({
        method: 'get',
        url: `${URL_API}/api/httproutes`,
    });
    return result.data.data;
}

// async function AddNewServer(options: {
//     name: string,
//     port: string,
//     loadbalance: string[],
// }) {
//     const { name, port, loadbalance } = options;
//     const newServer = {
//         listen: [port],
//         routes: [{
//             handle: [{
//                 handler: 'reverse_proxy',
//                 upstreams: loadbalance.map(v => ({dial: v}))
//             }]
//         }],
//     }
//     const result = await axios({
//         method: 'get',
//         url: `${URL_API}/api/httproutes`,
//     });
// }

export {
    GetConfig,
    GetHttpRoutes,
}
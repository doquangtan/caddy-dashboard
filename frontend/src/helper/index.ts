import axios from "axios";

async function GetConfig() {
    const result = await axios({
        method: 'get',
        url: '/api',
    });
    return result.data;
}

export {
    GetConfig,
}
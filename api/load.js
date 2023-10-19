import {kv} from "@vercel/kv";
export const config = {
    runtime: 'edge',
};

export default async function load(request) {
    const urlParams = new URL(request.url).searchParams;
    const name = urlParams.get('name')

    const resp = await kv.get(name);

    return Response.json({
        success: true,
        kvResp: resp,
    });
}
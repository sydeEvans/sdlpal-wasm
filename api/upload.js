import {kv} from "@vercel/kv";
export const config = {
    runtime: 'edge',
};

export default async function upload(request) {
    const data = await request.json();
    const { name, content } = data;

    const resp = await kv.set(name, content);

    return Response.json({
        success: true,
        kvResp: resp,
    });
}
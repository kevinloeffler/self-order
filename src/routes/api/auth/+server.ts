import type {RequestHandler} from '@sveltejs/kit'
import {config} from 'dotenv'

config()

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json()

    console.log('pw:', process.env.PASSWORD)

    if (process.env.PASSWORD === data.password) {
        console.log('login successfull')
        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
    } else {
        console.log('login failed')
        return new Response(JSON.stringify({ ok: false }), { headers: { 'Content-Type': 'application/json' } })
    }
}

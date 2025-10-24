import type { RequestHandler } from '@sveltejs/kit'
import {carts} from '$lib/services/cart-service'


export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(carts.getState(params.table!)), {
        headers: { 'Content-Type': 'application/json' }
    })
}

export const POST: RequestHandler = async ({ params, request }) => {
    const item = await request.json()
    if (!item?.id) return new Response(JSON.stringify({ ok: false, error: 'id required' }), { status: 400 })
    carts.addItem(params.table!, item)
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
}

export const DELETE: RequestHandler = async ({ params, request }) => {
    const body = await request.json().catch(() => null)
    if (!body) {
        carts.clear(params.table!)
    } else if (body.id && body.all) {
        carts.removeAllById(params.table!, body.id)
    } else if (body.id) {
        carts.removeOneById(params.table!, body.id) // exactly one occurrence
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
}

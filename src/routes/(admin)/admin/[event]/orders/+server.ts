import type {RequestHandler} from '@sveltejs/kit'
import {carts} from '$lib/services/cart-service'
import {Order, OrderStatus} from '$lib/db/models'


export const POST: RequestHandler = async ({ params, request }) => {
    const body = await request.json()
    const order = await Order.findByPk(body.id)

    const status = order?.status
    let newStatus = undefined

    if (status === OrderStatus.Confirmed) {
        newStatus = OrderStatus.Completed
        order?.update({ status: OrderStatus.Completed })
    } else {
        newStatus = OrderStatus.Confirmed
        order?.update({ status: OrderStatus.Confirmed })
    }

    return new Response(JSON.stringify({ ok: true, newStatus: newStatus }), { headers: { 'Content-Type': 'application/json' } })
}

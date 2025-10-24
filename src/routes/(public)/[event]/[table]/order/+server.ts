import type {RequestHandler} from '@sveltejs/kit'
import {Article, Event, Order, OrderArticle, OrderStatus, Table} from '$lib/db/models'
import {cast, col, fn, where} from 'sequelize'


export const POST: RequestHandler = async ({ params, request }) => {

    // Get order information

    const event = await Event.findOne({
        where: where(fn('LOWER', col('name')), '=', params.event!.toLowerCase()),
        include: ['tables', 'articles']
    })

    const table = event?.tables?.find(t => t.name === params.table)!

    const body = await request.json()
    const items = body.items
    console.log('body:', body)

    // Build order

    const lastOrder = await Order.findOne({
        order: [[cast(col('number'), 'INTEGER'), 'DESC']],
    })
    const lastNumber = lastOrder ? parseInt(lastOrder.number, 10) : 0
    const nextNumber = (lastNumber + 1) % 1000
    const nextNumberStr = nextNumber.toString().padStart(3, '0')

    const order = await Order.create({
        number: nextNumberStr,
        status: OrderStatus.Confirmed,
        orderTime: new Date(),
        tableId: table.id,
    })

    const rows = body.map(item => ({
        orderId: order.id,
        articleId: item.article.id,
        quantity: Number(item.qty ?? 1),
        unitPrice: Number(item.article.price)
    }))

    if (rows.length) { await OrderArticle.bulkCreate(rows) }

    const fresh = await Order.findByPk(order.id, {
        include: [
            { model: Table, as: 'table' },
            { model: Article, as: 'articles' }
        ]
    })

    return new Response(JSON.stringify({status: true, oderId: 240}))
}

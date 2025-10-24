import type {PageServerLoad} from './$types'
import {Article, Event, Order, Table} from '$lib/db/models'

export const load: PageServerLoad = async ({ params }) => {
    const event = await Event.findByPk(params.event, {include: ['articles', 'tables']})
    const orders = await getOrdersWithArticlesForEvent(event?.id ?? 0)
    const ordersJson = orders.map(o => o.get({ plain: true }))
    return {
        event: event?.toJSON(),
        orders: ordersJson,
    }
}


// Order helper

const getOrdersWithArticlesForEvent = async (eventId: number) => {
    return Order.findAll({
        include: [
            {
                model: Table,
                as: 'table',
                attributes: ['id', 'name', 'eventId'],
                where: { eventId }
            },
            {
                model: Article,
                as: 'articles',
                through: { attributes: ['quantity', 'unitPrice'] }
            }
        ],
        order: [['orderTime', 'ASC']]
    })
}
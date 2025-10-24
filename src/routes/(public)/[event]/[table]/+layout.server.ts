import type {PageServerLoad} from './$types'
import {Event} from '$lib/db/models'
import {col, fn, where} from 'sequelize'

export const load: PageServerLoad = async ({ params }) => {

    const event = await Event.findOne({
        where: where(fn('LOWER', col('name')), '=', params.event.toLowerCase()),
        include: ['tables', 'articles']
    })
    if (!event) return  // TODO: handle invalid table

    const table = event.tables?.find(t => t.name === params.table)
    if (!table) return  // TODO: handle invalid table

    const rawArticles = event.articles?.map(a => a.toJSON())

    console.log('event:', event.name, 'table:', table.name)

    return {
        validTable: !!table,
        event: event.toJSON() ,
        table: table.toJSON(),
        articles: rawArticles,
    }
}

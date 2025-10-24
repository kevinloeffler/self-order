import type {Action, Actions} from './$types'
import {Table} from '$lib/db/models'


export const actions: Action = {

    create: async ({ params, request }) => {
        const eventId = params['event']
        const body = await request.json()
        // TODO: enforce unique table name
        const newTable = await Table.create({
            name: body.newTableName,
            eventId: eventId,
        })
    },

    deleteTable: async ({ request }) => {
        const body = await request.json()
        await Table.destroy({where: {id: body.tableId}})
    },

} satisfies Actions

import {Event} from '$lib/db/models'
import type {Action, Actions} from './$types'


export const actions: Action = {
    update: async ({ request }) => {
        const body = await request.json()
        await Event.update( body , {where: {id: body.id}} )
    },

    archive: async ({ request }) => {
        const body = await request.json()
        const eventId = body.id
        if (!eventId) return
        await Event.update( {active: false}, {where: {id: eventId}} )
    }
} satisfies Actions

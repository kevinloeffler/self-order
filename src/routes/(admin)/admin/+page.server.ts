import type {Action, PageServerLoad} from './$types'
import {Event} from '$lib/db/models'


export const load: PageServerLoad = async ({ params }) => {
    const events = await Event.findAll() ?? []
    const eventsSerialized = events.map(e => e.toJSON())
    return { events: eventsSerialized }
}


export const actions: Action = {
    newEvent: async () => {
        const event = await Event.create({
            name: 'Neuer Event',
            color: '#43B9FD',
            active: true,
        })
        console.log('event:', event)
        return event.toJSON()
    }
}

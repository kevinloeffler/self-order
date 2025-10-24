import type {Actions} from './$types'
import {Article, Event} from '$lib/db/models'


export const actions: Actions = {

    create: async ({params, request}) => {
        const eventId = params['event']
        const event = await Event.findByPk(eventId)
        if (!event) return

        const article = await Article.create({
            name: 'Neuer Artikel',
            price: 0,
            active: true,
        })

        event.addArticle(article)
        const newArticleId = article.id
        return newArticleId
    },

    deleteArticle: async ({request}) => {
        const body = await request.json()
        // await Table.destroy({where: {id: body.tableId}})
    },

}

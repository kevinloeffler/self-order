import type {PageServerLoad} from './$types'
import {Article} from '$lib/db/models'
import type {Actions} from './$types'


export const load: PageServerLoad = async ({ params }) => {
    const article = await Article.findByPk(params.id)
    return {article: article?.toJSON()}
}


export const actions: Actions = {

    update: async ({params, request}) => {
        const body = await request.json()
        await Article.update(body, {where: {id: body.id}})
    },

    deleteArticle: async ({request}) => {
        const body = await request.json()
        await Article.destroy({where: {id: body.articleId}})
    },

}

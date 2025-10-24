import { Sequelize } from 'sequelize'
import { initModels } from './models'


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite',
    logging: false
})

let initialized = false
async function init() {
    if (initialized) return
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        await initModels(sequelize)
        initialized = true
        console.log('✔︎ DB ready')
    } catch (error) {
        console.error('Failed to initialize database:', error)
        throw error
    }
}

init().catch((err) => {console.error('❌ DB init failed', err)})

export { sequelize }

import { Sequelize, DataTypes, Model } from 'sequelize'
import type {InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey} from 'sequelize'


export enum OrderStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Paid = 'Paid',
    Cancelled = 'Cancelled',
    Completed = 'Completed'
}

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    declare id: CreationOptional<number>
    declare name: string
    declare color: string | null
    declare active: boolean

    declare articles?: NonAttribute<Article[]>
    declare tables?: NonAttribute<Table[]>
}

export class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
    declare id: CreationOptional<number>
    declare name: string
    declare description: string | null
    declare price: number
    declare active: boolean

    declare events?: NonAttribute<Event[]>
    declare orders?: NonAttribute<Order[]>
}

export class Table extends Model<InferAttributes<Table>, InferCreationAttributes<Table>> {
    declare id: CreationOptional<number>
    declare name: string

    declare eventId: ForeignKey<Event['id']>
    declare event?: NonAttribute<Event>
    declare orders?: NonAttribute<Order[]>
}

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare id: CreationOptional<number>
    declare number: string
    declare status: OrderStatus
    declare orderTime: Date

    declare tableId: ForeignKey<Table['id']>
    declare table?: NonAttribute<Table>
    declare articles?: NonAttribute<Article[]>
}

export class OrderArticle extends Model<InferAttributes<OrderArticle>, InferCreationAttributes<OrderArticle>> {
    declare orderId: number
    declare articleId: number
    declare quantity: number
    declare unitPrice: number
}

// junction tables are implicit in Sequelize, but you can export their names for reference
export const TABLE_EVENT_ARTICLES = 'EventArticles'
export const TABLE_ORDER_ARTICLES = 'OrderArticles'

export const initModels = async (sequelize: Sequelize) => {
    Event.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            color: { type: DataTypes.STRING, allowNull: true },
            active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
        },
        { sequelize, modelName: 'event', tableName: 'events', timestamps: true }
    )

    Article.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT, allowNull: true },
            price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
            active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
        },
        { sequelize, modelName: 'article', tableName: 'articles', timestamps: true }
    )

    Table.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'table', tableName: 'tables', timestamps: true }
    )

    Order.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            number: { type: DataTypes.STRING, allowNull: false, unique: true },
            status: { type: DataTypes.ENUM(...Object.values(OrderStatus)), allowNull: false, defaultValue: OrderStatus.Pending },
            orderTime: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
        },
        { sequelize, modelName: 'order', tableName: 'orders', timestamps: true }
    )

    OrderArticle.init(
        {
            orderId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
            articleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
            quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
            unitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false }
        },
        { sequelize, modelName: 'orderArticle', tableName: 'order_articles', timestamps: false }
    )

    // relationships
    Event.hasMany(Table, { foreignKey: { name: 'eventId', allowNull: false }, as: 'tables', onDelete: 'CASCADE' })
    Table.belongsTo(Event, { foreignKey: 'eventId', as: 'event' })

    // Event, Article: many to many, because Event lists articles
    Event.belongsToMany(Article, { through: TABLE_EVENT_ARTICLES, as: 'articles' })
    Article.belongsToMany(Event, { through: TABLE_EVENT_ARTICLES, as: 'events' })

    // Table, Order: one to many
    Table.hasMany(Order, { foreignKey: { name: 'tableId', allowNull: false }, as: 'orders', onDelete: 'CASCADE' })
    Order.belongsTo(Table, { foreignKey: 'tableId', as: 'table' })

    // Order, Article: many to many
    Order.belongsToMany(Article, { through: OrderArticle, as: 'articles' })
    Article.belongsToMany(Order, { through: OrderArticle, as: 'orders' })

    await sequelize.sync()
    return { Event, Article, Table, Order }
}

// convenience type helpers for payloads
export type EventDTO = Pick<Event, 'id' | 'name' | 'color' | 'active'> & { articles?: ArticleDTO[], tables?: TableDTO[] }
export type ArticleDTO = Pick<Article, 'id' | 'name' | 'description' | 'price' | 'active'>
export type TableDTO = Pick<Table, 'id' | 'name' | 'eventId'>
export type OrderDTO = Pick<Order, 'id' | 'number' | 'status' | 'orderTime' | 'tableId' | 'articles' | 'table'> & { articles?: ArticleDTO[] }
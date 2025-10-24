import type {ArticleDTO} from '$lib/db/models'

type Subscriber = (json: string) => void

class Cart {
    private items: any[] = []
    private subscribers = new Set<Subscriber>()

    getState() { return { items: this.items } }
    setState(next: { items: any[] }) { this.items = next.items; this.notify() }
    addItem(item: any) { this.items.push(item); this.notify() }

    // remove exactly one occurrence by id
    removeOneById(id: string) {
        const idx = this.items.findIndex(it => it.id === id)
        if (idx !== -1) {
            this.items.splice(idx, 1)
            this.notify()
        }
    }

    removeAllById(id: string) {
        const before = this.items.length
        this.items = this.items.filter(it => it.id !== id)
        if (this.items.length !== before) this.notify()
    }

    clear() { this.items = []; this.notify() }

    subscribe(fn: Subscriber) {
        this.subscribers.add(fn)
        return () => this.subscribers.delete(fn)
    }

    private notify() {
        const json = JSON.stringify(this.getState())
        for (const fn of [...this.subscribers]) {
            try { fn(json) } catch { this.subscribers.delete(fn) }
        }
    }
}



class Carts {
    #byTable = new Map<string, Cart>()
    #get(table: string) {
        let c = this.#byTable.get(table)
        if (!c) { c = new Cart(); this.#byTable.set(table, c) }
        return c
    }

    getState(table: string) { return this.#get(table).getState() }
    setState(table: string, next: { items: any[] }) { this.#get(table).setState(next) }
    addItem(table: string, item: any) { this.#get(table).addItem(item) }
    removeOneById(table: string, id: string) { this.#get(table).removeOneById(id) }
    removeAllById(table: string, id: string) { this.#get(table).removeAllById(id) }
    clear(table: string) { this.#get(table).clear() }
    subscribe(table: string, fn: Subscriber) { return this.#get(table).subscribe(fn) }
}

// export const carts = new Carts()

// important: one instance even across HMR
const g = globalThis as any
export const carts: Carts = g.__carts ?? (g.__carts = new Carts())

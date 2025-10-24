<h1>{data.event.name}</h1>
<h2>Tisch {data.table.name}</h2>

<hr>


<div class="article-list">
    <h3>Warenkorb</h3>

    {#each groupedCart as { article, qty }}
        <div class="item">
            <div class="item-header">
                <h4>{article.name}</h4>
                <p class="item-price">CHF {article.price * qty}</p>
            </div>
            <div class="item-qty">
                <button onclick={() => removeItem(article)} class="item-qty-button">-</button>
                <span>{qty}x</span>
                <button onclick={() => addItem(article)} class="item-qty-button">+</button>
            </div>
        </div>
    {/each}
    <button onclick={emptyCart} class="button-secondary">Warenkorb leeren</button>
</div>


<Navbar>
    <div class="total">
        <p>Total</p>
        <p>CHF {total}</p>
    </div>

    <a href={`${tableUrl}/menu`} class="button-main button-secondary">Arikel Hinzufügen</a>
    <a href={`${tableUrl}/order`} class="button-main">Bestellen</a>
</Navbar>


<script lang="ts">
    import type { PageProps } from './$types'
    import {onMount} from 'svelte'
    import {error} from '@sveltejs/kit'
    import type {ArticleDTO} from '$lib/db/models'
    import Navbar from '$lib/components/navbar.svelte';

    let { data }: PageProps = $props()
    const tableUrl = `/${data.event?.name}/${data.table?.name}`

    let cart = $state<ArticleDTO[]>([])
    let total = $derived( cart.reduce((acc, a) => acc + a.price, 0) )

    type Grouped = { article: ArticleDTO, qty: number }
    const groupedCart = $derived.by<Grouped[]>(() => {
        const map = new Map<string, Grouped>()
        for (const a of cart) {
            const g = map.get(a.id)
            if (g) g.qty += 1
            else map.set(a.id, { article: a, qty: 1 })
        }
        return Array.from(map.values()).sort((a, b) => a.article.name.localeCompare(b.article.name))
    })

    function startStream() {
        console.log('starting stream')
        const stream = new EventSource(`${tableUrl}/stream`)

        stream.addEventListener('update', e => {
            try {
                const data = JSON.parse((e as MessageEvent).data)
                cart = data.items
                console.log('cart:', data.items)
            } catch {}
        })
    }

    async function addItem(article: ArticleDTO) {
        const res = await fetch(`${tableUrl}`, {
            method: 'POST',
            body: JSON.stringify(article),
        })
    }

    async function removeItem(article: ArticleDTO) {
        const res = await fetch(`${tableUrl}`, {
            method: 'DELETE',
            body: JSON.stringify(article),
        })
    }

    async function emptyCart() {
        const res = await fetch(`${tableUrl}`, {
            method: 'DELETE',
        })
    }


    onMount(() => {
        if (!data.validTable) {
            error(404, 'Table not found')
        }

        startStream()
    })

</script>


<style>

    h2 {
        font-size: 16px;
        font-weight: 400;
        margin-top: 6px;
        color: var(--accent-color);
    }

    h3 {
        margin-bottom: 8px;
    }

    hr {
        margin: 20px 0;
    }

    .article-list {
        padding-bottom: 20vh;
    }

    .item {
        border: 1px solid var(--secondary-color);
        border-radius: var(--border-radius);
        padding: 16px;
        margin-bottom: 8px;
    }

    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .item-price {
        margin: 0;
    }

    .item-qty {
        display: flex;
        gap: 4px;
    }

    .item-qty span {
        padding: 0 8px;
        text-align: center;
        line-height: 36px;
        background-color: rgba(112, 112, 112, 0.2);
        border-radius: var(--border-radius);
        color: var(--text-color);
    }

    .item-qty-button {
        background-color: #545454;
        width: 40px;
        height: 36px;
        line-height: 0;
        color: var(--text-color);
    }

    .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        border-top: 1px solid var(--secondary-color);
        margin-bottom: 8px;
    }

</style>

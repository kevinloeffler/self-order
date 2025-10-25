<h1>Bestellung Abschliessen</h1>

<p class="description">
    Möchtest du folgende Artikel für den <span class="table-highlight">Tisch&nbsp;{data.table?.name}</span> bestellen?
</p>

{#each groupedItems as { article, qty }}
    <div class="article">
        <p>{qty}x {article.name}</p>
        <p>CHF {article.price}</p>
    </div>
{/each}

<Navbar>
    <div class="total">
        <p>Total</p>
        <p>CHF {total}</p>
    </div>

    <a href={`/${data.event?.name}/${data.table?.name}`} class="button-main button-secondary">Zurück</a>
    <button onclick={order}>Kostenpflichtig Bestellen</button>
</Navbar>


<script lang="ts">

    import type {PageProps} from './$types'
    import type {ArticleDTO} from '$lib/db/models'
    import {onMount} from 'svelte'
    import Navbar from '$lib/components/navbar.svelte'
    import {goto} from '$app/navigation'

    let { data }: PageProps = $props()
    let items: ArticleDTO[] = $state([])
    let total = $derived( items.reduce((acc, a) => acc + a.price, 0) )

    type Grouped = { article: ArticleDTO, qty: number }
    const groupedItems = $derived.by<Grouped[]>(() => {
        const map = new Map<string, Grouped>()
        for (const a of items) {
            const g = map.get(a.id)
            if (g) g.qty += 1
            else map.set(a.id, { article: a, qty: 1 })
        }
        return Array.from(map.values()).sort((a, b) => a.article.name.localeCompare(b.article.name))
    })

    async function order() {
        const res = await fetch(`/${data.event?.name}/${data.table?.name}/order`, {
            method: 'POST',
            body: JSON.stringify(groupedItems),
        })
        const result = await res.json()
        await goto(`/${data.event?.name}/${data.table?.name}/done/${result.oderId}`)
    }

    async function getCart() {
        const res = await fetch(`/${data.event?.name}/${data.table?.name}`)
        const cart = await res.json()
        items = cart.items
    }

    onMount(getCart)

</script>


<style>

    h1 {
        margin-bottom: 20px;
    }

    .description {
        margin-bottom: 16px;
    }

    .article {
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--secondary-color);
        border-radius: var(--border-radius);
        padding: 16px;
        margin-bottom: 8px;
    }

    .table-highlight {
        color: var(--accent-color);
    }

    p {
        margin: 0;
    }

    .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        border-top: 1px solid var(--secondary-color);
        margin-bottom: 8px;
        padding-top: 8px;
    }

</style>

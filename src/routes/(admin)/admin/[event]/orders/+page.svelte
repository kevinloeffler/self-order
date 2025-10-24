<h1>{data.event?.name}</h1>
<a href={`/admin/${data.event.id}`}>Zurück</a>

{#each orders as order}
    <div class="order">
        <div class="order-header">
            <h2>#{order.number}</h2>
            <p>Tisch {order.table?.name}</p>
            <p class="order-value">CHF --</p>
        </div>
        <hr class="order-divider">
        {#each order?.articles ?? [] as article}
            <p class="article">{article.orderArticle?.quantity}x {article.name}</p>
        {/each}
        <button onclick={() => updateOrderStatus(order)} class="button-main order-button" class:button-completed={order.status === 'Completed'}>
            {#if order.status === 'Confirmed'}
                Abschliessen
            {:else}
                Öffnen
            {/if}
        </button>
    </div>
{/each}




<script lang="ts">
    import type {PageProps} from './$types'
    import {type OrderDTO} from '$lib/db/models'

    const { data }: PageProps = $props()
    const orders = $state<OrderDTO[]>(data.orders)
    $inspect(orders)

    async function updateOrderStatus(order: OrderDTO) {
        const res = await fetch(`/admin/${data.event.id}/orders`, {
            method: 'POST',
            body: JSON.stringify(order)
        })
        const result = await res.json()
        order.status = result.newStatus
    }

    function getOrderValue(order: OrderDTO): number {
        return 0
    }

    function getWaitTime(order: OrderDTO): string {
        return '---'
    }

</script>


<style>

    h2 {
        font-size: 16px;
    }

    .order {
        border: 1px solid var(--secondary-color);
        border-radius: var(--border-radius);
        padding: 12px;
        margin-bottom: 8px;
    }

    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .order-divider {
        margin: 8px 0;
    }

    .order-button {
        margin-top: 8px;
    }

    .button-completed {
        background-color: var(--secondary-color)
    }

    p {
        margin: 0;
    }

</style>
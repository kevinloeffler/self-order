<h1>Self Order</h1>
<div class="event-list">
    {#each data.events as e}
        <div class="event">
            <a href="/admin/{e.id}" class="box">
                {e.name}
            </a>
        </div>
    {/each}
</div>

<Navbar>
    <button class="button-main" onclick={createEvent}>Neuer Event</button>
    <button class="button-secondary">Neuer Event</button>
</Navbar>


<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte'
    import type {PageProps} from './$types'

    let { data }: PageProps = $props()

    async function createEvent() {
        const res = await fetch('?/newEvent', {
            method: 'POST',
            body: new FormData()
        })
        const result = await res.json()
        console.log('client result:', result)
    }

</script>


<style>

    .event-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 20px;
    }

</style>
<h1>{e.name}</h1>

<div class="list">
    <div class="list-item">
        <p class="list-key">Name:</p>
        <input type="text" bind:value={e.name} onchange={updateEvent}>
    </div>

    <div class="list-item">
        <p class="list-key">Farbe:</p>
        <input type="color" bind:value={e.color} onchange={updateEvent}>
    </div>

    <div class="list-item">
        <p class="list-key">Tische:</p>
        <p class="list-value">{e.tables?.length ?? 0}</p>
        <a href={`/admin/${e.id}/tables`}>Bearbeiten</a>
    </div>

    <div class="list-item">
        <p class="list-key">Artikel:</p>
        <p class="list-value">{e.articles?.length ?? 0}</p>
        <a href={`/admin/${e.id}/articles`}>Bearbeiten</a>
    </div>
</div>

<Navbar>
    <a href={`/admin/${e.id}/orders`} class="button-main">Bestellungen</a>
    <a href="/admin" class="button-main button-secondary">Zurück</a>
</Navbar>


<script lang="ts">
    import type {PageProps} from './$types'
    import type {EventDTO} from '$lib/db/models'
    import Navbar from '$lib/components/navbar.svelte';

    let { data }: PageProps = $props()
    let e = $state<EventDTO>(data.event!)

    async function updateEvent() {
        const res = await fetch('?/update', {
           method: 'POST',
           body: JSON.stringify(e),
        })
        const result = await res.json()
        console.log('client result:', result)
    }

</script>


<style>

    h1 {
        margin-bottom: 24px;
    }

    .list-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }

    .list-key {
        min-width: 80px;
    }

    p {
        margin: 0;
    }

    .list-item > a {
        margin-left: 20px;
        color: var(--secondary-color);
    }

</style>

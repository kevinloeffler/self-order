<h1>{data.event.name}/Artikel</h1>

<div class="articles">
    {#each data.event.articles as article}
        <a href={`/admin/${data.event.id}/articles/${article.id}`} class="article">
            <div class="article-header">
                <p>{article.name}</p>
                <p>{article.price} CHF</p>
            </div>
            <p>{article.description}</p>
        </a>
    {:else}
        <p>Keine Artikel vorhanden</p>
    {/each}
</div>


<Navbar>
    <button onclick={createArticle} class="button-main">Neuer Artikel</button>
    <a href={`/admin/${data.event.id}`} class="button-main button-secondary">Zurück</a>
</Navbar>


<script lang="ts">
    import type {PageProps} from './$types'
    import Navbar from '$lib/components/navbar.svelte'
    import {goto} from '$app/navigation'

    let { data }: PageProps = $props()

    async function createArticle() {
        const res = await fetch('?/create', {
            method: 'POST',
            body: new FormData(),
        })
        const result = await res.json()
        const newEventId = JSON.parse(result.data)[0]
        await goto(`/admin/${data.event.id}/articles/${newEventId}`)
    }

</script>


<style>

    h1 {
        margin-bottom: 20px;
    }

    .articles {
        padding-bottom: 20vh;
    }

    .article {
        display: block;
        border: 1px solid var(--secondary-color);
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 8px;
    }

    .article-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-weight: bold;
    }

    p {
        margin: 0;
    }

</style>

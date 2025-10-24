<h1>{data.event.name}/{article.name}</h1>

<div>
    <div class="input-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" bind:value={article.name}>
    </div>

    <div class="input-group">
        <label for="description">Beschrieb:</label>
        <textarea id="description" name="name" bind:value={article.description}></textarea>
    </div>

    <div class="input-group">
        <label for="price">Preis:</label>
        <input type="number" min="0" id="price" name="name" bind:value={article.price}>
    </div>

<!--    <button class="button-secondary">Artikel Ausblenden</button>-->
    <button class="button-secondary" onclick={() => deleteArticle(article.id)}>Artikel Löschen</button>

</div>

<Navbar>
    <button class="button-main" onclick={save}>Speichern</button>
    <a href={`/admin/${data.event.id}/articles`} class="button-main button-secondary">Zurück</a>
</Navbar>


<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte'
    import type {ArticleDTO} from '$lib/db/models'
    import {goto, invalidateAll} from '$app/navigation'

    const { data } = $props()
    const article = $state<ArticleDTO>(data.article!)

    async function save() {
        await fetch('?/update', {
            method: 'POST',
            body: JSON.stringify(article),
        })
        await invalidateAll()
        await goto(`/admin/${data.event.id}/articles`)
    }

    async function deleteArticle(articleId: number) {
        await fetch('?/deleteArticle', {
            method: 'POST',
            body: JSON.stringify({articleId}),
        })
        await invalidateAll()
        await goto(`/admin/${data.event.id}/articles`)
    }

</script>


<style>

    h1 {
        margin-bottom: 20px;
    }

    .input-group {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }

    label {
        min-width: 90px;
    }

    .input-group > input {
        width: 100%;
    }

    textarea {
        width: 100%;
    }

    .delete-button {
        display: inline;
        width: 100px;
        background-color: var(--secondary-color);
    }

</style>

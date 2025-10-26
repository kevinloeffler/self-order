<h1>Menu</h1>

{#each articles as article}
    <div class="article">
        <div class="article-header">
            <h4>{article.name}</h4>
            <p class="item-price">CHF {article.price}</p>
        </div>
        <p>{article.description}</p>
        <button onclick={() => addItem(article)}>Hinzufügen</button>
    </div>
{:else}
    <p>Keine Artikel vorhanden.</p>
{/each}


<Navbar>
    <a href={`/${data.event?.name}/${data.table?.name}`} class="button-main button-secondary">Zurück</a>
</Navbar>


<script lang="ts">

    import type {PageProps} from './$types'
    import type {ArticleDTO} from '$lib/db/models'
    import Navbar from '$lib/components/navbar.svelte';

    let { data }: PageProps = $props()
    const articles: ArticleDTO[] = data.articles!

    async function addItem(article: ArticleDTO) {
        console.log('article:', article)

        const res = await fetch(`/${data.event?.name}/${data.table?.name}`, {
            method: 'POST',
            body: JSON.stringify(article),
        })
        console.log('res:', await res.json())
    }

</script>


<style>

    h1 {
        margin-bottom: 20px;
    }

    .article {
        border: 1px solid var(--secondary-color);
        border-radius: var(--border-radius);
        padding: 16px;
        margin-bottom: 8px;
    }

    .article-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .article > button {
        margin-top: 8px;
    }

    p {
        margin: 0;
    }

</style>
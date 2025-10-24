<h1>{data.event.name}/Tische</h1>

<div class="tables">
    {#each data.event.tables as table}
        <div class="table">
            <p>{table.name}</p>
            <button class="delete-button" onclick={() => deleteTable(table.id)}>Löschen</button>
        </div>
    {:else}
        <p>Keine Tische vorhanden</p>
    {/each}
</div>


<Navbar>
    {#if showNewTableInput}
        <input type="text" placeholder="Tischname" bind:value={newTableName} autofocus>
    {/if}
    <button onclick={createTable}>{showNewTableInput ? 'Speichern' : 'Neuer Tisch'}</button>
    <a href={`/admin/${data.event.id}`} class="button-main button-secondary">Zurück</a>
</Navbar>


<script lang="ts">
    import type {PageProps} from './$types'
    import Navbar from '$lib/components/navbar.svelte'
    import {invalidateAll} from '$app/navigation'

    let { data }: PageProps = $props()

    let showNewTableInput = $state(false)
    let newTableName = $state('')

    async function createTable() {
        if (!showNewTableInput) {
            showNewTableInput = true
            return
        }

        const res = await fetch('?/create', {
            method: 'POST',
            body: JSON.stringify({newTableName}),
        })
        const result = await res.json()  // todo: check result status and display error
        showNewTableInput = false
        newTableName = ''
        await invalidateAll()
    }

    async function deleteTable(tableId: number) {
        await fetch('?/deleteTable', {
            method: 'POST',
            body: JSON.stringify({tableId}),
        })
        await invalidateAll()
    }

</script>


<style>

    h1 {
        margin-bottom: 20px;
    }

    .table {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .delete-button {
        display: inline;
        width: 100px;
        background-color: var(--secondary-color);
    }

</style>

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<div class="page">
    <div class="content">
        {@render children?.()}
    </div>
</div>


<style>

    .page {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        position: relative;
        width: 90%;
        max-width: 1200px;
        margin-top: 40px;
    }

</style>

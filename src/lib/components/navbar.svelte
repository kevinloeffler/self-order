
<div class="navbar">
    {@render children()}
</div>


<style>

    .navbar {
        display: flex;
        flex-direction: column;
        gap: 8px;

        position: fixed;
        bottom: 0;
        width: 90%;
        max-width: 1200px;
        padding-bottom: 20px;
        background-color: var(--background-color);
    }

</style>


<script>
    let { children } = $props();
</script>

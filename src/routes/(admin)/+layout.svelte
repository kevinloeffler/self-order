{#if unlocked}
    <slot /> <!-- protected content -->
{:else}
    <div class="flex flex-col items-center justify-center h-screen gap-4">
        <h1>Enter password</h1>
        <input type="password" bind:value={password} placeholder="Password" class="border p-2" />
        <button on:click={checkPassword} class="border px-3 py-1">Unlock</button>
    </div>
{/if}


<script>
    let password = $state('')

    let unlocked = $state(false)

    if (typeof localStorage !== 'undefined') {
        if (localStorage.getItem('unlocked') === 'true') unlocked = true
    }

    async function checkPassword() {
        const res = await fetch('/api/auth', {method: 'POST', body: JSON.stringify({password})})
        const data = await res.json()
        if (data.ok) {
            unlocked = true
            localStorage.setItem('unlocked', 'true')
        } else {
            alert('Wrong password')
        }
    }

</script>

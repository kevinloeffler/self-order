<h1>Bestellung<br>Erfolgreich</h1>

<p>Vielen Dank für deine Bestellung. Deine Artikel werden zubereitet und in den nächsten Minuten zu deinem Tisch gebracht. Bitte lass dieses Fenster offen bis du deine Bestellung erhalten hast.</p>

<div class="order-number-container">
    <p class="order-number-label">Deine Bestellnummer</p>
    <p class="order-number">#{data.orderId}</p>
</div>


<script lang="ts">
    import type {PageProps} from './$types'

    const { data }: PageProps = $props()

</script>


<style>

    .order-number-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        padding-top: 12vh;
        padding-bottom: 40vh;
        background: linear-gradient(180deg, rgba(67, 185, 253, 0) 0%, var(--accent-color) 100%);
    }

    .order-number-label {
        font-size: 1.2em;
        font-weight: bold;
    }

    .order-number {
        font-size: 12vw;
        font-weight: 800;
    }

</style>
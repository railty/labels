<script>
    export let cols;
    export let product;

</script>

<table class="table is-bordered is-striped is-scrollable is-fullwidth">
    <thead>
        <tr>
            <th style="width:100px">Name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {#each cols as col}
        <tr>
            <td>{col.name}</td>
            <td><input bind:value={product[col.field]}></td>
        </tr>
        {/each}
    </tbody>
</table>
<style>
</style>
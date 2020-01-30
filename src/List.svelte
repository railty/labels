<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let cols;
    export let rows;
    let selectedIdx;

    function click(e){
        selectedIdx = e.currentTarget.getAttribute('idx');
        dispatch('selectionChanged', {
            idx: selectedIdx
        });
    }
</script>

<div id="outer">
    <table class="table is-bordered is-striped is-scrollable is-fullwidth" style="margin-bottom:0;">
        <thead>
            <tr>
                {#each cols as col}
                    <th style="width:{col.width}">{col.name}</th>
                {/each}
            </tr>
        </thead>
    </table>

    <div id="rows" class="table-container">
        <table class="table is-bordered is-striped is-scrollable is-fullwidth">
            <tbody>
                {#each rows as r, idx}
                    <tr on:click={click} idx={idx} class={idx == selectedIdx ? 'is-selected' : ''}>
                        {#each cols as c}
                            <td style="width:{c.width}">{r[c.field]}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    div#outer {
        display: flex;
        flex-flow: column;
        height: 100%;
    }
    div#rows {
        flex-grow:1; 
        overflow: auto;
    }
</style>
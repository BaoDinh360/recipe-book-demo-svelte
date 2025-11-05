<script lang="ts">
	import RecipeDetail from "$lib/components/RecipeDetail.svelte";
	import { notifyError } from "$lib/stores/notification-stores";
	import type { PageProps } from "./$types";


    // path: /recipes/[recipeId]

    let { data }: PageProps = $props();

    $effect(() => {
        if(data.errorMsg) {
            notifyError(data.errorMsg);
        }
    })

</script>

{#if data.recipeDetailData}
    <RecipeDetail recipeDetails={data.recipeDetailData}/>
{:else}
    <p>Recipe data not found</p>
{/if}

<style>

</style>
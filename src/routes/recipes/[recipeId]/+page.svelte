<script lang="ts">
	import RecipeDetail from "$lib/components/RecipeDetail.svelte";
	import type { PageProps } from "./$types";


    // path: /recipes/[recipeId]

    let { data }: PageProps = $props();

</script>

{#if data.recipeDetailData}
    <RecipeDetail recipeDetails={data.recipeDetailData}/>
{:else}
    <p>Error: cannot find recipe data</p>
{/if}

<style>

</style>
<script lang="ts">
	import RecipeDetail from "$lib/components/RecipeDetail.svelte";
	import type { PageProps } from "./$types";

    // path: /recipes/[recipeId]
    let { data }: PageProps = $props();

</script>

<main class="flex-1 flex flex-col items-center w-full px-4 md:px-10 lg:px-40 py-8">
    {#if data.recipeDetailData}
        <RecipeDetail recipeDetails={data.recipeDetailData}/>
    {:else}
        <p>Recipe data not found</p>
    {/if}
</main>

<style></style>
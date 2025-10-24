<script lang="ts">
	import RecipeList from "$lib/components/RecipeList.svelte";
	import type { PageProps } from "./$types";
	
    // /recipes/index

    // must import the correct level of './$ypes to get the correct ts types'
    let { data }: PageProps = $props();
    //const { recipeListData } = data;
    
</script>

<RecipeList recipeList={data.recipeListData}/>

<style>

</style>
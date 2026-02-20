<script lang="ts">
	import { SquarePlusIcon } from "$lib/icons";
    import { page } from "$app/state";
	import Pagination from "$lib/components/Pagination.svelte";
	import RecipeFilter from "$lib/components/RecipeFilter.svelte";
	import RecipeList from "$lib/components/RecipeList.svelte";
	import { lastRecipeUrl } from "$lib/stores/navigation-state";
	import { notifyError } from "$lib/stores/notification-stores";
	import type { PageProps } from "./$types";
	import { goto } from "$app/navigation";
	import type { RecipeFilterPayload } from "$lib/types/recipe-types";
	
    // /recipes/index

    // must import the correct level of './$ypes to get the correct ts types'
    let { data }: PageProps = $props();
    let recipeFilters: RecipeFilterPayload = $derived.by(() => {
        let result: RecipeFilterPayload = {
            text: undefined,
            category: undefined,
            prepTimeMin: undefined,
            sortBy: undefined
        };
        if(data.recipeFilters) {
            result = data.recipeFilters;
        }
        return result;
    })
    
    $effect(() => {
        if(data.errorMsg) {
            notifyError(data.errorMsg);
        }
    })
    $effect(() => {
        lastRecipeUrl.set(page.url.pathname + page.url.search);
    })

</script>

<main class="flex-1 w-full mx-auto px-4 sm:px-6 py-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-4xl font-heading font-black leading-tight tracking-tight text-neutral">My Recipes
            </h1>
            <p class="text-neutral/80 text-lg">
                Manage, edit, and share your culinary creations.
            </p>
        </div>
        <button
            class="flex items-center gap-2 bg-accent hover:brightness-95 text-neutral px-6 py-3 
                rounded-lg font-bold shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 
                active:translate-y-0"
            onclick={() => goto('/recipes/create')}>
            <SquarePlusIcon class="size-5" />
            <span>Create New Recipe</span>
        </button>
    </div>

    <div class="w-full mx-auto flex flex-col gap-6">
        <RecipeFilter {recipeFilters}/>

        <RecipeList recipeList={data.recipeListData}/>

        <Pagination 
            currentPage={data.currentPage}
            itemsPerPage={data.itemsPerPage}
            totalPages={data.totalPages}
            totalItems={data.totalItems}/>
    </div>
    
</main>
<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { categoryOptions, sortingOptions } from "$lib/constants";
	import type { RecipeCategory, RecipeFilterCriteria } from "$lib/recipe-types";
	import { SearchIcon } from '$lib/icons';

    let { recipeFilters }: 
    { recipeFilters: RecipeFilterCriteria } = $props();

    // local input state
    let filterInput: {
        text: string | undefined,
        category: RecipeCategory | undefined,
        prepTimeMin: number | undefined,
        sortBy: string | undefined,
    } = $state({
        text: undefined,
        category: undefined,
        prepTimeMin: undefined,
        sortBy: 'created',
    });

    $effect(() => {
        // sync the props with the local state when props change
        filterInput = {
            text: recipeFilters.text,
            category: recipeFilters.category,
            prepTimeMin: recipeFilters.prepTimeMin,
            sortBy: recipeFilters.sortBy || 'created'
        };
    })

    const onFilterRecipe = () => {
        const searchParams = new URLSearchParams(page.url.searchParams);
        const { text, category, prepTimeMin, sortBy } = filterInput;
        // construct filter params
        if(text) {
            searchParams.set('text', text);
        } else {
            searchParams.delete('text');
        }
        if(category) {
            searchParams.set('category', category);
        } else {
            searchParams.delete('category');
        }
        if(prepTimeMin) {
            searchParams.set('prepTimeMin', String(prepTimeMin));
        } else {
            searchParams.delete('prepTimeMin');
        }
        // sort by
        if(sortBy) {
            searchParams.set('sort', sortBy);
        } else {
            searchParams.delete('sort');
        }
        // reset pagination when apply fitler
        resetPagination(searchParams);
        // trigger url changes
        goto(`?${searchParams.toString()}`, { replaceState: true, noScroll: true });
    }

    const resetPagination = (searchParams: URLSearchParams) => {
        searchParams.set('page', String(1));
        searchParams.set('perPage', String(3));
    }

    const onResetFilter = () => {
        const searchParams = new URLSearchParams(page.url.searchParams);
        searchParams.delete('text');
        searchParams.delete('category');
        searchParams.delete('prepTimeMin');
        resetPagination(searchParams);
        // trigger url changes
        goto(`?${searchParams.toString()}`, { replaceState: true, noScroll: true });
    }

</script>

<div class="bg-white p-4 sm:p-4 rounded-lg shadow-md border border-gray-100 mb-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-end">
        <div class="col-span-1 md:col-span-2">
            <label class="label" for="search">
                <span class="label-text text-gray-700 text-sm font-semibold">Search keywords</span>
            </label>
            <label class="input input-bordered input-sm flex items-center gap-2">
                <input type="text" class="grow" placeholder="Title, code..." id="search" 
                    bind:value={filterInput.text}/>
                <SearchIcon class="h-5 w-5 stroke-gray-600" />
            </label>
        </div>
        <div class="form-control md:col-span-1">
            <label class="label" for="filterCateg">
                <span class="label-text text-gray-700 text-sm font-semibold">Category</span>
            </label>
            <select class="select select-sm select-bordered w-full" id="filterCateg"
                bind:value={filterInput.category}
                >
                <option value={undefined}>---All---</option>
                {#each categoryOptions as option }
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
        <!-- prep time -->
        <div class="form-control md:col-span-1">
            <label class="label" for="filterPrep">
                <span class="label-text text-gray-700 text-sm font-semibold">Prep Time (min)</span>
            </label>
            <input type="number" class="input input-sm input-bordered w-full" id="filterPrep"
                placeholder="e.g., 26"
                bind:value={filterInput.prepTimeMin}
                />
        </div>
        <!-- sorting -->
        <div class="form-control md:col-span-1">
            <label class="label" for="sort">
                <span class="label-text text-gray-700 text-sm font-semibold">Sort by</span>
            </label>
            <select class="select select-sm select-bordered w-full" id="sort"
                bind:value={filterInput.sortBy}>
                {#each sortingOptions as option }
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
        <!-- button -->
        <div class="md:col-span-1 flex flex-col justify-end gap-2 h-full">
            <button type="button" class="btn btn-sm btn-info w-full"
                onclick={onFilterRecipe}>
                Apply
            </button>
            <button type="button" class="btn btn-sm w-full"
                onclick={onResetFilter}>
                Reset
            </button>
        </div>
    </div>
</div>

<style>

</style>
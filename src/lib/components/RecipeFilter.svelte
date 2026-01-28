<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { categoryOptions, DEFAULT_ITEMS_PER_PAGE, DEFAULT_START_PAGE, sortingOptions } from "$lib/constants";
	import type { RecipeCategory, RecipeFilterCriteria } from "$lib/recipe-types";
	import { FunnelXIcon, SearchIcon } from '$lib/icons';

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
        sortBy: '-created',
    });

    $effect(() => {
        // sync the props with the local state when props change
        filterInput = {
            text: recipeFilters.text,
            category: recipeFilters.category,
            prepTimeMin: recipeFilters.prepTimeMin,
            sortBy: recipeFilters.sortBy || '-created'
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
        searchParams.set('page', String(DEFAULT_START_PAGE));
        searchParams.set('perPage', String(DEFAULT_ITEMS_PER_PAGE));
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

<div class="flex flex-col lg:flex-row lg:items-end gap-4">
    <div class="w-2/5 pb-4">
        <label class="w-full input input-bordered flex items-center gap-2 relative group
            border-base-300 rounded-lg bg-base-200 text-neutral placeholder-neutral/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
            <SearchIcon class="h-5 w-5 text-neutral/50 group-focus-within:text-primary" />
            <input type="text" class="grow" placeholder="Search your recipes..." id="search" 
                bind:value={filterInput.text}/>
        </label>
    </div>
    
    <div class="w-2/5 flex gap-2 overflow-x-auto scrollbar-hide items-center pb-4">
        <!-- category -->
        <div class="form-control px-2 w-full">
            <label class="label" for="filterCateg">
                <span class="label-text text-sm font-semibold text-neutral">
                    Category
                </span>
            </label>
            <select class="select select-bordered w-full bg-base-200 border border-base-300 rounded-lg text-base text-neutral focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                id="filterCateg"
                bind:value={filterInput.category}
                >
                <option value={undefined}>All</option>
                {#each categoryOptions as option }
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
        <!-- prep time -->
        <div class="form-control px-2 w-full">
            <label class="label" for="filterPrep">
                <span class="label-text text-sm font-semibold text-neutral">
                    Prep Time (min)
                </span>
            </label>
            <input type="number" class="input input-bordered w-full py-3 px-4 flex items-center gap-2 relative group
                border border-base-300 rounded-lg bg-base-200 text-neutral placeholder-neutral/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                id="filterPrep"
                placeholder="e.g., 26"
                bind:value={filterInput.prepTimeMin}
                />
        </div>
        <!-- sorting -->
        <div class="form-control px-2 w-full">
            <label class="label" for="sort">
                <span class="label-text text-sm font-semibold text-neutral">
                    Sort by
                </span>
            </label>
            <select class="select select-bordered w-full bg-base-200 border border-base-300 rounded-lg text-base text-neutral focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                id="sort"
                bind:value={filterInput.sortBy}>
                {#each sortingOptions as option }
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="w-1/5 flex gap-2 items-center justify-end pb-4">
        <button class="px-6 py-3 rounded-lg bg-primary text-base text-neutral-content font-semibold shadow-md shadow-primary/20 hover:brightness-95 transition-all"
            onclick={onFilterRecipe} type="button">
            Apply Filters
        </button>
        <button class="px-6 py-3 rounded-lg bg-white border border-base-300 text-neutral font-medium hover:bg-base-300/10 transition-colors"
            onclick={onResetFilter} type="button" aria-label="reset filter">
            <FunnelXIcon class="size-5" />
        </button>
    </div>
</div>

<style></style>
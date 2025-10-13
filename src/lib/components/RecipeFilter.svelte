<script lang="ts">
	import { categoryOptions, sortingOptions } from "$lib/constants";
	import { type FilterCriteria, type SelectOption, type SortCriteria } from "$lib/types";

    // local filter state
    let filterInput: {
        category: string | null,
        prepTimeMin: number | null,
        sortBy: SortCriteria
    } = $state({
        category: null,
        prepTimeMin: null,
        sortBy: 'DATE_ASC'
    });

    let { onFilterChange }: {
        onFilterChange: (filter: FilterCriteria) => void,
    } = $props();

    const filterInputChange = () => {
        onFilterChange({...filterInput});
    }

    const resetFilter = () => {
        filterInput = {
            category: null,
            prepTimeMin: null,
            sortBy: 'DATE_ASC'
        };
        onFilterChange({...filterInput});
    }

</script>

<div class="p-4 mb-4 flex flex-col sm:flex-row gap-4 items-end">
    <!-- category -->
    <div class="form-control flex-1">
        <label class="label" for="filterCateg">
            <span class="label-text text-gray-600 text-sm">Category</span>
        </label>
        <select class="select select-sm select-bordered w-full" id="filterCateg"
            bind:value={filterInput.category}
            onchange={filterInputChange}>
            <option value={null}>---All---</option>
            {#each categoryOptions as option }
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </div>
    <!-- prep time -->
    <div class="form-control flex-1">
        <label class="label" for="filterPrep">
            <span class="label-text text-gray-600 text-sm">Prep time under(min):</span>
        </label>
        <input type="number" class="input input-sm input-bordered w-full" id="filterPrep"
            placeholder="Filter by prep time"
            bind:value={filterInput.prepTimeMin}
            onchange={filterInputChange}/>
    </div>
    <!-- sorting -->
    <div class="form-control flex-1">
        <label class="label" for="sort">
            <span class="label-text text-gray-600 text-sm">Sorting by</span>
        </label>
        <select class="select select-sm select-bordered w-full" id="sort"
            bind:value={filterInput.sortBy}
            onchange={filterInputChange}>
            {#each sortingOptions as option }
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </div>
    <!-- reset filters -->
    <div class="flex-0">
        <button type="button" class="btn btn-sm btn-outline btn-info"
            onclick={resetFilter}>
            Reset
        </button>
    </div>
</div>

<style>

</style>
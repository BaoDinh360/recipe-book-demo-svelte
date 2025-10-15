<script lang="ts">
	import { itemsPerPageOptions } from "$lib/constants";


    let { currentPage, totalPages, itemsPerPage, totalItems, 
        onPageChange, onItemsPerPageChange }: {
        currentPage: number,
        totalPages: number,
        itemsPerPage: number,
        totalItems: number,
        onPageChange: (pageNum: number) => void,
        onItemsPerPageChange: (itemsPerPage: number) => void
    } = $props();

    // derived values from props, use as local state
    // when props values changes, these also reactively changes
    let pageSelected: number = $derived(currentPage);
    let perPageSelected: number = $derived(itemsPerPage);

    const onSelectPerPage = () => {
        if(itemsPerPage !== perPageSelected) {
            onItemsPerPageChange(perPageSelected);
        }
    }

    const onSelectPage = () => {
        if(pageSelected >= 1 && 
            pageSelected <= totalPages && 
            currentPage !== pageSelected){
            onPageChange(pageSelected);
        }
    }
    const nextPage = () => {
        if(currentPage < totalPages) {
            let pageNum: number = currentPage + 1;
            onPageChange(pageNum);
        }
    };
    const previousPage = () => {
        if(currentPage > 1) {
            let pageNum: number = currentPage - 1;
            onPageChange(pageNum);
        }
    };

</script>

<div class="mt-6 flex flex-col sm:flex-row items-center justify-between p-3 text-sm">
    <!-- items count, items per page -->
    <div class="flex items-center gap-8 mb-3 sm:mb-0">
        <!-- items per page -->
        <div class="flex items-center gap-2">
            <span class="text-gray-600 whitespace-nowrap hidden sm:inline">Per page:</span>
            <select class="select select-bordered select-sm" id="perPage"
                bind:value={perPageSelected}
                onchange={onSelectPerPage}>
                {#each itemsPerPageOptions as {label, value} }
                    <option value={value}>{label}</option>
                {/each}
            </select>
        </div>
        <!-- items count -->
        <span class="text-gray-500">
            Total: <span class="font-medium text-indigo-600">{totalItems}</span> recipes
        </span>
    </div>
    <!-- page navigation -->
    <div class="flex items-center gap-4">
        <!-- previous -->
        <button class="btn btn-outline btn-neutral btn-sm group text-black" 
            aria-label="Prev"
            disabled={currentPage === 1}
            onclick={previousPage}>
            <svg class="group-hover:text-white fill-current" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.7,15.3L13.4,12l3.3-3.3c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0l-4,4c0,0,0,0,0,0c-0.4,0.4-0.4,1,0,1.4l4,4c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3C17.1,16.3,17.1,15.7,16.7,15.3z M8,7C7.4,7,7,7.4,7,8v8c0,0.6,0.4,1,1,1s1-0.4,1-1V8C9,7.4,8.6,7,8,7z"></path></g></svg>
        </button>
        <!-- page select -->
        <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="text-gray-600">Page</span>
            <select class="select select-bordered select-sm" id="currPage"
                disabled={totalPages === 1}
                bind:value={pageSelected}
                onchange={onSelectPage}>
                {#each Array(totalPages).keys() as pageNum }
                    <option value={pageNum + 1}>{pageNum + 1}</option>
                {/each}
            </select>
            <span class="text-gray-600"> of {totalPages}</span>
        </div>
        <!-- next -->
        <button class="btn btn-outline btn-neutral btn-sm group text-black" 
            aria-label="Next"
            disabled={currentPage === totalPages}
            onclick={nextPage}>
            <svg class="group-hover:text-white fill-current" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.7,15.3L13.4,12l3.3-3.3c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0l-4,4c0,0,0,0,0,0c-0.4,0.4-0.4,1,0,1.4l4,4c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3C17.1,16.3,17.1,15.7,16.7,15.3z M8,7C7.4,7,7,7.4,7,8v8c0,0.6,0.4,1,1,1s1-0.4,1-1V8C9,7.4,8.6,7,8,7z"></path></g></svg>
        </button>
    </div>
</div>

<style>

</style>
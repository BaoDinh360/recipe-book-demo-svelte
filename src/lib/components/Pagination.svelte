<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { itemsPerPageOptions } from "$lib/constants";
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";


    let { currentPage, totalPages, itemsPerPage, totalItems,
    }: {
        currentPage: number,
        totalPages: number,
        itemsPerPage: number,
        totalItems: number,
    } = $props();

    const onPaginationStateChange = ({currentPage, perPage}: {currentPage: number, perPage: number}) => {
        // update url query params --> trigger re run load func re fetch data
        const searchParams = new URLSearchParams(page.url.searchParams);
        searchParams.set('page', String(currentPage));
        searchParams.set('perPage', String(perPage));
        
        console.log('new url query params: ', searchParams);
        goto(`?${searchParams.toString()}`, { replaceState: true, noScroll: true });
    }

    const onSelectPerPage = (e: Event) => {
        // change perPage, currentPage
        const perPageSelected = Number((e.target as HTMLSelectElement).value);
        if(itemsPerPage !== perPageSelected) {
            // only perform when current perPage <> selected perPage
            // reset page params when change items per page
            onPaginationStateChange({currentPage: 1, perPage: perPageSelected});
        }
    }
    const onSelectPage = (e: Event) => {
        // only change currentPage
        const pageSelected = Number((e.target as HTMLSelectElement).value);
        if(pageSelected >= 1 && 
            pageSelected <= totalPages && 
            currentPage !== pageSelected){
            // perPage read value from props
            onPaginationStateChange({currentPage: pageSelected, perPage: itemsPerPage});
        }
    }
    const nextPage = () => {
        // change currentPage only
        if(currentPage < totalPages) {
            let pageNum: number = currentPage + 1;
            // perPage read value from props
            onPaginationStateChange({currentPage: pageNum, perPage: itemsPerPage});
        }
    };
    const previousPage = () => {
        // change currentPage only
        if(currentPage > 1) {
            let pageNum: number = currentPage - 1;
            // perPage read value from props
            onPaginationStateChange({currentPage: pageNum, perPage: itemsPerPage});
        }
    };

</script>

<div class="flex flex-col md:flex-row items-center justify-between mb-6  p-3 rounded-lg
    bg-white border border-gray-100 shadow-sm">
    <!-- items count, items per page -->
    <div class="flex items-center gap-8 mb-3 sm:mb-0">
        <!-- items per page -->
        <div class="flex items-center gap-2">
            <span class="text-gray-600 whitespace-nowrap hidden sm:block">Per page:</span>
            <select class="select select-bordered select-sm" id="perPage"
                value={itemsPerPage}
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
        <button class="btn btn-ghost btn-sm group text-black" 
            aria-label="Prev"
            disabled={currentPage === 1}
            onclick={previousPage}>
            <ChevronLeft class="h-4 w-4 stroke-current" strokeWidth=3 />
            Prev
        </button>
        <!-- page select -->
        <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="text-gray-600">Page</span>
            <select class="select select-bordered select-sm" id="currPage"
                disabled={totalPages === 1}
                value={currentPage}
                onchange={onSelectPage}>
                {#each Array(totalPages).keys() as pageNum }
                    <option value={pageNum + 1}>{pageNum + 1}</option>
                {/each}
            </select>
            <span class="text-gray-600"> of {totalPages}</span>
        </div>
        <!-- next -->
        <button class="btn btn-ghost btn-sm group text-black" 
            aria-label="Next"
            disabled={currentPage === totalPages}
            onclick={nextPage}>
            Next
            <ChevronRight class="h-5 w-5 stroke-current"/>
        </button>
    </div>
</div>

<style>

</style>
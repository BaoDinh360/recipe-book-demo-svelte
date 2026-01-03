<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { itemsPerPageOptions } from "$lib/constants";
    import { ChevronLeftIcon, ChevronRightIcon } from '$lib/icons';

    const DEFAULT_SIBLINGS = 1;

    let { currentPage, totalPages, itemsPerPage, totalItems,
    }: {
        currentPage: number,
        totalPages: number,
        itemsPerPage: number,
        totalItems: number,
    } = $props();

    let startIndex: number = $derived(totalItems == 0 ? 0 : (currentPage - 1) * itemsPerPage + 1);
    let endIndex: number = $derived(Math.min(currentPage * itemsPerPage, totalItems));

    const caculatePaginationRange = (
        currentPage: number, totalPages: number, siblings: number = DEFAULT_SIBLINGS) => {
        // total pages must show: first, last, 2 ellipis, current page, siblings
        // total pages = 2*n + 5 (n = siblings)
        const totalPageNumbers = siblings * 2 + 5;
        if (totalPageNumbers >= totalPages) {
            // if total pages smaller, show all
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        // calculate the next to left, right of current page
        const leftSiblingIdx = Math.max(currentPage - siblings, 1);
        const rightSiblingIdx = Math.min(currentPage + siblings, totalPages);

        // only display dots if match these
        const showLeftDots = leftSiblingIdx > 2;
        const showRightDots = rightSiblingIdx < totalPages - 1;

        // on the left
        if (!showLeftDots && showRightDots) {
            // do not show dots on left, but must maintain number of pages show (2n + 5)
            // right dots, last page --> left page must show: 2n + 5 - 2 = 2n + 3
            let leftItemCount = 3 + 2 * siblings;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }
        // on the right
        if (showLeftDots && !showRightDots) {
            let rightItemCount = 3 + 2 * siblings;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - i + 1).reverse();
            return [1, '...', ...rightRange];
        }
        // middle
        if (showLeftDots && showRightDots) {
            let middleRange = Array.from(
                { length: rightSiblingIdx - leftSiblingIdx + 1 },
                (_, i) => leftSiblingIdx + i
            );
            return [1, '...', ...middleRange, '...', totalPages];
        }
    }

    let paginationRange = $derived(caculatePaginationRange(currentPage, totalPages));

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
    // const onSelectPage = (e: Event) => {
    //     // only change currentPage
    //     const pageSelected = Number((e.target as HTMLSelectElement).value);
    //     if(pageSelected >= 1 && 
    //         pageSelected <= totalPages && 
    //         currentPage !== pageSelected){
    //         // perPage read value from props
    //         onPaginationStateChange({currentPage: pageSelected, perPage: itemsPerPage});
    //     }
    // }
    const onPageClicked = (page: number) => {
        if (page >= 1 && page <= totalPages && currentPage !== page) {
            onPaginationStateChange({ currentPage: page, perPage: itemsPerPage });
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

<!-- <div class="flex flex-col md:flex-row items-center justify-between p-3 rounded-lg
    bg-white border border-gray-100 shadow-sm">
    <div class="flex items-center gap-8 mb-3 sm:mb-0">
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
        <span class="text-gray-500">
            Total: <span class="font-medium text-indigo-600">{totalItems}</span> recipes
        </span>
    </div>
    <div class="flex items-center gap-4">
        <button class="btn btn-ghost btn-sm group text-black" 
            aria-label="Prev"
            disabled={currentPage === 1}
            onclick={previousPage}>
            <ChevronLeftIcon class="h-4 w-4 stroke-current" strokeWidth=3 />
            Prev
        </button>
        <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="text-gray-600">Page</span>
            <select class="select select-bordered select-sm" id="currPage"
                disabled={totalPages === 1}
                value={currentPage}>
                {#each Array(totalPages).keys() as pageNum }
                    <option value={pageNum + 1}>{pageNum + 1}</option>
                {/each}
            </select>
            <span class="text-gray-600"> of {totalPages}</span>
        </div>
        <button class="btn btn-ghost btn-sm group text-black" 
            aria-label="Next"
            disabled={currentPage === totalPages}
            onclick={nextPage}>
            Next
            <ChevronRightIcon class="h-5 w-5 stroke-current"/>
        </button>
    </div>
</div> -->

<!-- baodnq 20251229 update ui -->
<div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 mt-6 border-t border-base-300">
    <div class="text-sm text-neutral/70 order-2 md:order-1 font-medium">
        Showing <span class="font-bold text-neutral">{startIndex} - {endIndex}</span> 
        of 
        <span class="font-bold text-neutral">{totalItems}</span> 
        recipes
    </div>
    <nav class="flex items-center gap-2 order-1 md:order-2">
        <button class="size-10 flex items-center justify-center rounded-lg border border-base-300
            bg-white hover:bg-base-300/30 text-neutral transition-colors 
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage == 1}
            onclick={previousPage}>
            <ChevronLeftIcon class="h-4 w-4"/>
        </button>
        {#each paginationRange as page }
            {#if page === '...'}
                <button class="size-10 flex items-center justify-center rounded-lg border border-base-300
                    bg-white hover:bg-base-300/30 text-neutral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled>
                    ...
                </button>
            {:else}
                <button class="size-10 flex items-center justify-center rounded-lg"
                    class:active-page={currentPage === page}
                    class:inactive-page={currentPage !== page}
                    onclick={() => onPageClicked(page as number)}>
                    {page}
                </button>
            {/if}
        {/each}
        <button class="size-10 flex items-center justify-center rounded-lg border border-base-300
            bg-white hover:bg-base-300/30 text-neutral transition-colors 
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onclick={nextPage}>
            <ChevronRightIcon class="size-4" />
        </button>
    </nav>
    <div class="flex items-center gap-3 order-3">
        <span class="text-sm text-neutral/70 hidden sm:inline font-medium">
            Items per page:
        </span>
        <div class="relative min-w-[80px]">
             <select class="select select-sm select-bordered w-5/6 bg-base-200 border border-base-300 rounded-lg text-base 
             text-neutral text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer shadown-sm" 
                id="perPage"
                value={itemsPerPage}
                onchange={onSelectPerPage}>
                {#each itemsPerPageOptions as {label, value} }
                    <option value={value}>{label}</option>
                {/each}
            </select>
        </div>
    </div>
</div>

<style lang="postcss">
    .active-page {
        @apply bg-primary text-primary-content font-bold shadow-md shadow-primary/30;
    }
    .inactive-page {
        @apply border border-base-300 bg-white hover:bg-base-300/30 text-neutral font-medium transition-colors;
    }
</style>
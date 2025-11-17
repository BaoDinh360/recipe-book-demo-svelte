<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PageType } from '$lib/types';
    import '../../app.css';
    import { MoveLeftIcon, SquarePlusIcon } from '$lib/icons';
	import { navigateToRecipes } from '$lib/utils/navigation';
    let { children } = $props();

    
    // let layoutPageType: PageType = $derived.by(() => {
    //     let result : PageType = PageType.INDEX;
    //     const currentPageUrl = page.route.id
    //     console.log('current route: ', currentPageUrl);
    //     switch(currentPageUrl) {
    //         case '/recipes':
    //             result = PageType.INDEX;
    //             break;
    //         case '/recipes/[recipeId]':
    //             result = PageType.DETAIL;
    //             break;
    //         case '/recipes/create':
    //             result = PageType.CREATE;
    //             break;
    //         case '/recipes/edit/[recipeId]':
    //             result = PageType.EDIT;
    //             break;
    //     }
    //     return result;
    // });
    // let title = $derived.by(() => {
    //     let result = '';
    //     switch (layoutPageType) {
    //         case PageType.INDEX:
    //             result = 'All Recipes';
    //             break;
    //         case PageType.DETAIL:
    //             result = 'Recipes Details';
    //             break;
    //         case PageType.CREATE:
    //             result = 'Add Recipe';
    //             break;
    //         case PageType.EDIT:
    //             result = 'Edit Recipe';
    //     }
    //     return result;
    // });
    // let subText = $derived.by(() => {
    //     let result = '';
    //     switch (layoutPageType) {
    //         case PageType.INDEX:
    //             result = 'View and manage all saved recipes';
    //             break;
    //         case PageType.DETAIL:
    //             result = 'See the ingredients and instructions for this recipe';
    //             break;
    //         case PageType.CREATE:
    //             result = 'Create a new recipe and save it to your collection';
    //             break;
    //         case PageType.EDIT:
    //             result = 'Update the details of an existing recipe';
    //     }
    //     return result;
    // });

</script>

<!-- <header class="flex justify-between items-center w-full mx-auto mb-4">
    <div class="flex items-center space-x-6">
        {#if layoutPageType !== PageType.INDEX}
            <button class="btn btn-ghost group hover:bg-indigo-500"
                aria-label="Back"
                onclick={async () => await navigateToRecipes()}>
                <MoveLeftIcon class="h-6 w-6 stroke-indigo-700 group-hover:stroke-white"/>
            </button>
        {/if}
        <div class="pl-4">
            <h1 class="font-bold text-gray-600 text-2xl">{title}</h1>
            <p class="text-gray-600 text-lg">{subText}</p>
        </div>
    </div>
    {#if layoutPageType === PageType.INDEX}
        <button class="btn btn-primary btn-sm md:btn-md w-36 font-semibold text-white"
            onclick={() => goto('/recipes/create')}>
            <SquarePlusIcon />
            Create
        </button>
    {/if}
</header> -->

<div class="flex justify-end items-center w-full mx-auto mb-4">
    {#if page.route.id === '/recipes'}
        <!-- only show create button in index page -->
        <button class="btn btn-primary btn-sm md:btn-md w-36 font-semibold text-white"
            onclick={() => goto('/recipes/create')}>
            <SquarePlusIcon />
            Create
        </button>
    {/if}
</div>

<!-- child content -->
{@render children?.()}
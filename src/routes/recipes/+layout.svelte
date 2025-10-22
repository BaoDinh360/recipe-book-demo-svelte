<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PageType } from '$lib/types';
    import '../../app.css';
    let { children } = $props();

    
    let layoutPageType: PageType = $derived.by(() => {
        let result : PageType = PageType.INDEX;
        const currentPageUrl = page.route.id
        switch(currentPageUrl) {
            case '/recipes':
                result = PageType.INDEX;
                break;
            case '/recipes/create':
                result = PageType.CREATE;
                break;
            case '/recipes/edit/[recipeId]':
                result = PageType.EDIT;
                break;
        }
        return result;
    });
    let title = $derived.by(() => {
        let result = '';
        switch (layoutPageType) {
            case PageType.INDEX:
                result = 'Recipes';
                break;
            case PageType.CREATE:
                result = 'Create recipe';
                break;
            case PageType.EDIT:
                result = 'Edit recipe';
        }
        return result;
    });
    let subText = $derived.by(() => {
        let result = '';
        switch (layoutPageType) {
            case PageType.INDEX:
                result = 'View and manage your recipes';
                break;
            case PageType.CREATE:
                result = 'Create a new recipe';
                break;
            case PageType.EDIT:
                result = 'Edit existing recipe';
        }
        return result;
    });

</script>

<!-- <div class="navbar bg-gray-50 rounded-xl shadow-md mb-8 w-full mx-auto border-b border-gray-100">
    <div class="flex flex-row items-center gap-8">
        <div class="flex">
            <h1 class="font-bold text-gray-700 ml-4 text-xl">Recipes</h1>
        </div>
        <div class="flex items-center gap-3 p-2">
            <a href="/recipes" class="btn btn-ghost text-indigo-700 hover:bg-gray-200 text-lg">
                List
            </a>
            <a href="/recipes/create" class="btn btn-ghost text-indigo-700 hover:bg-gray-200 font-semibold text-lg">
                Create
            </a>
        </div>
    </div>
</div> -->

<!-- recipe top bar -->
<div class="w-full mx-auto pl-4 pr-4 mb-6">
    <div class="flex flex-row items-center gap-4">
        <!-- title -->
        <div class="flex-1 flex flex-col gap-2">
            <h1 class="font-bold text-gray-600 text-2xl">{title}</h1>
            <p class="text-gray-600 text-lg">{subText}</p>
        </div>
        <!-- right item -->
        {#if layoutPageType === PageType.INDEX}
            <!-- only show create button in index page -->
            <div class="flex-none">
                <button class="btn btn-primary w-36 font-semibold text-lg text-white"
                    onclick={() => goto('/recipes/create')}>
                    Create
                </button>
            </div>
        {/if}
        
    </div>
</div>

<!-- child content -->
<div class="w-full mx-auto pl-4 pr-4 rounded-xl shadow-xl bg-white border border-gray-200">
    {@render children?.()}
</div>


<script lang="ts">
	import { page } from "$app/state";
	import { BookOpenTextIcon, PanelLeftCloseIcon, HouseHeartIcon, ChefHatIcon, PanelLeftOpenIcon } from "$lib/icons";


    // collapsible sidebar
	let collapsed: Boolean = $state(false);
    let currentPath = $derived(page.url.pathname);

</script>

<div id="sidebar" class="bg-indigo-600 text-white flex-shrink-0 flex flex-col px-2 py-2 shadow-2xl 
    sticky top-0 h-screen hidden md:flex transition-all duration-300"
    class:w-56={!collapsed}
    class:w-20={collapsed}
    class:items-start={!collapsed}
    class:items-center={collapsed}>
    <div class="flex items-center justify-between pb-2 mb-4 w-full border-b border-indigo-300"
        class:justify-between={!collapsed}
        class:justify-center={collapsed}>
        <a href="/" class="text-xl font-extrabold overflow-hidden whitespace-nowrap" class:hidden={collapsed}>
            <div class="flex items-center gap-2">
                <BookOpenTextIcon class="h-5 w-5" />
                <span class="sidebar-title">
                    RecipeBook
                </span>
            </div>	
        </a>
        <button class="btn btn-ghost flex-shrink-0 p-3 rounded-lg"
            class:justify-center={collapsed}
            onclick={() => collapsed = !collapsed}>
            {#if collapsed}
                <PanelLeftOpenIcon class="h-5 w-5 stroke-indigo-200" />
            {:else}
                <PanelLeftCloseIcon class="h-5 w-5 stroke-indigo-200" />
            {/if}
        </button>
    </div>
    <ul class="menu p-0 space-y-1 flex-grow flex flex-col gap-3 w-full px-1">
        <li class="rounded-lg">
            <a href="/" class="text-white font-semibold flex items-center p-3 hover:bg-indigo-800"
                class:gap-2={!collapsed}
                class:justify-center={collapsed}
                class:tooltip={collapsed} data-tip="Home"
                class:tooltip-right={collapsed}
                class:bg-indigo-800={currentPath === '/'}
                class:shadow-inner={currentPath === '/'}>
                <HouseHeartIcon class="h-5 w-5 flex-shrink-0" />
                <span class="sidebar-title overflow-hidden whitespace-nowrap" class:hidden={collapsed}>
                    Home
                </span>
            </a>
        </li>
        <li class="rounded-lg">
            <a href="/recipes" class="text-white font-semibold flex items-center p-3 hover:bg-indigo-800"
                class:gap-2={!collapsed}
                class:justify-center={collapsed}
                class:tooltip={collapsed} data-tip="Recipes"
                class:tooltip-right={collapsed}
                class:bg-indigo-800={currentPath === '/recipes'}
                class:shadow-inner={currentPath === '/recipes'}>
                <ChefHatIcon class="h-5 w-5 flex-shrink-0" />
                <span class="sidebar-title overflow-hidden whitespace-nowrap" class:hidden={collapsed}>
                    Recipes
                </span>
            </a>
        </li>
    </ul>
</div>
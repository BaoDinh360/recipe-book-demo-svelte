<script lang="ts">
	import { page } from "$app/state";
	import { UtensilsCrossedIcon } from "$lib/icons";

    let currentPath = $derived(page.url.pathname);
    
    const navItems = [
        { name: 'Browse Recipes', url: '#' },
        { name: 'My Recipes', url: '/recipes' },
        { name: 'Meal Planner', url: '#' }
    ]

</script>

<header class="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/95 backdrop-blur-sm">
    <div class="flex items-center justify-between px-6 py-4 max-w-[1280px] mx-auto w-full">
        <!-- App title + icon -->
        <div class="flex items-center gap-4 text-neutral">
            <div class="flex items-center justify-center text-primary">
                <UtensilsCrossedIcon class="size-8" />
            </div>
            <h2 class="text-xl text-base-content font-heading font-bold leading-tight tracking-tight">
                Recipe Manager
            </h2>
        </div>
        <div class="hidden md:flex flex-1 justify-end gap-8 items-center">
            <!-- menu section -->
            <nav class="flex items-center gap-6 font-heading">
                {#each navItems as item }
                    <a href="{item.url}" class="text-sm transition-colors"
                        class:font-medium={currentPath !== item.url}
                        class:hover:text-primary={currentPath !== item.url}
                        class:font-bold={currentPath === item.url}
                        class:text-primary={currentPath === item.url}>
                        {item.name}
                    </a>
                {/each}
            </nav>
            <div class="flex items-center gap-4 pl-4 border-l border-base-300">
                <button class="relative group" aria-label="view user info">
                    <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-transparent group-hover:ring-primary transition-all"
                        data-alt="User profile avatar showing a smiling person"
                        style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVOJBXDLmJId5AXGVdGmEOuv-czVbwXkJW8XHxZeb2aP8xtbqq43sf0Vdi-i26EbMft3VJsxnu25xxr-n5Eo0GdRPBIWbNT4llij40Y2pGSd_A7Xbde5wANVO2kqMACf6go5rELwoyQTyDEkZ2NKFl_kyDIijqLiazcAEFvcZqtqjoOWloffS6V_I4QqtxcxjEFl454NOvBpF9UrV--txUSwN647U-y3vQaoM4i9VjQCLIRGldFrPbAMwE9b7Mu_9PkAnkDOtowyI");'>
                    </div>
                </button>
            </div>
        </div>
        <!-- collapsible menu do later-->
        <div class="md:hidden text-neutral">
            <span class="material-symbols-outlined">menu</span>
        </div>
    </div>
</header>

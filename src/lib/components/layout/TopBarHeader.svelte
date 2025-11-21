<script lang="ts">
	import { page } from "$app/state";
	import { MoveLeftIcon } from "$lib/icons";
	import { navigateToRecipes } from "$lib/utils/navigation";
	import { getPageTitleByRoute, isShowBackButton } from "$lib/utils/page-header";


    let pageTitle: string = $derived(getPageTitleByRoute(page.route.id));
    let showBackButton: boolean = $derived(isShowBackButton(page.route.id));

    let mainSection: string = $derived.by(() => {
        const parts = page.route.id?.split('/').filter(Boolean);
        if(parts && parts?.length >= 0) return '/' + parts[0];
        return '/';
    })

    const goBack = () => {
        if(mainSection === '/recipes') {
            navigateToRecipes();
        }
    }

</script>

<div class="flex items-center justify-between py-4 px-8 bg-white border-b border-gray-200">
    <!-- left side -->
    <div class="flex items-center gap-x-4">
        {#if showBackButton}
            <!-- don't show back btn on index page -->
            <button class="btn btn-ghost group hover:bg-indigo-500"
                aria-label="Back"
                onclick={goBack}>
                <!-- lucide icon -->
                <MoveLeftIcon class="h-6 w-6 stroke-indigo-700 group-hover:stroke-white"/>
            </button>
        {/if}
        <h1 class="font-bold text-gray-700 text-2xl">{pageTitle}</h1>
    </div>
</div>
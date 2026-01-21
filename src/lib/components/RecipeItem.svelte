<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import type { RecipeListItem } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import CategoryBadge from "./CategoryBadge.svelte";
	import ConfirmActionModal from "./shared/ConfirmActionModal.svelte";
    import { Clock4Icon, EyeIcon, SquarePenIcon, Trash2Icon } from '$lib/icons';

    let { recipe, 
    }: {
        recipe: RecipeListItem | undefined,
    } = $props();

    let deleteModalRef: ConfirmActionModal | undefined = $state();

    const confirmDeleteRecipe = async () => {
        if(!recipe) {
            // do nothing if undefined
            return;
        }
        let notiMessage = '';
        let recipeId = recipe.id;
        let recipeCode = recipe.recipeCode;
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            if(response.ok && result.success) {
                // back to index /recipes
                //navigateToRecipes();
                // invalidate page.server.ts tag to trigger reupdate
                await invalidate('app:recipes');
                // show success noti
                notiMessage = `Delete recipe: ${recipeCode} success!`;
                notifySuccess(notiMessage);
            } else {
                // failed
                notiMessage = result.message ?? `Failed to delete recipe: ${recipeCode}!`;
                notifyError(notiMessage);
            }
        } catch (err) {
            console.error('An exception occurs: ', err);
            notifyError('An unexpected error occurs!');
        }
    };

</script>

<!-- conditionally render ui if recipe has data to avoid race condition -->
{#if !recipe}
    <!-- fallback state (avoid race condition) -->
    <p>Recipe data is not available</p>
{:else}
    <!-- card recipe item -->
    <!-- <div class="card bg-white border border-gray-200 rounded-lg shadow-md">
        <div class="card-body p-6 flex flex-col">
            <h2 class="card-title text-lg font-semibold mb-4 leading-tight text-indigo-700">
                {recipe.title}
            </h2>
            <CategoryBadge category={recipe.category} />
            <p class="text-sm text-gray-600 mt-2 flex-grow">
                {recipe.description}
            </p>
            <div class="space-y-3 pt-2 border-t border-gray-100 pt-4">
                <div class="flex items-center justify-start text-sm gap-2">
                    <span class="p-2 font-medium bg-gray-100 rounded-md">
                        Recipe code: {recipe.recipeCode}
                    </span>
                </div>
                <div class="flex items-center justify-start text-sm gap-2">
                    <span class="text-gray-600 font-medium">Prep time:</span>
                    <span class="font-semibold text-indigo-700">{recipe.prepTimeMin} min</span>
                </div>
            </div>
            <div class="pt-4">
                <p class="text-xs text-gray-400 italic">
                    {recipe.createdAt.toLocaleDateString('vi-VN')}, 
                    {recipe.createdAt.toLocaleTimeString('vi-VN', {hour12: false})}
                </p>
            </div>
            <div class="card-actions flex justify-end pt-4 border-t border-gray-100">
                <button class="btn btn-sm btn-outline btn-info group lg:tooltip" data-tip="View recipe details"
                    onclick={() => goto(`/recipes/${recipe.id}`)}>
                    <EyeIcon class="h-4 w-4 group-hover:stroke-white"/>
                </button>
                <button class="btn btn-sm btn-outline btn-success group lg:tooltip" data-tip="Edit recipe"
                    onclick={() => goto(`/recipes/edit/${recipe.id}`)}>
                    <SquarePenIcon class="h-4 w-4 group-hover:stroke-white"/>
                </button>
                <button class="btn btn-sm btn-outline btn-error group lg:tooltip" data-tip="Delete recipe"
                    onclick={() => deleteModalRef!.showModal()}>
                    <Trash2Icon class="h-4 w-4 group-hover:stroke-white" />
                </button>
            </div>
        </div>
    </div> -->

    <!-- delete modal -->
    {#snippet deleteRecipeContent()}
        <p class="py-4 px-2 text-gray-600">
            Are you sure you want to permanently delete 
            <span class="font-semibold text-red-600">
                {recipe.recipeCode}: {recipe.title}
            </span>?
        </p>
    {/snippet}
    <ConfirmActionModal 
        bind:this={deleteModalRef}
        title='Delete Recipe'
        modalContent={deleteRecipeContent}
        actionLabel='Delete'
        modalStyle='ERROR'
        onConfirm={confirmDeleteRecipe}
        onCancel={() => {}} />

    <!-- update ui -20251227 -->
    <!-- <article
        class="group bg-light-cream rounded-xl shadow-sm hover:shadow-md border border-soft-stone overflow-hidden transition-all flex flex-col h-full">
        <div class="relative aspect-video overflow-hidden">
            <div class="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                data-alt="Close up of avocado toast with red chili flakes and poached egg"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbk9SsFLIRHYb9pzloxcyiZFl0xGf8KYQWMq73Z_TuPj1_tHgGwybHyfV3Lv-T3IU1zOLXy2xRBBuT9CGR7RVyWN8O09ELjVH4c_NivhmBVLVvg6f0Vdk17DFfXDp0idh9TZ8tzOUd5MRmUrl9vyc-8pivdwjRWxvp6xgV0_Ko6RN8fcqnJX7qIqlGs4ysR-9y8B8LPKmD81PNQ1wb_TZPy9RArMb7Tg7Bgms3HKjRg6acVEWlnj36sRBWptwyn84FiVHyQon2ltk");'>
            </div>
            <div class="absolute top-3 right-3">
                <span
                    class="px-2 py-1 rounded-md bg-white/90 text-xs font-bold text-deep-charcoal backdrop-blur-sm shadow-sm flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px] text-harvest-green">schedule</span> 15m
                </span>
            </div>
        </div>
        <div class="p-5 flex flex-col flex-1">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-harvest-green uppercase tracking-wider">Breakfast</span>
            </div>
            <h3
                class="text-xl font-heading font-bold text-deep-charcoal mb-2 line-clamp-1 group-hover:text-harvest-green transition-colors">
                Spicy Avocado Toast</h3>
            <p class="text-deep-charcoal/80 text-sm mb-4 line-clamp-2 flex-1">
                A quick and healthy breakfast option with a kick of chili flakes and a perfectly poached egg.
            </p>
            <div class="pt-4 mt-auto border-t border-soft-stone flex gap-2">
                <button
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-harvest-green hover:bg-[#439c47] text-white text-sm font-semibold transition-colors">
                    <span class="material-symbols-outlined text-[18px]">edit</span> Edit
                </button>
                <button
                    class="flex items-center justify-center px-3 py-2 rounded-lg bg-white border border-soft-stone hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-deep-charcoal transition-colors"
                    title="Delete Recipe">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>
        </div>
    </article> -->

    <div class="card group bg-base-200/50 rounded-xl shadow-sm hover:shadow-md border border-base-300 
        overflow-hidden transition-all flex flex-col h-full">
        <!-- img -->
        <div class="relative aspect-video overflow-hidden">
            <div class="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                data-alt="Close up of avocado toast with red chili flakes and poached egg"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbk9SsFLIRHYb9pzloxcyiZFl0xGf8KYQWMq73Z_TuPj1_tHgGwybHyfV3Lv-T3IU1zOLXy2xRBBuT9CGR7RVyWN8O09ELjVH4c_NivhmBVLVvg6f0Vdk17DFfXDp0idh9TZ8tzOUd5MRmUrl9vyc-8pivdwjRWxvp6xgV0_Ko6RN8fcqnJX7qIqlGs4ysR-9y8B8LPKmD81PNQ1wb_TZPy9RArMb7Tg7Bgms3HKjRg6acVEWlnj36sRBWptwyn84FiVHyQon2ltk");'>
            </div>
            <!-- prep time  -->
            <div class="absolute top-3 right-3">
                <span class="px-2 py-1 rounded-md bg-base-100/90 text-xs font-bold text-neutral backdrop-blur-sm shadow-sm flex items-center gap-1">
                    <Clock4Icon class="size-3 stroke-primary" strokeWidth="3" />
                    {recipe.prepTimeMin}m
                </span>
            </div>
        </div>
        <div class="card-body p-5 flex flex-col flex-1">
            <div class="flex justify-between items-start">
                <!-- category badge -->
                <CategoryBadge category={recipe.category} />
            </div>
            <!-- title -->
            <h2 class="card-title text-base font-heading font-bold text-neutral mb-2 line-clamp-1 
                group-hover:text-primary transition-colors">
                {recipe.title}
            </h2>
            <!-- description -->
            <p class="text-neutral/80 text-sm mb-4 line-clamp-2 flex-1">
                {recipe.description}
            </p>
            <div class="card-actions pt-4 mt-auto border-t border-soft-stone flex gap-2">
                <button class="px-3 py-2 flex-1 flex items-center justify-center gap-2
                    rounded-lg bg-primary hover:bg-[#439c47] text-neutral-content text-sm font-semibold transition-colors"
                    onclick={() => goto(`/recipes/edit/${recipe.id}`)}>
                    <SquarePenIcon class="size-4"/>
                    Edit
                </button>
                <button class="flex items-center justify-center px-3 py-2 rounded-lg bg-base-100
                    border border-info/60 hover:bg-info/90 hover:border-info hover:text-neutral-content text-info transition-colors"
                    title="View Recipe Details"
                    onclick={() => goto(`/recipes/${recipe.id}`)}>
                    <EyeIcon class="size-5" />
                </button>
                <!-- <button class="flex items-center justify-center px-3 py-2 rounded-lg bg-base-100
                    border border-error/60 hover:bg-error/90 hover:border-error hover:text-neutral-content text-error transition-colors"
                    title="Delete Recipe"
                    onclick={() => deleteModalRef!.showModal()}>
                    <Trash2Icon class="size-5" />
                </button> -->
                <button class="flex items-center justify-center px-3 py-2 rounded-lg bg-base-100
                    border border-error/60 hover:bg-error/90 hover:border-error hover:text-neutral-content text-error transition-colors"
                    title="Delete Recipe"
                    onclick={() => deleteModalRef!.showModal()}>
                    <Trash2Icon class="size-5" />
                </button>
            </div>
        </div>
    </div>
{/if}

<style>

</style>
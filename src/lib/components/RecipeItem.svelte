<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import type { RecipeListItem } from "$lib/recipe-types";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import CategoryBadge from "./CategoryBadge.svelte";
	import ConfirmActionModal from "./shared/ConfirmActionModal.svelte";
    import { EyeIcon, SquarePenIcon, Trash2Icon } from '$lib/icons';

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
    <div class="card bg-white border border-gray-200 rounded-lg shadow-md">
        <div class="card-body p-6 flex flex-col">
            <!-- title -->
            <h2 class="card-title text-lg font-semibold mb-4 leading-tight text-indigo-700">
                {recipe.title}
            </h2>
            <!-- category badge -->
            <CategoryBadge category={recipe.category} />
            <p class="text-sm text-gray-600 mt-2 flex-grow">
                {recipe.description}
            </p>
            <!-- metadata -->
            <div class="space-y-3 pt-2 border-t border-gray-100 pt-4">
                <!-- recipe code -->
                <div class="flex items-center justify-start text-sm gap-2">
                    <span class="p-2 font-medium bg-gray-100 rounded-md">
                        Recipe code: {recipe.recipeCode}
                    </span>
                </div>
                <!-- prep time -->
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
            <!-- card footer action -->
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
    </div>

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
{/if}

<style>

</style>
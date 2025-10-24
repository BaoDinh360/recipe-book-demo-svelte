<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import type { RecipeListItem } from "$lib/recipe-types";
	import { deleteRecipe } from "$lib/utils/recipe-service";
	import ConfirmActionModal from "./ConfirmActionModal.svelte";

    let { recipe, 
    }: {
        recipe: RecipeListItem,
    } = $props();

    let deleteModalRef: ConfirmActionModal;

    const confirmDeleteRecipe = async () => {
        try {
            await deleteRecipe(recipe.id);
            // trigger page.ts re run load func
            invalidate('app:recipes');
        } catch (error) {
            console.error('Error deleting recipe: ', recipe.id);   
        }
    };

</script>

<!-- card recipe item -->
<div class="card bg-white border border-gray-200 rounded-lg">
    <div class="card-body p-6 flex flex-col">
        <!-- title -->
        <h2 class="card-title text-lg font-semibold mb-2 leading-tight">
            {recipe.title}
        </h2>
        <!-- category badge -->
        <span class="mb-4 p-4 badge badge-lg bg-yellow-100 text-yellow-800 font-semibold">
            {recipe.category}
        </span>
        <p class="text-sm text-gray-500 mt-2 flex-grow">
            {recipe.description}
        </p>
        <!-- metadata -->
        <div class="space-y-3 pt-2 border-t border-gray-100">
            <!-- recipe code -->
            <div class="flex items-center justify-start text-sm gap-2">
                <span class="p-2 font-medium bg-gray-100">Recipe code: {recipe.recipeCode}</span>
            </div>
            <!-- prep time -->
            <div class="flex items-center justify-start text-sm gap-2">
                <span class="text-gray-600 font-medium">Prep time:</span>
                <span class="font-semibold text-indigo-700">{recipe.prepTimeMin} min</span>
            </div>
        </div>
        <div class="pt-4">
            <p class="text-xs text-gray-400">
                {recipe.createdAt.toLocaleString()}
            </p>
        </div>
        <!-- card footer action -->
        <div class="card-actions flex justify-end pt-4 border-t border-gray-100">
            <button class="btn btn-sm btn-outline btn-info"
                onclick={() => goto(`/recipes/${recipe.id}`)}>
                View
            </button>
            <button class="btn btn-sm btn-outline btn-success"
                onclick={() => goto(`/recipes/edit/${recipe.id}`)}>
                Edit
            </button>
            <button class="btn btn-sm btn-outline btn-error"
                onclick={() => deleteModalRef.showModal()}>
                Delete
            </button>
        </div>
    </div>
</div>

<!-- delete modal -->
<ConfirmActionModal 
    bind:this={deleteModalRef}
    title='Confirm Recipe Deletion'
    message={`Are you sure you want to permanently delete ${recipe.recipeCode}: ${recipe.title}?`}
    actionLabel='Delete'
    modalStyle='ERROR'
    onConfirm={confirmDeleteRecipe}
    onCancel={() => {}} />

<!-- <dialog class="modal" id={recipe.id + '_modal_delete'} bind:this={deleteModalRef}>
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="p-2 mb-4">
            <h3 class="font-bold text-2xl text-red-500 mb-4">
                Delete recipe
            </h3>
            <p class="py-2 text-gray-600">
                Are you sure you want to delete this recipe:
            </p>
            <p class="font-medium">
                {recipe.recipeCode}: <span class="text-indigo-600">{recipe.title}</span>
            </p>
        </div>
        <div class="modal-action p-2 pt-4">
            <div class="w-full flex flex-row justify-end gap-2.5">
                <button class="btn btn-error"
                    >Delete</button>
                <form method="dialog">
                    <button class="btn btn-outline">Close</button>
                </form> 
            </div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog> -->

<style>

</style>
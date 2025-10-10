<script lang="ts">
	import type { Recipe } from "$lib/types.svelte";

    let viewActiveTab = $state('instructions');

    let { recipe, onEdit, onDelete }: {
        recipe: Recipe,
        onEdit: (recipeId: string) => void,
        onDelete: (recipeId: string) => void
    } = $props();

    let viewModalRef : HTMLDialogElement;
    let deleteModalRef: HTMLDialogElement;

    const openModal = () => {
        viewModalRef.showModal();
    }
    const openDeleteModal = () => {
        deleteModalRef.showModal();
    }

    const onClickDeleteBtn = (recipeId: string) => {
        onDelete(recipeId);
        deleteModalRef.close();
    }

</script>

<!-- card recipe item -->
<div class="card shadow-md border border-indigo-100">
    <div class="card-body p-6 space-y-3">
        <div>
            <h4 class="card-title text-xl text-indigo-700 font-medium">
                {recipe.title}
            </h4>
            <!-- metadata -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm text-gray-500">
                <!-- prep time -->
                <span class="text-base">
                    Prep time: 
                    <span class="font-medium text-indigo-600 text-base">{recipe.prepTimeMin} Min</span>
                </span>
                &bullet;
                <!-- category -->
                <span class="font-medium text-indigo-600 text-base">{recipe.category}</span>
                &bullet;
                <span class="italic text-sm text-gray-400">Created: {recipe.dateCreated.toLocaleDateString()}</span>
            </div>
        </div>
        <div class="card-actions justify-end pt-3 border-t border-gray-100">
            <button class="btn btn-sm btn-outline btn-info"
                onclick={openModal}>
                View
            </button>
            <button class="btn btn-sm btn-outline btn-success"
                onclick={() => onEdit(recipe.id)}>
                Edit
            </button>
            <button class="btn btn-sm btn-outline btn-error"
                onclick={openDeleteModal}>
                Delete
            </button>
        </div>
    </div>
</div>

<!-- detail modal dialog -->
<dialog class="modal" id={recipe.id + '_modal'} bind:this={viewModalRef}>
    <div class="modal-box p-0 w-11/12 max-w-2xl max-h-11/12">
        <!-- close X -->
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <!-- fixed section -->
        <div class="p-6">
            <h3 class="font-bold text-2xl text-indigo-700">
                {recipe.title}
            </h3>
            <p class="text-sm mt-2">
                Prep time: <span class="font-medium text-indigo-600">{recipe.prepTimeMin} min</span> |
                Category: <span class="font-medium text-indigo-600">{recipe.category}</span> |
                Created: <span class="text-sm mt-2 text-gray-400">{recipe.dateCreated.toLocaleString()}</span>
            </p>
            <!-- <p class="text-sm mt-2 text-gray-500">Date created: {recipe.dateCreated.toLocaleString()}</p> -->
        </div>
        <!-- tab container -->
        <div role="tablist" class="tabs tabs-lifted px-2">
            <!-- tab 1 instructions -->
            {@render instructionsTab(recipe.instructions)}
            <!-- tab 2 descriptions -->
            {@render descriptionTab(recipe.description)}
        </div>
        <!-- Close Button (Bottom) fixed -->
        <div class="modal-action p-4 mt-0">
            <form method="dialog" class="w-full flex justify-end">
                <button class="btn btn-outline">Close</button>
            </form>
        </div>
    </div>
    <!-- This outer form allows closing the modal by clicking outside the box -->
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<!-- confirm delete modal -->
<dialog class="modal" id={recipe.id + '_modal_delete'} bind:this={deleteModalRef}>
    <div class="modal-box">
        <!-- close X -->
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="p-2 mb-4">
            <h3 class="font-bold text-2xl text-red-500 mb-4">
                Delete recipe
            </h3>
            <p class="py-2 text-gray-600">
                Are you sure you want to delete recipe:
            </p>
            <p class="font-medium text-indigo-500">
                {recipe.id} - {recipe.title}
            </p>
        </div>
        <div class="modal-action p-2 pt-4">
            <div class="w-full flex flex-row justify-end gap-2.5">
                <button class="btn btn-error"
                    onclick={() => onClickDeleteBtn(recipe.id)}>Delete</button>
                <!-- close modal -->
                <form method="dialog">
                    <button class="btn btn-outline">Close</button>
                </form> 
            </div>
        </div>
    </div>
    <!-- This outer form allows closing the modal by clicking outside the box -->
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<!-- SNIPPETS SECTION -->
{#snippet descriptionTab(description: string | undefined)}
    <!-- <input type="radio" name="recipe_tabs" role="tab" class="tab"
        aria-label="Descriptions" /> -->
    <button role="tab" class="tab" class:tab-active={viewActiveTab === 'descriptions'}
        onclick={() => viewActiveTab = 'descriptions'}>
        Descriptions
    </button>
    <div role="tabpanel" class="tab-content rounded-box p-0 w-full">
        <!-- scroll wrapper zone -->
        <div class="p-4 h-72 overflow-y-auto">
            {#if description === undefined || description === ''}
                <p class="mt-2 mb-2 text-gray-600">No description</p>
            {:else}
                <h4 class="font-semibold text-lg mt-2 mb-1 text-indigo-400">
                    Description:
                </h4>
                <p class="mb-4 text-gray-600">
                    {description}
                </p>
            {/if}
        </div>
    </div>
{/snippet}
{#snippet instructionsTab(instructions: string[])}
    <!-- <input type="radio" name="recipe_tabs" role="tab" class="tab"
        aria-label="Instructions" /> -->
    <button role="tab" class="tab" class:tab-active={viewActiveTab === 'instructions'}
        onclick={() => viewActiveTab = 'instructions'}>
        Instructions
    </button>
    <div role="tabpanel" class="tab-content p-0 w-full">
        <!-- scroll wrapper zone -->
        <div class="p-4 h-72 overflow-y-auto">
            {#if instructions.length <= 0}
                <p class="mt-2 mb-2 text-gray-600">No instructions</p>
            {:else}
                <h4 class="font-semibold text-lg mt-2 mb-1 text-indigo-400">Instructions:</h4>
                <ol class="list-decimal list-inside space-y-1 pl-4 text-gray-700">
                    {#each instructions as instruction}
                        <li>{instruction}</li>
                    {/each}
                </ol>
            {/if}
        </div>
    </div>
{/snippet}

<style>

</style>
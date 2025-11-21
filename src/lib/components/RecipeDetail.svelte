<script lang="ts">
	import { goto } from "$app/navigation";
	import type { RecipeDetail, RecipeIngredients } from "$lib/recipe-types";
	import { notifySuccess, notifyError } from "$lib/stores/notification-stores";
	import CategoryBadge from "./CategoryBadge.svelte";
	import ConfirmActionModal from "./shared/ConfirmActionModal.svelte";
    import { CalendarIcon, ClipboardIcon, Clock4Icon, DownloadIcon, InfoIcon, ListChecksIcon, ListOrderedIcon, TagIcon } from '$lib/icons';
	import { navigateToRecipes } from "$lib/utils/navigation";

    let { recipeDetails }: {
        recipeDetails: RecipeDetail | undefined
    } = $props();

    let deleteModalRef: ConfirmActionModal | undefined = $state();

    const confirmDeleteRecipe = async () => {
        if(!recipeDetails) {
            // do nothing if undefined
            return;
        } 
        let notiMessage = '';
        let recipeId = recipeDetails.id;
        let recipeCode = recipeDetails.recipeCode;
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            if(response.ok && result.success) {
                // back to index /recipes
                navigateToRecipes();
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

{#if !recipeDetails}
    <!-- fallback state (avoid race condition) -->
    <p>Recipe data not available</p>
{:else}
    <div class="space-y-4">
        <!-- button groups -->
        <div class="flex justify-end items-center mb-6 space-x-3 mx-auto">
            <button class="btn btn-success btn-sm md:btn-md w-36 text-white"
                onclick={() => goto(`/recipes/edit/${recipeDetails.id}`)}>
                Edit
            </button>
            <button class="btn btn-sm md:btn-md w-36 text-white bg-red-500 hover:bg-red-600"
                onclick={() => deleteModalRef!.showModal()}>
                Delete
            </button>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <!-- main recipe content left col -->
            <div class="lg:col-span-3 space-y-4">
                <!-- header card section -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <!-- title -->
                    <h1 class="text-2xl font-bold text-indigo-700 mb-6 pb-2 border-b border-gray-100">
                        {recipeDetails.title}
                    </h1>
                    <!-- description -->
                    <p class="text-base text-gray-600">
                        {recipeDetails.description}
                    </p>
                </div>
                <!-- ingredient list card section -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                        <ListChecksIcon class="h-5 w-5 stroke-gray-700"/>
                        <h2 class="text-xl font-bold text-gray-700">
                            Ingredients
                        </h2>
                    </div>
                    <!-- list section -->
                    <div class="space-y-4 mx-2">
                        {#if (!recipeDetails.ingredients || recipeDetails.ingredients.length <= 0)}
                            <p class="text-sm text-gray-400 pl-4 italic">No ingredients.</p>
                        {:else}
                            {#each recipeDetails.ingredients as item }
                                {@render displayIngredientRow(item)}
                            {/each}
                        {/if}
                    </div>
                </div>
                <!-- instructions card section -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                        <ListOrderedIcon class="h-5 w-5 stroke-gray-700"/>
                        <h2 class="text-xl font-bold text-gray-700">
                            Instructions
                        </h2>
                    </div>
                    <ol class="list-decimal pl-6 space-y-4">
                        {#each recipeDetails.instructions as instruction }
                            <li>
                                <h3 class="text-base text-gray-600 pl-2">{instruction}</h3>
                            </li>
                        {/each}
                    </ol>
                </div>
            </div>
            <!-- metadata (sticky on large screen) right col -->
            <div class="lg:col-span-2 space-y-4">
                <div class="lg:sticky lg:top-10 bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                    <div class="flex items-center gap-2 mb-6">
                        <InfoIcon class="h-5 w-5 stroke-gray-700" />
                        <h2 class="text-xl font-bold text-gray-700">Details</h2>
                    </div>
                    <div class="space-y-4">
                        <!-- recipe code -->
                        <div class="flex items-center justify-between p-3
                            bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                            <ClipboardIcon class="h-5 w-5 stroke-indigo-700" />
                                Recipe Code
                            </div>
                            <span class="font-semibold text-gray-800">
                                {recipeDetails.recipeCode}
                            </span>
                        </div>
                        <!-- category -->
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                                <TagIcon class="h-5 w-5 stroke-indigo-700" />
                                Category
                            </div>
                            <CategoryBadge category={recipeDetails.category} />
                            <!-- <span class="p-4 badge badge-lg bg-yellow-100 text-yellow-800 font-bold">
                                {recipeDetails.category}
                            </span> -->
                        </div>
                        <!-- prepTimeMin -->
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                                <Clock4Icon class="h-5 w-5 stroke-indigo-700" />
                                Prep Time
                            </div>
                            <span class="font-bold text-indigo-700">
                                {recipeDetails.prepTimeMin} Min
                            </span>
                        </div>
                        <!-- createdAt -->
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                                <CalendarIcon class="h-5 w-5 stroke-indigo-700" />
                                Created
                            </div>
                            <span class="text-gray-600 font-normal text-xs italic">
                                {recipeDetails.createdAt.toLocaleDateString('vi-VN')}, 
                                {recipeDetails.createdAt.toLocaleTimeString('vi-VN', {hour12: false})}
                            </span>
                        </div>
                        <!-- lastUpdatedAt -->
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                                <DownloadIcon class="h-5 w-5 stroke-indigo-700" />
                                Last Updated
                            </div>
                            <span class="text-gray-600 font-normal text-xs italic">
                                {recipeDetails.lastUpdatedAt.toLocaleDateString('vi-VN')}, 
                                {recipeDetails.lastUpdatedAt.toLocaleTimeString('vi-VN', {hour12: false})}
                            </span>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>

    <!-- delete modal -->
    {#snippet deleteRecipeContent()}
        <p class="py-4 px-2 text-gray-600">
            Are you sure you want to permanently delete 
            <span class="font-semibold text-red-600">
                {recipeDetails.recipeCode}: {recipeDetails.title}
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

{#snippet displayIngredientRow(item: RecipeIngredients)}
    <div class="grid grid-cols-[3.5fr_0.5fr_1fr] gap-4 border-b border-gray-150 pb-3">
        <div class="flex items-center space-x-3">
            <input type="checkbox" class="checkbox checkbox-sm" aria-label="Check ingredients" />
            <span class="text-base font-semibold">{item.name}</span>
        </div>
        <span class="text-center font-bold">{item.qty}</span>
        <span class="text-left">{item.unit}</span>
    </div>
{/snippet}

<style>

</style>
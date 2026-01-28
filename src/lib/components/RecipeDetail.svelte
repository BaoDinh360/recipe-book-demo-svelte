<script lang="ts">
	import { goto } from "$app/navigation";
	import type { RecipeDetail, RecipeIngredients } from "$lib/recipe-types";
	import { notifySuccess, notifyError } from "$lib/stores/notification-stores";
	import CategoryBadge from "./CategoryBadge.svelte";
	import ConfirmActionModal from "./shared/ConfirmActionModal.svelte";
    import { CalendarIcon, ClipboardIcon, Clock4Icon, SquarePenIcon, Trash2Icon } from '$lib/icons';
	import { navigateToRecipes } from "$lib/utils/navigation";
	import RecipeInstructionStep from "./RecipeInstructionStep.svelte";

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
    <!-- <div class="space-y-4">
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
            <div class="lg:col-span-3 space-y-4">
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h1 class="text-2xl font-bold text-indigo-700 mb-6 pb-2 border-b border-gray-100">
                        {recipeDetails.title}
                    </h1>
                    <p class="text-base text-gray-600">
                        {recipeDetails.description}
                    </p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div class="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                        <ListChecksIcon class="h-5 w-5 stroke-gray-700"/>
                        <h2 class="text-xl font-bold text-gray-700">
                            Ingredients
                        </h2>
                    </div>
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
            <div class="lg:col-span-2 space-y-4">
                <div class="lg:sticky lg:top-10 bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
                    <div class="flex items-center gap-2 mb-6">
                        <InfoIcon class="h-5 w-5 stroke-gray-700" />
                        <h2 class="text-xl font-bold text-gray-700">Details</h2>
                    </div>
                    <div class="space-y-4">
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
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                                <TagIcon class="h-5 w-5 stroke-indigo-700" />
                                Category
                            </div>
                            <CategoryBadge category={recipeDetails.category} />
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                            <div class="flex items-center text-gray-700 gap-1">
                                <Clock4Icon class="h-5 w-5 stroke-indigo-700" />
                                Prep Time
                            </div>
                            <span class="font-bold text-indigo-700">
                                {recipeDetails.prepTimeMin} Min
                            </span>
                        </div>
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
    </div> -->

    <!-- BAODNQ 20260104 - fix ui -->
    <div class="w-full flex flex-col gap-8">
        <section class="flex flex-col gap-6">
            <div class="w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl relative group">
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10">
                </div>
                <div class="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105"
                    data-alt="Recipe img background"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYz4xesIV3WuzsvAqmjXzO76FyeR19rNb7D1gxGPJcth6RmZV1WX64dQtTD6SnzZ0-koX4mwurUFVjudPL9FNV89rRwvyxZVB8-W28Sy2DXbv2BGzlcVw07fxa0697CSgbiC-JXF1t7t-dQTCFA04HB0kEFPiBUsGTxkSSHU4ExDZOJZ7F5SCEd6PfUxseqJD24xGXBwOCWrGQvQTmAmbAHSFw25lzLxU_EFn_7ginBIS23C5ao9w8A7EKka4UyXMtQV08QPP_SeY");'>
                </div>
                <div class="absolute top-6 left-6 z-20">
                    <CategoryBadge class="text-sm font-bold uppercase tracking-wider shadow-lg"
                        category={recipeDetails.category} />
                </div>
            </div>
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                <div class="flex flex-col gap-3 flex-1">
                    <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral">
                        {recipeDetails.title}
                    </h1>
                    <div class="flex flex-wrap items-center gap-4 text-neutral text-sm font-medium">
                        <div class="flex items-center gap-1.5 bg-base-200 px-3 py-1.5 rounded-full border border-base-300">
                            <Clock4Icon class="size-4 text-primary" />
                            <span>{recipeDetails.prepTimeMin} min</span>
                        </div>
                        <div class="flex items-center gap-1.5 font-semibold bg-base-200 px-3 py-1.5 rounded-full border border-base-300">
                            <ClipboardIcon class="size-4 text-primary" />
                            <span>{recipeDetails.recipeCode}</span>
                        </div>
                        <div class="flex items-center gap-1.5 font-light italic bg-base-200 px-3 py-1.5 text-base-content/60 rounded-full border border-base-300">
                            <CalendarIcon class="size-4 text-primary" />
                            <span>
                                {recipeDetails.createdAt.toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button class="btn btn-sm md:btn-md btn-primary w-36 gap-2 rounded-full text-primary-content text-sm font-bold transition-all hover:scale-105 shadow-sm"
                        onclick={() => goto(`/recipes/edit/${recipeDetails.id}`)}>
                        <SquarePenIcon class="size-4 text-primary-content" strokeWidth="3" />
                        Edit
                    </button>
                    <button class="btn btn-sm md:btn-md btn-error w-36 gap-2 rounded-full text-primary-content text-sm font-bold transition-all 
                        hover:scale-105 shadow-sm"
                        onclick={() => deleteModalRef!.showModal()}>
                        <Trash2Icon class="size-4 text-primary-content" strokeWidth="3" />
                        Delete
                    </button>
                </div>
            </div>
        </section>
        <div class="px-2 max-w-3xl">
            <p class="text-lg text-base-content/80 leading-relaxed font-body">
                {recipeDetails.description}
            </p>
        </div>
        <hr class="border-base-300" />
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div class="lg:col-span-4 flex flex-col gap-6">
                <div class="sticky top-24">
                    <div class="bg-base-200 rounded-3xl p-6 shadow-sm border border-base-300">
                        <div class="flex flex-row items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold font-display tracking-tight text-base-content">
                                Ingredients
                            </h2>
                            <span class="text-xs font-bold font-display uppercase tracking-wider text-base-content/50">
                                {recipeDetails.ingredients?.length ?? 0} Items
                            </span>
                        </div>
                        <ul class="flex flex-col gap-3">
                            {#if (!recipeDetails.ingredients || recipeDetails.ingredients.length <= 0)}
                                <p class="text-sm text-base-content/40 text-center font-light italic">
                                    This recipe has no ingredients.
                                </p>
                            {:else}
                                {#each recipeDetails.ingredients as item }
                                    {@render displayIngredientRow(item)}
                                {/each}
                            {/if}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="lg:col-span-8 flex flex-col gap-10">
                <div>
                    <h2 class="text-2xl font-bold font-display tracking-tight mb-6 px-2 text-base-content">
                        Instructions
                    </h2>
                    {#if !recipeDetails.instructions || recipeDetails.instructions.length <= 0}
                        <p class="text-base text-base-content/60 text-left px-2 font-light italic">
                            This recipe has no instructions.
                        </p>
                    {:else}
                        <ul class="steps steps-vertical w-full px-2">
                            {#each recipeDetails.instructions as item, index }
                                <RecipeInstructionStep
                                    step={index + 1}>
                                    {#snippet stepContent()}
                                        <h3 class="text-lg font-bold font-display text-base-content mb-2">
                                            Step {index + 1}:
                                        </h3>
                                        <p class="text-base-content/80 leading-relaxed font-body">
                                            {item}
                                        </p>
                                    {/snippet}
                                </RecipeInstructionStep>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- delete modal -->
    {#snippet deleteRecipeContent()}
        Are you sure you want to permanently delete recipe 
        <span class="font-semibold text-error">
            {recipeDetails.recipeCode}: {recipeDetails.title}
        </span> ?
    {/snippet}
    <ConfirmActionModal 
        bind:this={deleteModalRef}
        title='Delete Recipe'
        modalContent={deleteRecipeContent}
        actionLabel='Delete'
        modalStyle='error'
        onConfirm={confirmDeleteRecipe}
        onCancel={() => {}} />
{/if}

{#snippet displayIngredientRow(item: RecipeIngredients)}
    <!-- <div class="grid grid-cols-[3.5fr_0.5fr_1fr] gap-4 border-b border-gray-150 pb-3">
        <div class="flex items-center space-x-3">
            <input type="checkbox" class="checkbox checkbox-sm" aria-label="Check ingredients" />
            <span class="text-base font-semibold">{item.name}</span>
        </div>
        <span class="text-center font-bold">{item.qty}</span>
        <span class="text-left">{item.unit}</span>
    </div> -->
    <li class="group flex items-start gap-3 p-2 rounded-3xl hover:bg-base-100 transition-colors cursor-pointer">
        <div class="relative flex items-center pt-0.5">
            <input class="checkbox checkbox-primary h-5 w-5 rounded-full border-base-300 cursor-pointer"
                type="checkbox" />
        </div>
        <div class="flex flex-col text-sm gap-1">
            <span
                class="font-bold text-base-content group-hover:text-primary transition-colors">
                {item.qty} {item.unit}
            </span>
            <span class="text-base-content/70">
                {item.name}
            </span>
        </div>
    </li>
{/snippet}



<style>
</style>
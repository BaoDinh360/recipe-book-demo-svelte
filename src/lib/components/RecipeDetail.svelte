<script lang="ts">
	import { goto } from "$app/navigation";
	import { notifySuccess, notifyError } from "$lib/stores/notification-stores";
	import CategoryBadge from "./CategoryBadge.svelte";
	import ConfirmActionModal from "./shared/ConfirmActionModal.svelte";
    import { CalendarIcon, Clock4Icon, SquarePenIcon, Trash2Icon } from '$lib/icons';
	import { navigateToRecipes } from "$lib/utils/navigation";
	import RecipeInstructionStep from "./RecipeInstructionStep.svelte";
	import type { RecipeDetailItem, RecipeIngredientDetail } from "$lib/types/recipe-types";

    let { recipeDetails }: {
        recipeDetails: RecipeDetailItem | undefined
    } = $props();

    let deleteModalRef: ConfirmActionModal | undefined = $state();

    const confirmDeleteRecipe = async () => {
        if(!recipeDetails) {
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
    <p>Recipe data not available</p>
{:else}
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
                            <span>{recipeDetails.recipeCode}</span>
                        </div>
                        <div class="flex items-center gap-1.5 font-light italic bg-base-200 px-3 py-1.5 text-base-content/60 rounded-full border border-base-300">
                            <CalendarIcon class="size-4 text-primary" />
                            <span>
                                {recipeDetails.created.toLocaleDateString('vi-VN')}
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

{#snippet displayIngredientRow(item: RecipeIngredientDetail)}
    <li class="group flex items-start gap-3 p-2 rounded-3xl hover:bg-base-100 transition-colors cursor-pointer">
        <div class="relative flex items-center pt-0.5">
            <input class="checkbox checkbox-primary h-5 w-5 rounded-full border-base-300 cursor-pointer"
                type="checkbox" />
        </div>
        <div class="flex flex-col text-sm gap-1">
            <span
                class="font-bold text-base-content group-hover:text-primary transition-colors">
                {item.quantity} {item.unit}
            </span>
            <span class="text-base-content/70">
                {item.name}
            </span>
        </div>
    </li>
{/snippet}


<style></style>
<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { notifyError, notifySuccess } from "$lib/stores/notification-stores";
	import CategoryBadge from "./CategoryBadge.svelte";
	import ConfirmActionModal from "./shared/ConfirmActionModal.svelte";
    import { Clock4Icon, EyeIcon, SquarePenIcon, Trash2Icon } from '$lib/icons';
	import type { RecipeListItem } from "$lib/types/recipe-types";

    let { recipe, 
    }: {
        recipe: RecipeListItem | undefined,
    } = $props();

    let deleteModalRef: ConfirmActionModal | undefined = $state();

    const confirmDeleteRecipe = async () => {
        if(!recipe) {
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


{#if !recipe}
    <p>Recipe data is not available</p>
{:else}
    <!-- delete modal -->
    {#snippet deleteRecipeContent()}
        Are you sure you want to permanently delete recipe
        <span class="font-semibold text-error">
            {recipe.recipeCode}: {recipe.title}
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

    <div class="card group bg-base-200/50 rounded-xl shadow-sm hover:shadow-md border border-base-300 
        overflow-hidden transition-all flex flex-col h-full">
        <!-- img -->
        <div class="relative aspect-video overflow-hidden">
            <div class="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                data-alt="Close up of avocado toast with red chili flakes and poached egg"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbk9SsFLIRHYb9pzloxcyiZFl0xGf8KYQWMq73Z_TuPj1_tHgGwybHyfV3Lv-T3IU1zOLXy2xRBBuT9CGR7RVyWN8O09ELjVH4c_NivhmBVLVvg6f0Vdk17DFfXDp0idh9TZ8tzOUd5MRmUrl9vyc-8pivdwjRWxvp6xgV0_Ko6RN8fcqnJX7qIqlGs4ysR-9y8B8LPKmD81PNQ1wb_TZPy9RArMb7Tg7Bgms3HKjRg6acVEWlnj36sRBWptwyn84FiVHyQon2ltk");'>
            </div>
            <!-- recipe code  -->
            <div class="absolute top-3 left-3">
                <span class="px-2 py-1 rounded-md bg-base-100/90 text-xs font-bold text-neutral backdrop-blur-sm shadow-sm flex items-center gap-1">
                    {recipe.recipeCode}
                </span>
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

<style></style>
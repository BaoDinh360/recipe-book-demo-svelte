<script lang="ts">
	import { goto } from "$app/navigation";
	import type { RecipeDetail } from "$lib/recipe-types";
	import { deleteRecipe } from "$lib/utils/recipe-service";
	import ConfirmActionModal from "./ConfirmActionModal.svelte";


    let { recipeDetails }: {
        recipeDetails: RecipeDetail
    } = $props();

    let deleteModalRef: ConfirmActionModal;

    const confirmDeleteRecipe = async () => {
        try {
            await deleteRecipe(recipeDetails.id);
            // back to index 
            goto('/recipes')
        } catch (error) {
            console.error('Error deleting recipe: ', recipeDetails.id);
        }
    };

</script>


<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <!-- main recipe content left col -->
    <div class="lg:col-span-3">
        <!-- header -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <!-- title -->
            <h1 class="text-2xl font-bold text-indigo-700 mb-6">
                {recipeDetails.title}
            </h1>
            <!-- description -->
            <p class="text-base text-gray-600">
                {recipeDetails.description}
            </p>
        </div>
        <!-- instructions -->
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 class="text-xl font-bold text-indigo-700 mb-6 pb-2 border-b border-gray-100">
                Instructions
            </h2>
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
    <div class="lg:col-span-2">
        <div class="lg:sticky lg:top-10 bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
            <h2 class="text-xl font-bold text-indigo-700 mb-4">Details</h2>
            <div class="space-y-4">
                <!-- recipe code -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700">
                        <!-- add icon -->
                        Recipe Code
                    </div>
                    <span class="font-semibold text-gray-800">
                        {recipeDetails.recipeCode}
                    </span>
                </div>
                <!-- category -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700">
                        <!-- add icon -->
                        Category
                    </div>
                    <span class="p-4 badge badge-lg bg-yellow-100 text-yellow-800 font-bold">
                        {recipeDetails.category}
                    </span>
                </div>
                <!-- prepTimeMin -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700">
                        <!-- add icon -->
                        Prep Time
                    </div>
                    <span class="font-bold text-indigo-700">
                        {recipeDetails.prepTimeMin} Min
                    </span>
                </div>
                <!-- createdAt -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700">
                        <!-- add icon -->
                        Created
                    </div>
                    <span class="text-gray-600 font-normal text-xs italic">
                        {recipeDetails.createdAt.toLocaleDateString('vi-VN')}, 
                        {recipeDetails.createdAt.toLocaleTimeString('vi-VN', {hour12: false})}
                    </span>
                </div>
                <!-- lastUpdatedAt -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700">
                        <!-- add icon -->
                        Last Updated
                    </div>
                    <span class="text-gray-600 font-normal text-xs italic">
                        {recipeDetails.lastUpdatedAt.toLocaleDateString('vi-VN')}, 
                        {recipeDetails.lastUpdatedAt.toLocaleTimeString('vi-VN', {hour12: false})}
                    </span>
                </div>
            </div>
        </div>
        <!-- button groups -->
        <div class="flex items-center mt-6 mb-6 space-x-3">
            <button class="btn btn-outline btn-success flex-1"
                onclick={() => goto(`/recipes/edit/${recipeDetails.id}`)}>
                Edit
            </button>
            <button class="btn btn-outline btn-error flex-1"
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
    message={`Are you sure you want to permanently delete ${recipeDetails.recipeCode}: ${recipeDetails.title}?`}
    actionLabel='Delete'
    modalStyle='ERROR'
    onConfirm={confirmDeleteRecipe}
    onCancel={() => {}} />

<style>

</style>
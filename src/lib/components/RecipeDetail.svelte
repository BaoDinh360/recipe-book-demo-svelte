<script lang="ts">
	import { goto } from "$app/navigation";
	import type { RecipeDetail } from "$lib/recipe-types";
	import { notifySuccess, notifyError } from "$lib/stores/notification-stores";
	import { deleteRecipe } from "$lib/utils/recipe-service";
	import ConfirmActionModal from "./ConfirmActionModal.svelte";


    let { recipeDetails }: {
        recipeDetails: RecipeDetail
    } = $props();

    let deleteModalRef: ConfirmActionModal;

    const confirmDeleteRecipe = async () => {
        let notiMessage = '';
        try {
            await deleteRecipe(recipeDetails.id);
            // back to index 
            goto('/recipes')

            notiMessage = `Delete recipe: ${recipeDetails.recipeCode} success!`;
            notifySuccess(notiMessage);
        } catch (error) {
            console.error('An exception occurs: ', error);
            notiMessage = `An error occurs when deleting recipe: ${recipeDetails.recipeCode}!`;
            notifyError(notiMessage);
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
                <div class="flex items-center justify-between p-3
                    bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700 gap-1">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195" stroke="#4f46e5" stroke-width="1.5"></path> <path d="M8 14H16" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 10.5H17" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"></path> <path d="M9 17.5H15" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="#4f46e5" stroke-width="1.5"></path> </g></svg>
                        Recipe Code
                    </div>
                    <span class="font-semibold text-gray-800">
                        {recipeDetails.recipeCode}
                    </span>
                </div>
                <!-- category -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700 gap-1">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 3L5 21" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19 3L14 21" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 9H4" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M20 16H2" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        Category
                    </div>
                    <span class="p-4 badge badge-lg bg-yellow-100 text-yellow-800 font-bold">
                        {recipeDetails.category}
                    </span>
                </div>
                <!-- prepTimeMin -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700 gap-1">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#4f46e5" stroke-width="1.5"></circle> <path d="M12 8V12L14.5 14.5" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        Prep Time
                    </div>
                    <span class="font-bold text-indigo-700">
                        {recipeDetails.prepTimeMin} Min
                    </span>
                </div>
                <!-- createdAt -->
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium">
                    <div class="flex items-center text-gray-700 gap-1">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="#4f46e5" stroke-width="1.5"></path> <path d="M7 4V2.5" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"></path> <path d="M17 4V2.5" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2.5 9H21.5" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
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
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="#4f46e5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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
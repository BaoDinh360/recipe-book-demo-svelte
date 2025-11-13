<script lang="ts">
	import type { RecipeFormErrors } from "$lib/types";
	import type { Snippet } from "svelte";

    let { formData = $bindable(), recipeCode, formErrors = $bindable(), errContent }: {
        formData: {
            title: string;
            description: string;
            instructions: string;
        },
        recipeCode: string | undefined,
        formErrors: RecipeFormErrors,
        errContent: Snippet<[string | undefined]>
    } = $props();

</script>

<!-- card section recipe info -->
<div class="w-full mx-auto p-6 rounded-lg shadow-md 
    bg-white border border-gray-200 space-y-4">
    <!-- recipe info header -->
    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
        Recipe Info 
        <!-- show recipe code in edit page -->
        {#if recipeCode}
            <span class="font-bold pl-4 text-indigo-700 text-base">
                {recipeCode}
            </span>
        {/if}
    </h3>
    <!-- title -->
    <div class="form-control w-full">
        <label class="label" for="title">
            <span class="label-text text-base text-gray-600 font-semibold input-required">
                Title
            </span>
        </label>
        <input class="input input-bordered w-full" class:input-error={formErrors.title} 
            type="text" id="title" bind:value={formData.title}
            onchange={() => formErrors.title = undefined}/>
         {@render errContent(formErrors.title)}
    </div>
    <!-- description -->
    <div class="form-control w-full">
        <label class="label" for="desc">
            <span class="label-text text-base text-gray-600 font-semibold">
                Description
            </span>
        </label>
        <textarea class="textarea textarea-bordered w-full" 
            id="desc" placeholder="Add a description" bind:value={formData.description}>
        </textarea>
    </div>
    <!-- instructions(separated by ',') -->
    <div class="form-control w-full">
        <label class="label" for="instruction">
            <span class="label-text text-base text-gray-600 font-semibold">
                Instructions, 1 per line
            </span>
        </label>
        <textarea class="textarea textarea-bordered w-full" rows="5"
            id="instruction" placeholder="Add instructions, 1 per line"
            bind:value={formData.instructions}></textarea>
    </div>
</div>

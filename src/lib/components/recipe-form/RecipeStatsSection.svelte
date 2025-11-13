<script lang="ts">
	import { categoryOptions } from "$lib/constants";
	import type { RecipeCategory } from "$lib/recipe-types";
	import type { RecipeFormErrors } from "$lib/types";
	import type { Snippet } from "svelte";


    let { formData = $bindable(), formErrors = $bindable(), errContent }: {
        formData: {
            category: RecipeCategory | string;
            prepTimeMin: number;
        },
        formErrors: RecipeFormErrors,
        errContent: Snippet<[string | undefined]>
    } = $props();

</script>

<div class="w-full mx-auto p-6 rounded-lg shadow-md 
    bg-white border border-gray-200 space-y-4">
    <!-- recipe stats header -->
    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
        Stats
    </h3>
    <div class="flex space-x-4">
        <!-- category -->
        <div class="form-control w-full">
            <label class="label" for="category">
                <span class="label-text text-base text-gray-600 font-semibold input-required">
                    Category
                </span>    
            </label>
            <select class="select select-bordered w-full" class:input-error={formErrors.category}
                id="category" bind:value={formData.category}
                onchange={() => formErrors.category = undefined}>
                <option disabled value={''}>Select category</option>
                {#each categoryOptions as option }
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
            {@render errContent(formErrors.category)}
        </div>
        <!-- prep time -->
        <div class="form-control w-full">
            <label class="label" for="prepTime">
                <span class="label-text text-base text-gray-600 font-semibold input-required">
                    Prep time (min)
                </span>
            </label>
            <input class="input input-bordered w-full" 
                class:input-error={formErrors.prepTimeMin} 
                type="number" id="prepTime" 
                bind:value={formData.prepTimeMin}
                onchange={() => formErrors.prepTimeMin = undefined}/>
            {@render errContent(formErrors.prepTimeMin)}
        </div>
    </div>
</div>
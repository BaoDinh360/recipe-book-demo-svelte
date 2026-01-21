<script lang="ts">
	import { categoryOptions } from "$lib/constants";
	import { Clock4Icon } from "$lib/icons";
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

<!-- <div class="w-full mx-auto p-6 rounded-lg shadow-md 
    bg-white border border-gray-200 space-y-4">
    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
        Stats
    </h3>
    <div class="flex space-x-4">
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
</div> -->

<!-- BAODNQ 20260111 - FIX UI -->
<div class="form-control w-full gap-1">
    <label class="label" for="category">
        <span class="label-text text-base text-neutral font-medium font-display input-required">
            Category
        </span>    
    </label>
    <select class="select select-bordered w-full bg-base-200 border border-base-300 rounded-2xl 
        text-base text-neutral font-normal focus:outline-none focus:ring-2 focus:ring-primary 
        focus:border-primary cursor-pointer transition-shadow" 
        class:input-error={formErrors.category}
        id="category" bind:value={formData.category}
        onchange={() => formErrors.category = undefined}>
        <option disabled value={''}>Select category</option>
        {#each categoryOptions as option }
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
    {@render errContent(formErrors.category)}
</div>
<div class="form-control w-full gap-1">
    <label class="label" for="prepTime">
        <span class="label-text text-base text-neutral font-medium font-display input-required">
            Prep time (min)
        </span>
    </label>
    <input class="input input-bordered w-full overflow-hidden rounded-2xl text-neutral leading-normal text-base
        border border-base-300 bg-base-200 placeholder:text-neutral/40 px-5 font-normal
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        placeholder="e.g:45" 
        class:input-error={formErrors.prepTimeMin} 
        type="number" id="prepTime" 
        bind:value={formData.prepTimeMin}
        onchange={() => formErrors.prepTimeMin = undefined}/>
    {@render errContent(formErrors.prepTimeMin)}
</div>
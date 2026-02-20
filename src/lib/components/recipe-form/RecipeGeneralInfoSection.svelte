<script lang="ts">
	import { categoryOptions } from "$lib/constants";
	import type { RecipeFormErrors } from "$lib/types";
	import type { RecipeGeneralInfoFormData } from "$lib/types/recipe-types";
	import type { Snippet } from "svelte";

    let { formData = $bindable(), formErrors = $bindable(), errContent }: {
        formData: RecipeGeneralInfoFormData,
        formErrors: RecipeFormErrors,
        errContent: Snippet<[string | undefined]>
    } = $props();

</script>

<!-- left col -->
<div class="md:col-span-8 flex flex-col gap-6">
    <div class="form-control w-full gap-1">
        <label class="label" for="title">
            <span class="label-text text-base text-neutral font-medium font-display input-required">
                Recipe Title
            </span>
        </label>
        <input class="input input-bordered w-full overflow-hidden rounded-2xl text-neutral leading-normal text-base
            border border-base-300 bg-base-200 placeholder:text-neutral/40 px-5 font-normal
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
            placeholder="e.g., Grandma's Lemon Tart" 
            class:input-error={formErrors.title} 
            type="text" id="title" 
            bind:value={formData.title}
            onchange={() => formErrors.title = undefined}/>
            {@render errContent(formErrors.title)}
    </div>
    <div class="form-control w-full gap-1">
        <label class="label" for="desc">
            <span class="label-text text-base text-neutral font-medium font-display">
                Description
            </span>
        </label>
        <textarea class="textarea textarea-bordered w-full resize-y min-h-[140px] rounded-2xl text-neutral 
            focus:outline-0 focus:ring-2 focus:ring-primary border border-base-300 bg-base-200 
            placeholder:text-neutral/40 p-5 text-base font-normal leading-normal transition-shadow" 
            id="desc" placeholder="Add a description ..." 
            bind:value={formData.description}>
        </textarea>
    </div>
</div>
<!-- right col -->
<div class="md:col-span-4 flex flex-col gap-6">
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
            id="category" 
            bind:value={formData.category}
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
</div>

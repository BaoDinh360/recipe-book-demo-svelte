<script lang="ts">
	import type { RecipeFormErrors } from "$lib/types";
	import type { Snippet } from "svelte";

    let { formData = $bindable(), recipeCode, formErrors = $bindable(), errContent }: {
        formData: {
            title: string;
            description: string;
            // instructions: string;
        },
        recipeCode: string | undefined,
        formErrors: RecipeFormErrors,
        errContent: Snippet<[string | undefined]>
    } = $props();

</script>

<!-- <div class="w-full mx-auto p-6 rounded-lg shadow-md 
    bg-white border border-gray-200 space-y-4">
    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
        Recipe Info 
        {#if recipeCode}
            <span class="font-bold pl-4 text-indigo-700 text-base">
                {recipeCode}
            </span>
        {/if}
    </h3>
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
</div> -->

<!-- BAODNQ 20260111 - FIX UI -->
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
        type="text" id="title" bind:value={formData.title}
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
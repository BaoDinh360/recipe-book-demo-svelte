<script lang="ts">
	import type { RecipeFormErrors } from "$lib/types";
	import type { Snippet } from "svelte";

    let { formData = $bindable(), formErrors = $bindable(), errContent }: {
        formData: {
            title: string;
            description: string;
        },
        formErrors: RecipeFormErrors,
        errContent: Snippet<[string | undefined]>
    } = $props();

</script>


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
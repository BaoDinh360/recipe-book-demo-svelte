<script lang="ts">
	import { categoryOptions } from "$lib/constants";
	import type { CreateRecipeData, RecipeFormSubmissionData, UpdateRecipeData } from "$lib/recipe-types";
	import { FormState, type RecipeCategory } from "$lib/types";
	import { onMount } from "svelte";

    let { recipeToEdit, onSubmit, onCancel }: {
        recipeToEdit?: UpdateRecipeData | undefined,
        onSubmit: (recipeData: RecipeFormSubmissionData) => Promise<void>,
        onCancel: () => void,
    } = $props();

    const defaultFormData = {
        id: undefined,
        recipeCode: undefined,
        title: '',
        description: '',
        instructions: '',
        prepTimeMin: 0,
        category: undefined
    };
    // if recipeToEdit obj is passed in, set formData input local state to recipeToEdit value
    // esle use the defaultFormData value
    // recipeToEdit: edit form mode, else add form mode
    // Add form mode won't have id, recipeCode
    let formData: {
        id: string | undefined,
        recipeCode: string | undefined,
        title: string,
        description: string,
        instructions: string,
        prepTimeMin: number,
        category: RecipeCategory | undefined, }
    = $state(recipeToEdit ? 
        {...recipeToEdit, instructions: recipeToEdit.instructions.join('\n')}: 
        {...defaultFormData}
    );
    // update formState mode based on recipeToEdit props
    let formState: FormState = $derived.by(() => {
        if(recipeToEdit) 
            return FormState.EDIT;
        return FormState.ADD;
    });

    onMount(() => {
        console.log('comp local state: ', $state.snapshot(formData));
        console.log('form state mode: ', $state.snapshot(formState));
    })

    const submitForm = (e: Event) => {
        e.preventDefault();
        console.log('recipe form data: ', $state.snapshot(formData));

        const recipeInputData = {
            title: formData.title,
            description: formData.description,
            instructions: formData.instructions
                .split('\n') // split into string[]
                .map(s => s.trim()) // foreach items, trim
                .filter(Boolean), // filter in only valid string, no empty string
            prepTimeMin: formData.prepTimeMin,
            category: formData.category!,
        }
        if(formState === FormState.EDIT && recipeToEdit) {
            // edit recipe
            const recipeData: UpdateRecipeData = {
                ...recipeInputData,
                id: recipeToEdit.id,
                recipeCode: recipeToEdit.recipeCode
            };
            onSubmit(recipeData);
        }
        else {
            // add recipe
            const recipeData: CreateRecipeData = {
                ...recipeInputData
            };
            onSubmit(recipeData);
        }
    }

    const onCancelForm = () => {
        // reset form input
        resetFormInput();
        // callback props
        onCancel();
    }

    const resetFormInput = () => {
        // reset input
        formData = {...defaultFormData};
    }

</script>

<div class="container mx-auto max-w-full">
    <form class="space-y-4"
        onsubmit={(e) => submitForm(e)}>
        <!-- form input cols layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- title -->
            <div class="md:col-span-2 form-control w-full">
                <label class="label" for="title">
                    <span class="label-text text-base text-indigo-700 font-medium">
                        Title
                    </span>
                </label>
                <input class="input input-bordered w-full" 
                    type="text" id="title" bind:value={formData.title}/>
            </div>
            <div class="form-control w-full">
                <!-- if edit, show recipe code readonly -->
                {#if formState === FormState.EDIT && recipeToEdit}
                    <label class="label" for="recipeCode">
                        <span class="label-text text-base text-indigo-700 font-medium">
                            Recipe code
                        </span>
                    </label>
                    <input class="input input-ghost w-full bg-gray-100
                        text-indigo-700 font-medium" 
                        readonly type="text" id="recipeCode" 
                        value={formData.recipeCode}/>
                {/if}
            </div>
            <!-- category -->
            <div class="form-control w-full">
                <label class="label" for="category">
                    <span class="label-text text-base text-indigo-700 font-medium">
                        Category
                    </span>    
                </label>
                <select class="select select-bordered w-full" id="category"
                    bind:value={formData.category}>
                    <option disabled value={undefined}>Select category</option>
                    {#each categoryOptions as option }
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>
            <!-- prep time -->
            <div class="form-control w-full">
                <label class="label" for="prepTime">
                    <span class="label-text text-base text-indigo-700 font-medium">
                        Prep time
                    </span>
                </label>
                <label class="input input-bordered w-full flex items-center gap-2">
                    <input class="grow" 
                        type="number" id="prepTime" bind:value={formData.prepTimeMin}/>
                    Min
                </label>
            </div>
            <!-- instructions(separated by ',') -->
            <div class="md:col-span-3 form-control w-full">
                <label class="label" for="instruction">
                    <span class="label-text text-base text-indigo-700 font-medium">
                        Instructions, 1 per line
                    </span>    
                </label>
                <textarea class="textarea textarea-bordered w-full" rows="5"
                    id="instruction" placeholder="Add instructions, 1 per line"
                    bind:value={formData.instructions}></textarea>
            </div>
            <!-- description -->
            <div class="md:col-span-3 form-control w-full">
                <label class="label" for="desc">
                    <span class="label-text text-base text-indigo-700 font-medium">
                        Description
                    </span>
                </label>
                <textarea class="textarea textarea-bordered w-full" 
                    id="desc" placeholder="Add a description" bind:value={formData.description}>
                </textarea>
            </div>
        </div>
        <!-- button -->
        <div class="flex justify-end gap-4 pt-6">
            <button type="button" class="btn btn-ghost w-36 border border-gray-200"
                onclick={onCancelForm}>
                Cancel
            </button>
            <button type="submit" class="btn btn-primary w-36">
                {formState === FormState.EDIT ? 
                    'Save changes' : 
                    'Add recipe'
                }
            </button>
        </div>
    </form>
</div>

<style>

</style>
<script lang="ts">
	import { categoryOptions } from "$lib/constants";
	import type { CreateRecipeData, RecipeFormSubmissionData, UpdateRecipeData } from "$lib/recipe-types";
	import { FormState, type RecipeCategory } from "$lib/types";
	import { onMount } from "svelte";
    import { z } from "zod";

    let { recipeToEdit, onSubmit, onCancel }: {
        recipeToEdit?: UpdateRecipeData | undefined,
        onSubmit: (recipeData: RecipeFormSubmissionData) => Promise<void>,
        onCancel: () => void,
    } = $props();

    const defaultFormData = {
        id: undefined,
        title: '',
        description: '',
        instructions: '',
        prepTimeMin: 0,
        category: ''
    };
    // if recipeToEdit obj is passed in, set formData input local state to recipeToEdit value
    // esle use the defaultFormData value
    // recipeToEdit: edit form mode, else add form mode
    // Add form mode won't have id, recipeCode
    let formData: {
        id: string | undefined,
        title: string,
        description: string,
        instructions: string,
        prepTimeMin: number,
        category: RecipeCategory | string, }
    = $state(recipeToEdit ? 
        {
            ...recipeToEdit, 
            instructions: recipeToEdit.instructions.length <= 0 ? '' 
                : recipeToEdit.instructions.join('\n')
        }: 
        {...defaultFormData}
    );
    // update formState mode based on recipeToEdit props
    let formState: FormState = $derived.by(() => {
        if(recipeToEdit) 
            return FormState.EDIT;
        return FormState.ADD;
    });

    type RecipeFormErrors = {
        title: string | undefined,
        category: string | undefined,
        prepTimeMin: string | undefined
    };
    // client side input validation
    // display input error msg
    let formErrors: RecipeFormErrors = $state({
        title: undefined,
        category: undefined,
        prepTimeMin: undefined
    });
    // zod schema
    const recipeSchema = z.object({
        title: z.string()
            .nonempty('Please input title')
            .max(500, 'Title must not exceed 500 characters'),
        category: z.string()
            .nonempty('Please select category'),
        prepTimeMin: z.number()
            .positive('Please input a positive number')
    });

    const submitForm = (e: Event) => {
        e.preventDefault();
        console.log('recipe form data: ', $state.snapshot(formData));
        // validate form 
        const validateResult = recipeSchema.safeParse(formData);
        console.log('form validate result: ', validateResult);
        // form invalid
        if (!validateResult.success) {
            resetFormErrors();
            for(const issue of validateResult.error.issues) {
                // mapping erros with keys
                let key = issue.path[0] as keyof RecipeFormErrors;
                formErrors[key] = issue.message;
            }
            return;
        }
        resetFormErrors();
        // form valid
        const recipeInputData = {
            title: formData.title,
            description: formData.description,
            instructions: formData.instructions === '' ? [] :
                formData.instructions
                .split('\n') // split into string[]
                .map(s => s.trim()) // foreach items, trim
                .filter(Boolean), // filter in only valid string, no empty string
            prepTimeMin: formData.prepTimeMin,
            category: formData.category as RecipeCategory,
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
    const resetFormErrors = () => {
        formErrors = {
            title: undefined,
            category: undefined,
            prepTimeMin: undefined
        };
    }

</script>

<div class="container mx-auto max-w-full">
    <form class="space-y-4"
        onsubmit={(e) => submitForm(e)}>
        <!-- form input cols layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
            <!-- title -->
            <div class="md:col-span-2 form-control w-full">
                <label class="label" for="title">
                    <span class="label-text text-base text-indigo-700 font-semibold input-required">
                        Title
                    </span>
                </label>
                <input class="input input-bordered w-full" class:input-error={formErrors.title} 
                    type="text" id="title" bind:value={formData.title}
                    onchange={() => formErrors.title = undefined}/>
                {@render showInputError(formErrors.title)}
            </div>
            {#if formState === FormState.EDIT && recipeToEdit}
                <!-- show recipe code in edit page -->
                <div class="w-full self-end">
                    <div class="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                        <span class="font-semibold text-indigo-700 text-base">Recipe Code</span>
                        <span class="font-semibold text-gray-700">{recipeToEdit.recipeCode}</span>
                    </div>
                </div>
            {:else}
                <div class="form-control w-full"></div>
            {/if}
            <!-- category -->
            <div class="form-control w-full">
                <label class="label" for="category">
                    <span class="label-text text-base text-indigo-700 font-semibold input-required">
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
                {@render showInputError(formErrors.category)}
            </div>
            <!-- prep time -->
            <div class="form-control w-full">
                <label class="label" for="prepTime">
                    <span class="label-text text-base text-indigo-700 font-semibold input-required">
                        Prep time
                    </span>
                </label>
                <label class="input input-bordered w-full flex items-center gap-2"
                    class:input-error={formErrors.prepTimeMin}>
                    <input class="grow" 
                        type="number" id="prepTime" bind:value={formData.prepTimeMin}
                        onchange={() => formErrors.prepTimeMin = undefined}/>
                    Min
                </label>
                {@render showInputError(formErrors.prepTimeMin)}
            </div>
            <!-- instructions(separated by ',') -->
            <div class="md:col-span-3 form-control w-full">
                <label class="label" for="instruction">
                    <span class="label-text text-base text-indigo-700 font-semibold">
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
                    <span class="label-text text-base text-indigo-700 font-semibold">
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
            <button type="submit" class="btn btn-primary w-36 text-white font-semibold">
                {formState === FormState.EDIT ? 
                    'Save changes' : 
                    'Add recipe'
                }
            </button>
        </div>
    </form>
</div>

{#snippet showInputError(message: string | undefined)}
    {#if message}
        <p class="input-error-msg">{message}</p>
    {/if}
{/snippet}

<style>

</style>
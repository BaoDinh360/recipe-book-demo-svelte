<script lang="ts">
	import { categoryOptions } from "$lib/constants";
	import type { CreateRecipeData, UpdateRecipeData } from "$lib/recipe-types";
	import { FormState, type Recipe, type RecipeCategory, type SelectOption } from "$lib/types";

    // local state for forms input
    let formData: {
        recipeCode: string
        title: string,
        description: string,
        instructions: string,
        prepTimeMin: number,
        category: RecipeCategory | undefined,
    } = $state({
        recipeCode: '',
        title: '',
        description: '',
        instructions: '',
        prepTimeMin: 0,
        category: undefined
    });
    // local recipe id state, for mapping recipeEdit id
    let recipeEditId: string | null = $state(null);
    let formState: FormState = $state(FormState.ADD);

    let { recipeEdit, onSaveRecipe, onCancelEdit }: {
        // recipeEdit passing from parent, for mapping recipe edit data to form
        recipeEdit: Recipe | null,
        onSaveRecipe : (recipeData: CreateRecipeData | UpdateRecipeData) => void,
        onCancelEdit : () => void
    } = $props();

    // run this when comp first mount
    // or when any reactive var being read inside it change
    $effect(() => {
        if(recipeEdit) {
            formState = FormState.EDIT;
            recipeEditId = recipeEdit.id;

            formData = {
                recipeCode: recipeEdit.recipeCode,
                title: recipeEdit.title,
                description: recipeEdit.description,
                instructions: recipeEdit.instructions.join('\n'),
                prepTimeMin: recipeEdit.prepTimeMin,
                category: recipeEdit.category
            };
        } else {
            formState = FormState.ADD;
            recipeEditId = null;

            formData = {
                recipeCode: '',
                title: '',
                description: '',
                instructions: '',
                prepTimeMin: 0,
                category: undefined
            };
        }
    });

    const onSubmitForm = (e: Event) => {
        e.preventDefault();
        console.log('recipe form: ', $state.snapshot(formData));
        // const recipeData: Recipe = {
        //     //id: recipeEditId ?? generateRecipeId(),
        //     id: recipeEditId ?? '',
        //     title: formData.title,
        //     recipeCode: recipeEdit ? recipeEdit.recipeCode : '', // tam thoi set cung
        //     description: formData.description,
        //     instructions: formData.instructions
        //         .split('\n') // split into string[]
        //         .map(s => s.trim()) // foreach items, trim
        //         .filter(Boolean), // filter in only valid string, no empty string
        //     prepTimeMin: formData.prepTimeMin,
        //     category: formData.category!,
        //     dateCreated: new Date() 
        // };
        
        // create common input data obj
        let recipeInputData = {
            title: formData.title,
            description: formData.description,
            instructions: formData.instructions
                .split('\n') // split into string[]
                .map(s => s.trim()) // foreach items, trim
                .filter(Boolean), // filter in only valid string, no empty string
            prepTimeMin: formData.prepTimeMin,
            category: formData.category!,
        };
        if(recipeEdit && formState === FormState.EDIT) {
            // Edit recipe mode
            const recipeData: UpdateRecipeData = {
                ...recipeInputData,
                id: recipeEdit.id
            };
            onSaveRecipe(recipeData);
        }
        else {
            // Add recipe mode
            const recipeData: CreateRecipeData = {
                ...recipeInputData
            };
            onSaveRecipe(recipeData);
        }
        
        if(formState === FormState.ADD){
            // clear input when add mode
            resetFormInput();
        }
    }

    const onCancelForm = () => {
        if(recipeEdit && formState === FormState.EDIT) {
            // edit mode
            // parent callback (set recipeEdit null) --> $effect clear form data
            onCancelEdit();
        } else if(!recipeEdit && formState === FormState.ADD) {
            // add mode
            // reset form input
            resetFormInput();
        }
    }

    const resetFormInput = () => {
        // reset input
        formData = {
            recipeCode: '',
            title: '',
            description: '',
            instructions: '',
            prepTimeMin: 0,
            category: undefined
        };
    }

</script>

<div class="container mx-auto max-w-full">
    <h2 class="text-2xl font-bold text-indigo-700 mb-2 pb-2 text-center">Recipe Form</h2>
    <form class="p-6 space-y-4 bg-indigo-50 rounded-lg border border-indigo-200"
        onsubmit={(e) => onSubmitForm(e)}>
        {#if recipeEditId}
            <h3 class="text-lg font-medium text-indigo-700 mb-2 pb-2">Editing recipe: {formData.recipeCode}</h3>
        {:else}
            <h3 class="text-lg font-medium text-indigo-700 mb-2 pb-2">Add new recipe</h3>
        {/if}
        <!-- title -->
        <div class="form-control w-full">
            <label class="label" for="title">
                <span class="label-text text-base text-indigo-700 font-medium">
                    Title
                </span>    
            </label>
            <input class="input input-bordered w-full" 
                type="text" id="title" bind:value={formData.title}/>
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
            <input class="input input-bordered w-full" 
                type="number" id="prepTime" bind:value={formData.prepTimeMin}/>
        </div>
        <!-- instructions(separated by ',') -->
        <div class="form-control w-full">
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
        <div class="form-control w-full">
            <label class="label" for="desc">
                <span class="label-text text-base text-indigo-700 font-medium">
                    Description
                </span>    
            </label>
            <textarea class="textarea textarea-bordered w-full" 
                id="desc" placeholder="Add a description" bind:value={formData.description}>
            </textarea>
        </div>
        <!-- button -->
        <div class="flex gap-4 pt-2">
            <button type="button" class="btn btn-ghost w-1/2"
                onclick={onCancelForm}>
                Cancel
            </button>
            <button type="submit" class="btn btn-primary w-1/2">
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
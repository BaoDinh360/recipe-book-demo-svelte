<script lang="ts">
	import type { CreateRecipeData, RecipeCategory, RecipeFormSubmissionData, UpdateRecipeData } from "$lib/recipe-types";
	import { FormState, type RecipeFormErrors } from "$lib/types";
    import { z } from "zod";
	import RecipeGeneralInfoSection from "./RecipeGeneralSection.svelte";
	import IngredientSection from "./IngredientSection.svelte";
	import RecipeStatsSection from "./RecipeStatsSection.svelte";
	import type { IngredientSelect } from "$lib/types/ingredient-types";
	import { setContext } from "svelte";
	import ConfirmActionModal from "../shared/ConfirmActionModal.svelte";

    let { recipeToEdit, ingredientSelects, onSubmit, onCancel }: {
        recipeToEdit?: UpdateRecipeData | undefined,
        ingredientSelects: IngredientSelect[],
        onSubmit: (recipeData: RecipeFormSubmissionData) => Promise<void>,
        onCancel: () => void,
    } = $props();

    // context api to pass data (avoid props drilling)
    setContext('ingredientSelects', ingredientSelects);

    // cancel modal ref
    let cancelModalRef: ConfirmActionModal | undefined = $state();
    const confirmCancelForm = () => {
        // reset form input
        resetFormInput();
        // callback props
        onCancel();
    }

    // split form state into multiple state obj section
    const defaultGeneral = {
        title: '',
        description: '',
        instructions: '',
    };
    const defaultStats = {
        category: '',
        prepTimeMin: 0
    };
    const defaultIngredientList:{
        rowId: string;
        ingredientId: string;
        name: string; // for display
        qty: number;
        unit: string;
    }[] = [];
    
    // if recipeToEdit obj is passed in, set formData input local state to recipeToEdit value
    // esle use the defaultFormData value
    // recipeToEdit: edit form mode, else add form mode
    // Add form mode won't have id, recipeCode

    // form state for general info section
    let generalFormData: {
        title: string,
        description: string,
        instructions: string
    } = $state(recipeToEdit ? 
        {
            title: recipeToEdit.title,
            description: recipeToEdit.description,
            instructions: recipeToEdit.instructions.length <= 0 ? '' 
                : recipeToEdit.instructions.join('\n')
        }: 
        {...defaultGeneral}
    );

    // form state for recipe stats section
    let statsFormData: {
        category: RecipeCategory | string,
        prepTimeMin: number,
    } = $state(recipeToEdit ? 
        {
            category: recipeToEdit.category,
            prepTimeMin: recipeToEdit.prepTimeMin
        }: 
        {...defaultStats}
    );

    // form state for recipe ingredient list
    let ingredientListData:{
        // client rowId to keep track
        rowId: string;
        id?: string;
        ingredientId: string;
        name: string; // for display
        qty: number;
        unit: string;
    }[] = $state(recipeToEdit ? 
    recipeToEdit.ingredients.map(ingr => ({
        rowId: crypto.randomUUID(),
        id: ingr.id,
        ingredientId: ingr.ingredientId,
        name: ingr.name!,
        qty: ingr.qty,
        unit: ingr.unit
    })): defaultIngredientList);
    

    // update formState mode based on recipeToEdit props
    let formState: FormState = $derived.by(() => {
        if(recipeToEdit) 
            return FormState.EDIT;
        return FormState.ADD;
    });

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
            .positive('Please input a positive number'),
    });

    const isFormValid = (): Boolean => {
        // combined props of multiple obj section --> 1 obj
        const combinedFormData = {...generalFormData, ...statsFormData};
        console.log('recipe form data: ', $state.snapshot(combinedFormData));
        // validate form 
        const validateResult = recipeSchema.safeParse(combinedFormData);
        console.log('form validate result: ', validateResult);
        // form invalid
        if (!validateResult.success) {
            resetFormErrors();
            for(const issue of validateResult.error.issues) {
                // mapping erros with keys
                let key = issue.path[0] as keyof RecipeFormErrors;
                formErrors[key] = issue.message;
            }
            return false;
        }
        resetFormErrors();
        return true;
    }

    const submitForm = (e: Event) => {
        e.preventDefault();
        console.log('general info data: ', $state.snapshot(generalFormData));
        console.log('stats data: ', $state.snapshot(statsFormData));
        console.log('ingredient list data: ', $state.snapshot(ingredientListData));
        //return;

        // validate form inputs
        if(!isFormValid()) {
            return;
        }
        // form valid
        const recipeInputData = {
            title: generalFormData.title,
            description: generalFormData.description,
            instructions: generalFormData.instructions === '' ? [] :
                generalFormData.instructions
                .split('\n') // split into string[]
                .map(s => s.trim()) // foreach items, trim
                .filter(Boolean), // filter in only valid string, no empty string
            prepTimeMin: statsFormData.prepTimeMin,
            category: statsFormData.category as RecipeCategory,
            // ingredients list form data
            ingredients: ingredientListData.map(ingr => {
                const { rowId, ...included } = ingr;
                return included;
            }),
        }
        if(formState === FormState.EDIT && recipeToEdit) {
            // edit recipe
            const recipeData: UpdateRecipeData = {
                ...recipeInputData,
                id: recipeToEdit.id,
                recipeCode: recipeToEdit.recipeCode,
            };
            onSubmit(recipeData);
        }
        else {
            // add recipe
            const recipeData: CreateRecipeData = {
                ...recipeInputData,
            };
            onSubmit(recipeData);
        }
    }

    // state for keep track of selected ingredient
    let selectedIngredientRowId: string | undefined = $state(undefined);
    let selectedIngredientRow  = $derived.by(() => {
        if(selectedIngredientRowId) {
            return ingredientListData.find(ingr => ingr.rowId === selectedIngredientRowId);
        }
        return undefined;
    });
    const addNewIngredient = (ingredientData: {
        ingredientId: string;
        name: string;
        qty: number;
        unit: string;
    }) => {
        console.log('ingredientListData', $state.snapshot(ingredientListData));
        const newRow = {
            rowId: crypto.randomUUID(),
            ...ingredientData
        };
        console.log('ingredient data: ', ingredientData);
        console.log('new row: ', newRow);
        ingredientListData = [...ingredientListData, newRow];
    }
    const updateIngredient = (rowId: string, ingredientData: {
        ingredientId: string;
        name: string;
        qty: number;
        unit: string;
    }) => {
        console.log('ingredientListData', $state.snapshot(ingredientListData));
        ingredientListData = ingredientListData.map(item => {
            if(item.rowId === rowId) {
                return {...item, ...ingredientData};
            }
            return item;
        });
        selectedIngredientRowId = undefined;
    }
    const removeIngredient =(rowId: string) => {
        ingredientListData = ingredientListData.filter(item => item.rowId !== rowId);
    }
    const onSelectedIngredient = (rowId: string) => {
        selectedIngredientRowId = rowId;
        console.log('selectedIngredientRowId', $state.snapshot(selectedIngredientRowId));
        console.log('selected ingred row: ', $state.snapshot(selectedIngredientRow));
    }
    const onCancelEditIngredient = () => {
        selectedIngredientRowId = undefined;
    }

    const resetFormInput = () => {
        // reset input
        generalFormData = {...defaultGeneral};
        statsFormData = {...defaultStats};
        ingredientListData = defaultIngredientList;
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
        <!-- grid layout -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <!-- left col -->
            <div class="md:col-span-3 space-y-4">
                <!-- card section recipe info -->
                <!-- <div class="w-full mx-auto p-6 rounded-lg shadow-md 
                    bg-white border border-gray-200 space-y-4">
                    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
                        Recipe Info 
                        {#if formState === FormState.EDIT && recipeToEdit}
                            <span class="font-bold pl-4 text-indigo-700 text-base">
                                {recipeToEdit.recipeCode}
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
                        {@render showInputError(formErrors.title)}
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
                <RecipeGeneralInfoSection 
                    bind:formData={generalFormData}
                    recipeCode={recipeToEdit ? recipeToEdit.recipeCode : undefined}
                    bind:formErrors={formErrors}
                    errContent={showInputError}/>
                <!-- card section ingredients list -->
                <IngredientSection 
                    {ingredientListData}
                    selectedRowId={selectedIngredientRowId}
                    selectedRow={selectedIngredientRow}
                    onSelectEditRow={onSelectedIngredient}
                    onCancelEdit={onCancelEditIngredient}
                    onAddNew={addNewIngredient}
                    onUpdateExisted={updateIngredient}
                    onRemove={removeIngredient}/>
            </div>
            <!-- right col -->
            <div class="md:col-span-2 space-y-4">
                <!-- card section img thumbnail -->
                <div class="w-full mx-auto p-6 rounded-lg shadow-md 
                    bg-white border border-gray-200 space-y-4">
                    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
                        Media (future feat)
                    </h3>
                    <div class="text-center py-10 text-gray-500 italic border-4 border-dashed border-indigo-300/50 rounded-xl bg-indigo-50/50">
                        Image upload (placeholder)
                    </div>
                </div>
                <!-- card section statistics -->
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
                            {@render showInputError(formErrors.category)}
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
                            {@render showInputError(formErrors.prepTimeMin)}
                        </div>
                    </div>
                </div> -->
                <RecipeStatsSection 
                    bind:formData={statsFormData}
                    bind:formErrors={formErrors}
                    errContent={showInputError}/>
            </div>
        </div>
        <!-- button -->
        <div class="flex justify-end gap-4 pt-6">
            <button type="button" class="btn w-36 bg-gray-200 hover:bg-gray-300"
                onclick={() => cancelModalRef!.showModal()}>
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

<!-- cancel form modal -->
    {#snippet cancelContent()}
        <p class="py-4 px-2 text-gray-600">
            Cancel changes from this recipe?
        </p>
    {/snippet}
    <ConfirmActionModal 
        bind:this={cancelModalRef}
        title='Cancel Changes'
        modalContent={cancelContent}
        actionLabel='Cancel changes'
        modalStyle='NEUTRAL'
        onConfirm={confirmCancelForm}
        onCancel={() => {}} />

{#snippet showInputError(message: string | undefined)}
    {#if message}
        <p class="input-error-msg">{message}</p>
    {/if}
{/snippet}

<style>

</style>
<script lang="ts">
	import type { CreateRecipeData, RecipeCategory, RecipeFormSubmissionData, RecipeIngredientFormVM, UpdateRecipeData } from "$lib/recipe-types";
	import { FormState, type RecipeFormErrors } from "$lib/types";
    import { z } from "zod";
	import RecipeGeneralInfoSection from "./RecipeGeneralSection.svelte";
	import IngredientSection from "./IngredientSection.svelte";
	import RecipeStatsSection from "./RecipeStatsSection.svelte";
	import type { IngredientSelect } from "$lib/types/ingredient-types";
	import { setContext } from "svelte";
	import ConfirmActionModal from "../shared/ConfirmActionModal.svelte";
	import { ImageUpIcon, SaveIcon, SquarePenIcon } from "$lib/icons";
	import RecipeInstructionsSection from "./RecipeInstructionsSection.svelte";

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
    const defaultIngredientList:RecipeIngredientFormVM[] = [];
    
    // if recipeToEdit obj is passed in, set formData input local state to recipeToEdit value
    // esle use the defaultFormData value
    // recipeToEdit: edit form mode, else add form mode
    // Add form mode won't have id, recipeCode

    // form state for general info section
    let generalFormData: {
        title: string,
        description: string,
        // instructions: string
    } = $state(recipeToEdit ? 
        {
            title: recipeToEdit.title,
            description: recipeToEdit.description,
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
    let ingredientListData:RecipeIngredientFormVM[] = $state(recipeToEdit ? 
    recipeToEdit.ingredients.map(ingr => ({
        rowId: crypto.randomUUID(),
        id: ingr.id,
        ingredientId: ingr.ingredientId,
        name: ingr.name!,
        qty: ingr.qty,
        unit: ingr.unit
    })): defaultIngredientList);
    
    // form state for list of instruction steps
    let instructionListData: {
        rowId: string, instructionText: string 
    }[] = $state(recipeToEdit ?
    recipeToEdit.instructions.map(ins => ({
        rowId: crypto.randomUUID(),
        instructionText: ins
    })) : []);

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
        // console.log('general info data: ', $state.snapshot(generalFormData));
        // console.log('stats data: ', $state.snapshot(statsFormData));
        // console.log('ingredient list data: ', $state.snapshot(ingredientListData));
        // console.log('instructions list data: ', $state.snapshot(instructionListData));
        //return;

        // validate form inputs
        if(!isFormValid()) {
            return;
        }
        // form valid
        const recipeInputData = {
            title: generalFormData.title,
            description: generalFormData.description,
            instructions: instructionListData.map(i => i.instructionText.trim()),
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

    // ingredient func section
    const addRecipeIngredient = () => {
        ingredientListData.push({
            rowId: crypto.randomUUID(),
            ingredientId: '',
            name: '',
            qty: 0,
            unit: ''
        });
    }
    const updateRecipeIngredient = (rowId: string, updated: Partial<RecipeIngredientFormVM>) => {
        const currIndex = ingredientListData.findIndex(ingr => ingr.rowId === rowId);
        if (currIndex !== -1) {
            ingredientListData[currIndex] = {...ingredientListData[currIndex], ...updated};
        }
    }
    const deleteRecipeIngredient = (rowId: string) => {
        ingredientListData = ingredientListData.filter(i => i.rowId !== rowId);
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

    // function for instruction list data
    const addNewInstruction = () => {
        instructionListData.push({
            rowId: crypto.randomUUID(),
            instructionText: ''
        });
    }
    const updateInstruction = (rowId: string,instruction: string) => {
        const current = instructionListData.find(i => i.rowId === rowId);
        if (current) {
            current.instructionText = instruction;
        }
    }
    const removeInstruction = (rowId: string) => {
        instructionListData = instructionListData.filter(i => i.rowId !== rowId);
    }
</script>


<form onsubmit={(e) => submitForm(e)}>
    <div class="flex flex-col max-w-[960px] flex-1 gap-6 pb-20">
        <div class="flex flex-wrap justify-between gap-3 px-4">
            <div class="flex flex-col gap-2">
                <h1 class="text-base-content text-3xl md:text-4xl font-display 
                    font-semibold leading-tight tracking-tight">
                    {formState === FormState.EDIT ?
                        'Edit Recipe' :
                        'Create New Recipe'
                    }
                </h1>
                {#if formState === FormState.EDIT}
                    <p class="text-primary text-xl font-bold font-display">
                        {recipeToEdit?.recipeCode}
                    </p>
                {:else}
                    <p class="text-base-content/80 text-base font-normal font-body">
                        Share your culinary masterpiece with the world.
                    </p>
                {/if}
            </div>
            <div class="flex gap-4 self-start">
                {@render formButtonGroup()}
            </div>
        </div>
        <!-- upload image (future feat) -->
        <div class="px-4">
            <div class="group relative w-full bg-center bg-no-repeat bg-cover flex flex-col items-center 
                justify-center overflow-hidden bg-base-200 rounded-xl min-h-[280px] border-2 border-dashed 
                border-base-300 hover:border-primary transition-colors cursor-pointer"
                data-alt="Placeholder recipe image">
                <div class="flex flex-col items-center gap-3 p-6 bg-base-100/60 rounded-2xl backdrop-blur-sm 
                    shadow-sm transition-transform group-hover:scale-105">
                    <ImageUpIcon class="size-8 text-primary" />
                    <div class="text-center">
                        <p class="text-neutral font-bold text-base">Upload Cover Photo</p>
                        <p class="text-neutral/80 text-sm">Drag & drop or click to browse</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
            <!-- left col -->
            <div class="md:col-span-8 flex flex-col gap-6">
                <RecipeGeneralInfoSection 
                    bind:formData={generalFormData}
                    bind:formErrors={formErrors}
                    errContent={showInputError}/>
            </div>
            <!-- right col -->
            <div class="md:col-span-4 flex flex-col gap-6">
                <RecipeStatsSection 
                    bind:formData={statsFormData}
                    bind:formErrors={formErrors}
                    errContent={showInputError}/>
            </div>
        </div>

        <div class="border-t border-base-300 my-2"></div>
        <IngredientSection 
            {ingredientListData}
            onAddIngredient={addRecipeIngredient}
            onUpdateIngredient={updateRecipeIngredient}
            onRemoveIngredient={deleteRecipeIngredient}/>
        
        <div class="border-t border-base-300 my-2"></div>
        <RecipeInstructionsSection 
            {instructionListData}
            onAddInstruction={addNewInstruction}
            onUpdateInstruction={(rowId, val) => updateInstruction(rowId, val)}
            onRemoveInstruction={removeInstruction}/>
        
        <div class="sticky bottom-0 left-0 right-0 p-4 bg-base-100 border-t border-base-300 
            md:static md:bg-transparent md:border-0 md:p-4 mt-8">
            <div class="flex gap-3 justify-end">
                {@render formButtonGroup()}
            </div>
        </div>
    </div>
</form>
<!-- cancel form modal -->
{#snippet cancelContent()}
    <p class="py-4 px-2 text-gray-600">
        Discard changes from this recipe ?
    </p>
{/snippet}
<ConfirmActionModal 
    bind:this={cancelModalRef}
    title='Discard Changes'
    modalContent={cancelContent}
    actionLabel='Discard'
    modalStyle='neutral'
    onConfirm={confirmCancelForm}
    onCancel={() => {}} />

{#snippet showInputError(message: string | undefined)}
    {#if message}
        <p class="input-error-msg">{message}</p>
    {/if}
{/snippet}

{#snippet formButtonGroup()}
    <button type="button" class="btn w-36 gap-2 rounded-2xl text-base-content bg-base-100 hover:bg-base-200
        border border-base-300 hover:scale-105 text-sm transition-all shadow-sm"
        onclick={() => cancelModalRef!.showModal()}>
        Discard
    </button>
    <button type="submit" class="btn btn-primary w-40 gap-2 text-primary-content rounded-2xl font-semibold
        transition-all hover:scale-105 shadow-sm font-display text-sm">
        {#if formState === FormState.EDIT}
            <SaveIcon class="size-4 text-primary-content" strokeWidth="3" />
        {:else}
            <SquarePenIcon class="size-4 text-primary-content" strokeWidth="3" />
        {/if}
        {formState === FormState.EDIT ? 
            'Save changes' : 
            'Add recipe'
        }
    </button>
{/snippet}

<style>

</style>
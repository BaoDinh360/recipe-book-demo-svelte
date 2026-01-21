<script lang="ts">
	import { PlusIcon, SquarePenIcon, Trash2Icon, XIcon } from "$lib/icons";
	import type { RecipeIngredientFormVM } from "$lib/recipe-types";
	import type {  IngredientSelect } from "$lib/types/ingredient-types";
	import { getContext } from "svelte";

    // get ingredientSelect from context
    const ingredientSelects: IngredientSelect[] = getContext('ingredientSelects');

    let { ingredientListData, 
        // selectedRowId, selectedRow, 
        // onSelectEditRow, onCancelEdit, onAddNew, onUpdateExisted, onRemove,
        onAddIngredient, onUpdateIngredient, onRemoveIngredient
    }: {
        ingredientListData: RecipeIngredientFormVM[],
        onAddIngredient: () => void,
        onUpdateIngredient: (rowId: string, updated: Partial<RecipeIngredientFormVM>) => void,
        onRemoveIngredient: (rowId: string) => void
        // selectedRowId?: string;
        // selectedRow?: {
        //     ingredientId: string;
        //     name: string; // for display
        //     qty: number;
        //     unit: string;
        // },
        // onSelectEditRow: (rowId: string) => void,
        // onCancelEdit: () => void,
        // onAddNew: (ingredientData: {
        //     ingredientId: string;
        //     name: string;
        //     qty: number;
        //     unit: string;
        // }) => void,
        // onUpdateExisted: (rowId: string, ingredientData: {
        //     ingredientId: string;
        //     name: string;
        //     qty: number;
        //     unit: string;
        // }) => void,
        // onRemove: (rowId: string) => void

    } = $props();

    // form state for input row
    // let formIngredient: {
    //     ingredientId: string;
    //     name: string;
    //     qty: number;
    //     unit: string;
    // } = $state({
    //     ingredientId: '',
    //     name: '',
    //     qty: 0,
    //     unit: ''
    // });

    // $effect(() => {
    //     if(selectedRow) {
    //         formIngredient = {...selectedRow};
    //     };
    // })
    // const onChangeIngredientSelect = () => {
    //     // find ingredient in list
    //     const index = ingredientSelects.findIndex(i => i.id === formIngredient.ingredientId);
    //     if(index !== -1) {
    //         const ingredientData = ingredientSelects[index];
    //         // populate other input
    //         formIngredient.unit = ingredientData.unit;
    //         formIngredient.name = ingredientData.name;
    //     };
    //     console.log('ingredient form: ', $state.snapshot(formIngredient));
    // };

    const onSelectIngredientId = (rowId: string, ingredientId: string) => {
        // find ingredient in list
        const index = ingredientSelects.findIndex(i => i.id === ingredientId);
        if(index !== -1) {
            const ingredientData = ingredientSelects[index];
            const updatedData = { ingredientId, unit: ingredientData.unit, name: ingredientData.name };
            onUpdateIngredient(rowId, updatedData);
        };
    }

    // use for edit existing ingredient
    // const onPopuplateFormIngredient = (rowId: string) => {
    //     onSelectEditRow(rowId);
    // }

    // const onAddIngredientItem = () => {
    //     onAddNew({...formIngredient});
    //     resetInput();
    // };
    // const onDeleteIngredientItem = (rowId: string) => {
    //     onRemove(rowId);
    //     resetInput();
    // };
    // const onUpdateIngredientItem = (rowId: string) => {
    //     onUpdateExisted(rowId, {...formIngredient});
    //     resetInput();
    // };
    // const onCancelEditIngredientItem = () => {
    //     resetInput();
    //     onCancelEdit();
    // }
    
    // const resetInput = () => {
    //     formIngredient = {
    //         ingredientId: '',
    //         name: '',
    //         qty: 0,
    //         unit: ''
    //     };
    // }

</script>

<!-- <div class="w-full mx-auto p-6 rounded-lg shadow-md 
       bg-white border border-gray-200 space-y-4">
    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
        Ingredients 
    </h3>
    <div class="overflow-x-auto">
        <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 text-base font-semibold text-gray-600 p-2">
            <span>Ingredient</span>
            <span>Qty</span>
            <span>Unit</span>
            <span></span>
        </div>
        <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 items-center bg-gray-100 rounded-lg px-2 py-3">
            <select class="select select-bordered select-sm w-full"
                id="ingrd_name"
                bind:value={formIngredient.ingredientId}
                onchange={onChangeIngredientSelect}>
                <option disabled value={''}>Select ingredient</option>
                {#each ingredientSelects as ingredient }
                    <option value={ingredient.id}>{ingredient.name}</option>
                {/each}
            </select>
            <input class="input input-bordered input-sm w-full" 
                type="number" id="ingrd_qty" 
                bind:value={formIngredient.qty}/>
            <input class="input input-bordered input-sm w-full" 
                type="text" id="ingrd_unit" 
                bind:value={formIngredient.unit}/>
            <div class="flex justify-center gap-x-2">
                {#if !selectedRowId}
                    <button class="grid-cols-2 btn btn-sm btn-outline btn-circle btn-primary group"
                        type="button" onclick={onAddIngredientItem}>
                        <PlusIcon class="h-4 w-4 group-hover:stroke-white" />
                    </button>
                {:else if selectedRowId}
                    <button class="grid-cols-2 btn btn-sm btn-outline btn-circle btn-primary group"
                        type="button" onclick={() => onUpdateIngredientItem(selectedRowId)}>
                        <SquarePenIcon class="h-4 w-4 group-hover:stroke-white" />
                    </button>
                    <button class="grid-cols-2 btn btn-sm btn-outline btn-circle group"
                        type="button" onclick={onCancelEditIngredientItem}>
                        <XIcon class="h-4 w-4 group-hover:stroke-white" />
                    </button>
                {/if}
            </div>
        </div>
        <div class="space-y-2 mt-6">
            {#if ingredientListData.length <= 0}
                <p class="text-sm text-gray-400 pl-4 italic">No ingredients added yet.</p>
            {:else}
            
                {#each ingredientListData as item (item.rowId)}
                    {@render displayIngredientItem(item)}
                {/each}
            {/if}
        </div>
    </div>
</div> -->

<!-- BAODNQ 20260119 - FIX UI -->
<div class="flex flex-col gap-4 px-4">
    <div class="flex items-center justify-between">
        <h3 class="text-neutral text-xl font-bold font-display">Ingredients</h3>
    </div>
    <div class="flex flex-col gap-3 w-11/12 self-center">
        <div class="hidden md:flex gap-4 px-2">
            <div class="flex-[3] text-xs font-semibold text-neutral/80 uppercase tracking-wide font-display">
                Item</div>
            <div class="flex-1 text-xs font-semibold text-neutral/80 uppercase tracking-wide font-display">
                Qty</div>
            <div class="flex-1 text-xs font-semibold text-neutral/80 uppercase tracking-wide font-display">
                Unit</div>
            <div class="w-10"></div>
        </div>
        {#if !ingredientListData || ingredientListData.length <= 0}
            <p class="text-sm text-base-content/50 text-center font-medium mt-2 italic">
                No ingredients
            </p>
        {/if}
        {#each ingredientListData as item (item.rowId) }
            {@render ingredientItemRow(item)}
        {/each}
        <div class="border-t border-base-300 w-full self-center mt-1"></div>
        <div class="w-full flex justify-center">
            <button class="w-6/12 btn btn-outline btn-primary text-primary-content
                rounded-xl transition-all font-medium mt-2 font-display"
                type="button"
                onclick={onAddIngredient}>
                <PlusIcon class="size-4" />
                Add Ingredient
            </button>
        </div>
    </div>
</div>

{#snippet ingredientItemRow(item: {
        rowId: string;
        ingredientId: string;
        name: string; // for display
        qty: number;
        unit: string;
    })}
    <div class="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-3 rounded-lg 
        shadow-sm border border-transparent hover:border-primary/20 transition-colors group">
        <div class="w-full md:flex-[3]">
            <div class="relative">
                <select class="w-full select select-bordered select-sm w-full bg-base-200 border border-base-300 rounded-xl 
                    text-base text-neutral font-normal focus:outline-none focus:ring-1 focus:ring-primary 
                    focus:border-primary cursor-pointer transition-shadow text-sm"
                    id="ingrd_name"
                    value={item.ingredientId}
                    onchange={(e) => onSelectIngredientId(item.rowId, e.currentTarget.value)}>
                    <option disabled value={''}>Select ingredient</option>
                    {#each ingredientSelects as ingredient }
                        <option value={ingredient.id}>{ingredient.name}</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="flex gap-3 w-full md:w-auto md:contents">
            <div class="w-1/2 md:flex-1">
                <input class="w-full input input-bordered input-sm rounded-xl bg-base-200 border border-base-300 
                    focus:outline-none focus:ring-1 focus:ring-primary text-neutral text-sm"
                    type="number" id="ingrd_qty" 
                    value={item.qty}
                    oninput={(e) => onUpdateIngredient(item.rowId, { qty: Number(e.currentTarget.value) })}/>
            </div>
            <div class="w-1/2 md:flex-1">
                <input class="input input-bordered input-sm w-full rounded-xl bg-base-200 border border-base-300 
                    focus:outline-none focus:ring-1 focus:ring-primary text-neutral text-sm" 
                    type="text" id="ingrd_unit" 
                    value={item.unit}
                    oninput={(e) => onUpdateIngredient(item.rowId, { unit: e.currentTarget.value })}/>
            </div>
            <button class="flex items-center justify-center bg-base-100 text-error hover:text-neutral-content transition-colors
                btn btn-sm btn-circle btn-error"
                type="button" onclick={() => onRemoveIngredient(item.rowId)}>
                <Trash2Icon class="h-4 w-4" />
            </button>
        </div>
    </div>
{/snippet}

<!-- {#snippet displayIngredientItem(item: {
        rowId: string;
        ingredientId: string;
        name: string;
        qty: number;
        unit: string;
    })}
    <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 items-center border-b py-2 p-2">
        <span class="pl-2">{item.name}</span>
        <span class="pl-2">{item.qty}</span>
        <span class="pl-2">{item.unit}</span>
        <div class="flex gap-2 justify-end border-l pl-2">
            <button class="btn btn-sm btn-outline btn-circle btn-success group"
                type="button">
                <SquarePenIcon class="h-4 w-4 group-hover:stroke-white" 
                    onclick={() => onPopuplateFormIngredient(item.rowId)}/>
            </button>
            <button class="btn btn-sm btn-outline btn-circle btn-error group"
                type="button" onclick={() => onDeleteIngredientItem(item.rowId)}>
                <Trash2Icon class="h-4 w-4 group-hover:stroke-white" />
            </button>
        </div>
    </div>
{/snippet} -->
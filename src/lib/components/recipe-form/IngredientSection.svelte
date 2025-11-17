<script lang="ts">
	import { PlusIcon, SquarePenIcon, Trash2Icon, XIcon } from "$lib/icons";
	import type {  IngredientSelect } from "$lib/types/ingredient-types";
	import { getContext } from "svelte";

    // get ingredientSelect from context
    const ingredientSelects: IngredientSelect[] = getContext('ingredientSelects');

    let { ingredientListData, selectedRowId, selectedRow, 
        onSelectEditRow, onCancelEdit, onAddNew, onUpdateExisted, onRemove, }: {
        ingredientListData: {
            rowId: string;
            ingredientId: string;
            name: string; // for display
            qty: number;
            unit: string;
        }[],
        selectedRowId?: string;
        selectedRow?: {
            ingredientId: string;
            name: string; // for display
            qty: number;
            unit: string;
        },
        onSelectEditRow: (rowId: string) => void,
        onCancelEdit: () => void,
        onAddNew: (ingredientData: {
            ingredientId: string;
            name: string;
            qty: number;
            unit: string;
        }) => void,
        onUpdateExisted: (rowId: string, ingredientData: {
            ingredientId: string;
            name: string;
            qty: number;
            unit: string;
        }) => void,
        onRemove: (rowId: string) => void

    } = $props();

    // form state for input row
    let formIngredient: {
        ingredientId: string;
        name: string;
        qty: number;
        unit: string;
    } = $state({
        ingredientId: '',
        name: '',
        qty: 0,
        unit: ''
    });

    $effect(() => {
        if(selectedRow) {
            formIngredient = {...selectedRow};
        };
    })

    const onChangeIngredientSelect = () => {
        // find ingredient in list
        const index = ingredientSelects.findIndex(i => i.id === formIngredient.ingredientId);
        if(index !== -1) {
            const ingredientData = ingredientSelects[index];
            // populate other input
            formIngredient.unit = ingredientData.unit;
            formIngredient.name = ingredientData.name;
        };
        console.log('ingredient form: ', $state.snapshot(formIngredient));
    };
    // use for edit existing ingredient
    const onPopuplateFormIngredient = (rowId: string) => {
        // find by index, then populate the input form
        // const ingredientRowSelected = ingredientListData[index];
        // console.log('ingredient clicked: ', $state.snapshot(ingredientRowSelected));
        // formIngredient = {...ingredientRowSelected};
        // formMode = 'EDIT';
        // currentEditIngredIndex = index;
        console.log('rowId edit clicked: ', rowId);
        onSelectEditRow(rowId);
    }

    const onAddIngredientItem = () => {
        onAddNew({...formIngredient});
        resetInput();
    };
    const onDeleteIngredientItem = (rowId: string) => {
        // const index = ingredientListData.findIndex(i => i.ingredientId === ingrId);
        // if(index !== -1) {
        //     ingredientListData.splice(index, 1);
        // }
        // console.log('ingredient list total count: ', $state.snapshot(ingredientListData.length));
        onRemove(rowId);
        resetInput();
    };
    const onUpdateIngredientItem = (rowId: string) => {
        // update only the selected, return a new array
        // ingredientListData = ingredientListData.map((item, index) => {
        //     if(index === currentEditIngredIndex) {
        //         return {...item, ...formIngredient};
        //     }
        //     return item;
        // });
        // console.log('ingredient list : ', $state.snapshot(ingredientListData));
        onUpdateExisted(rowId, {...formIngredient});
        resetInput();
    };
    const onCancelEditIngredientItem = () => {
        resetInput();
        onCancelEdit();
    }
    
    const resetInput = () => {
        formIngredient = {
            ingredientId: '',
            name: '',
            qty: 0,
            unit: ''
        };
    }

</script>

<div class="w-full mx-auto p-6 rounded-lg shadow-md 
       bg-white border border-gray-200 space-y-4">
    <!-- Ingredients header -->
    <h3 class="text-lg font-bold text-gray-800 border-b pb-3 mb-4">
        Ingredients 
    </h3>
    <div class="overflow-x-auto">
        <!-- header row -->
        <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 text-base font-semibold text-gray-600 p-2">
            <span>Ingredient</span>
            <span>Qty</span>
            <span>Unit</span>
            <span></span>
        </div>
        <!-- input row -->
        <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 items-center bg-gray-100 rounded-lg px-2 py-3">
            <!-- ingredients name -->
            <select class="select select-bordered select-sm w-full"
                id="ingrd_name"
                bind:value={formIngredient.ingredientId}
                onchange={onChangeIngredientSelect}>
                <option disabled value={''}>Select ingredient</option>
                {#each ingredientSelects as ingredient }
                    <option value={ingredient.id}>{ingredient.name}</option>
                {/each}
            </select>
            <!-- qty -->
            <input class="input input-bordered input-sm w-full" 
                type="number" id="ingrd_qty" 
                bind:value={formIngredient.qty}/>
            <!-- unit -->
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
        <!-- list ingrdients section -->
        <div class="space-y-2 mt-6">
            <!-- empty list -->
            {#if ingredientListData.length <= 0}
                <p class="text-sm text-gray-400 pl-4 italic">No ingredients added yet.</p>
            {:else}
            
                {#each ingredientListData as item (item.rowId)}
                    {@render displayIngredientItem(item)}
                {/each}
            {/if}
        </div>
    </div>
</div>

{#snippet displayIngredientItem(item: {
        rowId: string;
        ingredientId: string;
        name: string; // for display
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
{/snippet}
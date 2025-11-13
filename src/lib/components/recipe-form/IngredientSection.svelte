<script lang="ts">
	import { PlusIcon, SquarePenIcon, Trash2Icon } from "$lib/icons";
	import type { IngredientFormData, IngredientSelect } from "$lib/types/ingredient-types";
	import { getContext } from "svelte";

    // get ingredientSelect from context
    const ingredientSelects: IngredientSelect[] = getContext('ingredientSelects');

    let { ingredientListData = $bindable() }: {
        ingredientListData: IngredientFormData[]
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
    }

    const onAddIngredientItem = () => {
        const ingredientItem: IngredientFormData = {...formIngredient};
        ingredientListData.push(ingredientItem);
        console.log('ingredient list total count: ', $state.snapshot(ingredientListData.length));
        resetInput();
    };
    const onDeleteIngredientItem = (ingrId: string) => {
        const index = ingredientListData.findIndex(i => i.ingredientId === ingrId);
        if(index !== -1) {
            ingredientListData.splice(index, 1);
        }
        console.log('ingredient list total count: ', $state.snapshot(ingredientListData.length));
        resetInput();
    };

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
            <div class="flex justify-center">
                <button class="grid-cols-2 btn btn-sm btn-outline btn-circle btn-primary group"
                type="button" onclick={onAddIngredientItem}>
                <PlusIcon class="h-4 w-4 group-hover:stroke-white" />
            </button>
            </div>
            <!-- <button class="grid-cols-2 btn btn-sm btn-outline btn-circle btn-primary group"
                type="button" onclick={onAddIngredientItem}>
                <PlusIcon class="h-4 w-4 group-hover:stroke-white" />
            </button> -->
        </div>
        <!-- list ingrdients section -->
        <div class="space-y-2 mt-6">
            <!-- empty list -->
            {#if ingredientListData.length <= 0}
                <p class="text-sm text-gray-400 pl-4 italic">No ingredients added yet.</p>
            {:else}
            
                {#each ingredientListData as item}
                    {@render displayIngredientItem(item)}
                {/each}
            {/if}
        </div>
    </div>
</div>

{#snippet displayIngredientItem(item: IngredientFormData)}
    <div class="grid grid-cols-[2fr_1fr_1fr_0.8fr] gap-3 items-center border-b py-2 p-2">
        <span class="pl-2">{item.name}</span>
        <span class="pl-2">{item.qty}</span>
        <span class="pl-2">{item.unit}</span>
        <div class="flex gap-2 justify-end border-l pl-2">
            <button class="btn btn-sm btn-outline btn-circle btn-success group"
                type="button">
                <SquarePenIcon class="h-4 w-4 group-hover:stroke-white" />
            </button>
            <button class="btn btn-sm btn-outline btn-circle btn-error group"
                type="button" onclick={() => onDeleteIngredientItem(item.ingredientId)}>
                <Trash2Icon class="h-4 w-4 group-hover:stroke-white" />
            </button>
        </div>
    </div>
{/snippet}
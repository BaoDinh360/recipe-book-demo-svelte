<script lang="ts">
	import { PlusIcon, Trash2Icon } from "$lib/icons";
	import type { RecipeIngredientFormVM } from "$lib/recipe-types";
	import type {  IngredientSelect } from "$lib/types/ingredient-types";
	import { getContext } from "svelte";

    // get ingredientSelect from context
    const ingredientSelects: IngredientSelect[] = getContext('ingredientSelects');

    let { ingredientListData,
        onAddIngredient, onUpdateIngredient, onRemoveIngredient
    }: {
        ingredientListData: RecipeIngredientFormVM[],
        onAddIngredient: () => void,
        onUpdateIngredient: (rowId: string, updated: Partial<RecipeIngredientFormVM>) => void,
        onRemoveIngredient: (rowId: string) => void
    } = $props();

    const onSelectIngredientId = (rowId: string, ingredientId: string) => {
        // find ingredient in list
        const index = ingredientSelects.findIndex(i => i.id === ingredientId);
        if(index !== -1) {
            const ingredientData = ingredientSelects[index];
            const updatedData = { ingredientId, unit: ingredientData.unit, name: ingredientData.name };
            onUpdateIngredient(rowId, updatedData);
        };
    }

</script>


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
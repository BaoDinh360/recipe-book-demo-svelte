<script lang="ts">
	import { PlusIcon, Trash2Icon } from "$lib/icons";

    //props
    let { instructionListData, onAddInstruction, onUpdateInstruction, onRemoveInstruction }: {
        instructionListData: {rowId: string, instructionText: string}[],
        onAddInstruction: () => void, 
        onUpdateInstruction: (rowId: string, text: string) => void,
        onRemoveInstruction: (rowId: string) => void,
    } = $props();

</script>

<div class="flex flex-col gap-2 px-4">
    <h3 class="text-charcoal text-xl font-bold font-display">Instruction Steps</h3>
    {#if !instructionListData || instructionListData.length <= 0}
        <p class="text-sm text-base-content/50 text-center font-medium mt-2 italic">
            No instruction steps
        </p>
    {/if}
    <ul class="steps steps-vertical w-full px-2">
        {#each instructionListData as step, index (step.rowId) }
            {@render instructionStep(step, index)}
        {/each}
    </ul>
    <div class="flex gap-2 w-full justify-center">
        <button class="w-6/12 btn btn-outline btn-primary text-primary-content
                rounded-xl transition-all font-medium mt-2 font-display"
            onclick={onAddInstruction}
            type="button">
            <PlusIcon class="size-4" />
            Add Instruction
        </button>
    </div>
</div>

{#snippet instructionStep(step: { rowId: string, instructionText: string }, index: number)}
    <li class="step min-h-[150px] place-items-start pb-12 group
        after:!size-12 after:!text-primary after:!text-xl after:font-bold after:font-display after:transition-all
        before:!left-[1.5rem] before:!h-full before:!top-0 before:!w-[2px] 
        after:!bg-base-100 after:border-2 after:border-base-300" 
        data-content={index + 1}>
        <div class="flex flex-row gap-4 ml-14 mt-2.5 w-5/6">
            <textarea class="textarea textarea-bordered flex w-full resize-none min-h-[100px] rounded-2xl text-neutral 
                focus:outline-0 focus:ring-2 focus:ring-primary border border-base-300 bg-base-200 
                placeholder:text-neutral/60 text-base font-normal leading-normal transition-shadow
                shadow-sm pt-2"
                placeholder="Describe instruction..."
                value={step.instructionText}
                oninput={(e) => onUpdateInstruction(step.rowId,e.currentTarget.value)}></textarea>
            <div class="self-center">
                <button class="flex items-center justify-center rounded-lg bg-base-100 text-error hover:text-neutral-content transition-colors
                    btn btn-error btn-square"
                    title="Delete Instruction"
                    onclick={() => onRemoveInstruction(step.rowId)}>
                    <Trash2Icon class="size-5" />
                </button>
            </div>  
        </div>
    </li>
{/snippet}
<script lang="ts">
	import { PlusIcon, Trash2Icon } from "$lib/icons";

    //props
    let { instructionListData, onAddInstruction, onRemoveInstruction }: {
        instructionListData: {rowId: string, instructionText: string}[],
        onAddInstruction: () => void, 
        onRemoveInstruction: (rowId: string) => void,
    } = $props();

</script>

<div class="flex flex-col gap-4 px-4">
    <h3 class="text-charcoal text-xl font-bold font-display">Instruction Steps</h3>
    <ul class="steps steps-vertical w-full px-2">
        {#each instructionListData as step, index (step.rowId) }
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
                        bind:value={step.instructionText}></textarea>
                    <div>
                        <button class="flex items-center justify-center px-3 py-2 rounded-lg bg-base-100
                            border border-error/60 hover:bg-error/90 hover:border-error hover:text-neutral-content text-error transition-colors"
                            title="Delete Instruction"
                            onclick={() => onRemoveInstruction(step.rowId)}>
                            <Trash2Icon class="size-5" />
                        </button>
                    </div>
                    
                </div>
            </li>
        {/each}
    </ul>
    <div class="flex gap-2">
        <button class="btn btn-primary text-sm 
            text-primary-content font-semibold rounded-2xl flex items-center gap-1 font-display"
            onclick={onAddInstruction}
            type="button">
            <PlusIcon class="size-4" />
            Add Instruction
        </button>
    </div>
</div>
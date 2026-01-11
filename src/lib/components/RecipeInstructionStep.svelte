<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";
	import { twMerge } from "tailwind-merge";


    let { step, stepContent, isCompleted, class:className = '' }: {
        step: number,
        stepContent: Snippet,
        isCompleted?:boolean,
        class?: string
    } = $props();

    const stepClasses = $derived(twMerge(clsx(
        "step min-h-[150px] place-items-start pb-12 group",
        "after:!size-12 after:!text-primary after:!text-xl after:font-bold after:font-display after:transition-all",
        "before:!left-[1.5rem] before:!h-full before:!top-0 before:!w-[2px]",
        isCompleted ?
            "step-primary after:shadow-md"
            : [
                "after:!bg-base-100 after:border-2 after:border-base-300",
            ],
        className
    )));
</script>

<li class={stepClasses} data-content={step}>
    <div class="text-left ml-14 mt-2.5">
        {@render stepContent()}
    </div>
</li>
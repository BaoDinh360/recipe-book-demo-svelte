<script lang="ts">
	import { Trash2Icon } from "$lib/icons";
	import type { IconProps } from "@lucide/svelte";
	import type { Component, Snippet } from "svelte";

    interface ConfirmDialogConfig {
        btnClasses: string;
        iconClasses: string;
        iconComp: any
    };
    type ConfirmStyle = 'primary' | 'info' | 'error' | 'neutral';

    const themeConfigMap: Record<ConfirmStyle, ConfirmDialogConfig> = {
        'primary': {
            btnClasses: 'btn-primary', 
            iconClasses: 'bg-primary/10 text-primary', 
            iconComp: Trash2Icon
        },
        'info': {
            btnClasses: 'btn-info', 
            iconClasses: 'bg-info/10 text-info', 
            iconComp: Trash2Icon
        },
        'error': {
            btnClasses: 'btn-error', 
            iconClasses: 'bg-error/10 text-error', 
            iconComp: Trash2Icon
        },
        'neutral': {
            btnClasses: 'btn-neutral', 
            iconClasses: 'bg-info/10 text-neutral', 
            iconComp: null
        }
    }
    
    // const tailwind class
    // const themeConfig = {
    //     primary: {btn: 'btn-primary', icon: 'bg-primary/10 text-primary', iconComp: Trash2Icon},
    //     info: {btn: 'btn-info', icon: 'bg-info/10 text-info', iconComp: Trash2Icon},
    //     error: {btn: 'btn-error', icon: 'bg-error/10 text-error', iconComp: Trash2Icon},
    //     neutral: {btn: 'btn-neutral', icon: 'bg-info/10 text-neutral', iconComp: Trash2Icon},
    // }

    let {
        title = 'Are you sure ?',
        actionLabel = 'Confirm',
        modalStyle = 'primary',
        modalContent,
        onCancel,
        onConfirm
    }: {
        title: string;
        actionLabel: string;
        modalStyle: ConfirmStyle;
        modalContent: Snippet;
        onCancel: () => void;
        onConfirm: () => void;
    } = $props();

    let modalRef: HTMLDialogElement;
    // export comp func to allow parent to call via ref
    export const showModal = () => {
        modalRef?.showModal();
    }
    export const closeModal = () => {
        modalRef?.close();
    }

    const currentTheme = $derived(themeConfigMap[modalStyle] || themeConfigMap['primary']);
    const IconComponent = $derived(currentTheme.iconComp);

    // const actionStyle = $derived.by(() => {
    //     switch(modalStyle) {
    //         case 'INFO':
    //             return 'btn-info';
    //         case 'ERROR':
    //             return 'btn-error';
    //         case 'NEUTRAL':
    //             return 'btn-neutral';
    //     }
    // });
    // const titleStyle = $derived.by(() => {
    //     switch(modalStyle) {
    //         case 'INFO':
    //             return 'text-sky-600';
    //         case 'ERROR':
    //             return 'text-red-600';
    //         case 'NEUTRAL':
    //             return 'text-gray-600';
    //     }
    // });

    const cancelModal = () => {
        modalRef?.close();
        onCancel();
    }
    const confirmModal = () => {
        modalRef?.close();
        onConfirm();
    }

</script>

<dialog class="modal" bind:this={modalRef}>
    <!-- <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={cancelModal}>✕</button>
        </form>
        <div class="p-2 mb-4">
            <h3 class="font-bold text-2xl mb-4 {titleStyle}">
                {title}
            </h3>
            {@render modalContent()}
        </div>
        <div class="modal-action p-2 pt-4">
            <div class="w-full flex flex-row justify-end gap-2.5">
                <button class="btn {actionStyle}"
                    onclick={confirmModal}>{actionLabel}</button>
                <form method="dialog">
                    <button class="btn btn-ghost"
                    onclick={cancelModal}>Close</button>
                </form> 
            </div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button onclick={cancelModal}>close</button>
    </form> -->

    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content"
                onclick={cancelModal}>✕</button>
        </form>
        <div class="p-8 flex flex-col items-center text-center">
            {#if IconComponent}
                <div class="flex items-center justify-center rounded-full p-4 mb-4
                    {currentTheme.iconClasses}">
                    <!-- <Trash2Icon class="size-8" /> -->
                    <IconComponent class="size-8" />
                </div>
            {/if}
            <h3 class="text-2xl font-semibold text-base-content mb-2">
                {title}
            </h3>
            <!-- Body Text -->
            <p class="text-base-content text-base leading-relaxed mb-8">
                {@render modalContent()}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 w-full mt-8">
                <!-- flex-1 px-6 py-3.5 bg-primary hover:bg-[#34a838] text-white font-bold rounded-full shadow-lg 
                shadow-primary/20 transition-all duration-200 order-1 sm:order-2 -->
                <button class="flex-1 text-neutral-content font-semibold rounded-2xl transition-all duration-200 
                    order-1 sm:order-2
                    btn {currentTheme.btnClasses}"
                    onclick={confirmModal} type="button">
                    {actionLabel}
                </button>
                <form method="dialog" class="flex-1 w-full order-2 sm:order-1">
                    <button class="btn w-full text-base-content font-semibold rounded-2xl transition-all 
                    duration-200"
                    onclick={cancelModal}>Cancel</button>
                </form>
            </div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button onclick={cancelModal}>close</button>
    </form>
</dialog>

<style>

</style>
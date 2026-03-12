<script lang="ts">
	import { Trash2Icon } from "$lib/icons";
	import type { Snippet } from "svelte";

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
            iconClasses: 'bg-info-100 text-info-500', 
            iconComp: Trash2Icon
        },
        'error': {
            btnClasses: 'btn-error', 
            iconClasses: 'bg-error-100 text-error-500', 
            iconComp: Trash2Icon
        },
        'neutral': {
            btnClasses: 'btn-neutral', 
            iconClasses: 'bg-info-100 text-neutral', 
            iconComp: null
        }
    }

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
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content"
                onclick={cancelModal}>✕</button>
        </form>
        <div class="p-8 flex flex-col items-center text-center">
            {#if IconComponent}
                <div class="flex items-center justify-center rounded-full p-4 mb-4
                    {currentTheme.iconClasses}">
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

<style></style>
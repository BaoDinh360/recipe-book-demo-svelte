<script lang="ts">
  
    let {
        title,
        message,
        actionLabel,
        modalStyle,
        onCancel,
        onConfirm
    }: {
        title: string;
        message: string;
        actionLabel: string;
        modalStyle: 'INFO' | 'ERROR' | 'NEUTRAL';
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

    const actionStyle = $derived.by(() => {
        switch(modalStyle) {
            case 'INFO':
                return 'btn-info';
            case 'ERROR':
                return 'btn-error';
            case 'NEUTRAL':
                return 'btn-neutral';
        }
    });
    const titleStyle = $derived.by(() => {
        switch(modalStyle) {
            case 'INFO':
                return 'text-sky-600';
            case 'ERROR':
                return 'text-red-600';
            case 'NEUTRAL':
                return 'text-gray-600';
        }
    });

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
        <!-- close X -->
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={cancelModal}>✕</button>
        </form>
        <div class="p-2 mb-4">
            <h3 class="font-bold text-2xl mb-4 {titleStyle}">
                {title}
            </h3>
            <p class="py-2 text-gray-600">
                {message}
            </p>
        </div>
        <div class="modal-action p-2 pt-4">
            <div class="w-full flex flex-row justify-end gap-2.5">
                <button class="btn {actionStyle}"
                    onclick={confirmModal}>{actionLabel}</button>
                <!-- close modal -->
                <form method="dialog">
                    <button class="btn btn-ghost"
                    onclick={cancelModal}>Close</button>
                </form> 
            </div>
        </div>
    </div>
    <!-- This outer form allows closing the modal by clicking outside the box -->
    <form method="dialog" class="modal-backdrop">
        <button onclick={cancelModal}>close</button>
    </form>
</dialog>

<style>

</style>
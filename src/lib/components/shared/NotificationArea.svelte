<script lang="ts">
	import { notifications, removeNotification, type NotificationType } from "$lib/stores/notification-stores";
	import { fly } from "svelte/transition";
    import { CheckIcon, CircleXIcon, XIcon } from '$lib/icons';

    const getAlertType = (notiType: NotificationType) => {
        switch(notiType) {
            case "SUCCESS":
                return 'alert-success';
            case "ERROR":
                return 'alert-error';
            case "INFO":
                return 'alert-info'
            case "WARNING":
                return 'alert-warning';
            default:
                return '';
        }
    };

</script>

<div class="toast toast-top toast-center z-[9999]">
    {#each $notifications as noti (noti.id) }
        <div class="alert {getAlertType(noti.notiType)} text-white p-4"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {#if noti.notiType === 'SUCCESS'}
                {@render successIcon()}
            {:else if noti.notiType === 'ERROR'}
                {@render errorIcon()}
            {/if}
            <!-- <span>{noti.message}</span> -->
             <pre class="px-3 font-semibold">{noti.message}</pre>
            <button class="btn btn-ghost btn-xs btn-circle" aria-label="close"
                onclick={() => removeNotification(noti.id)}>
                <XIcon class="h-5 w-5 stroke-white" strokeWidth=3 />
            </button>
        </div>
    {/each}
    <!-- <div class="alert alert-success text-white p-5"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {@render successIcon()}
            <span>Test alert msg</span>
            <button class="btn btn-ghost btn-sm btn-circle" aria-label="close">
                <X class="h-5 w-5 stroke-white" strokeWidth=3 />
            </button>
        </div>
    <div class="alert alert-error text-white p-5"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {@render errorIcon()}
            <span>Test alert msg</span>
            <button class="btn btn-ghost btn-sm btn-circle" aria-label="close">
                <X class="h-5 w-5 stroke-white" strokeWidth=3 />
            </button>
        </div> -->
</div>

{#snippet successIcon()}
    <CheckIcon class="h-7 w-7 stroke-white"/>
{/snippet}

{#snippet errorIcon()}
    <CircleXIcon class="h-7 w-7 stroke-white" />
{/snippet}

<style>

</style>
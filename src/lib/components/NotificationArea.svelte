<script lang="ts">
	import { notifications, removeNotification, type NotificationType } from "$lib/stores/notification-stores";
	import { fly } from "svelte/transition";

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

<div class="toast toast-end z-[9999]">
    {#each $notifications as noti (noti.id) }
        <div class="alert {getAlertType(noti.notiType)} text-white p-4"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {#if noti.notiType === 'SUCCESS'}
                {@render successIcon()}
            {:else if noti.notiType === 'ERROR'}
                {@render errorIcon()}
            {/if}
            <span>{noti.message}</span>
            <button class="btn btn-ghost btn-xs btn-circle"
                onclick={() => removeNotification(noti.id)}>
                X</button>
        </div>
    {/each}
    <!-- <div class="alert alert-success text-white p-5"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {@render successIcon()}
            <span>Test alert msg</span>
            <button class="btn btn-ghost btn-sm btn-circle" aria-label="close">
                <svg class="h-8 w-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_iconCarrier"><path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke-width="2" stroke-linecap="round"></path> </g></svg>    
            </button>
        </div>
    <div class="alert alert-error text-white p-5"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {@render errorIcon()}
            <span>Test alert msg</span>
            <button class="btn btn-ghost btn-sm btn-circle" aria-label="close">
                <svg class="h-8 w-8 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_iconCarrier"><path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke-width="2" stroke-linecap="round"></path> </g></svg>    
            </button>
        </div> -->
</div>

{#snippet successIcon()}
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="1.5"></circle> <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
{/snippet}

{#snippet errorIcon()}
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="1.5"></circle> <path d="M12 7V13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <circle cx="12" cy="16" r="1" fill="#ffffff"></circle> </g></svg>
{/snippet}

<style>

</style>
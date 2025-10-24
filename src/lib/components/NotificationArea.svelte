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
            <span>{noti.message}</span>
            <button class="btn btn-ghost btn-xs btn-circle"
                onclick={() => removeNotification(noti.id)}>X</button>
        </div>
    {/each}
    <!-- <div class="alert alert-info text-white p-5"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            <span>Test alert msg</span>
            <button class="btn btn-ghost btn-xs btn-circle">X</button>
        </div> -->
</div>

<style>

</style>
<script lang="ts">
	import { fly } from "svelte/transition";
    import { CheckIcon, CircleXIcon, InfoIcon, XIcon } from '$lib/icons';
	import { notiManager, type NotificationToast } from "$lib/states/notification-state.svelte";

    interface NotiToastConfig {
        notiBgClasses: string;
        durationClasses: string;
        closeBtnClasses: string;
    }

    const getNotiToastConfig = (noti: NotificationToast): NotiToastConfig => {
        let notiBgClasses = '';
        let closeBtnClasses = '';
        let durationClasses = '';
        switch(noti.notiType) {
            case "SUCCESS":
                notiBgClasses = "alert-success text-success-600 bg-success-100 border border-success-300"
                durationClasses = 'bg-success-500';
                closeBtnClasses = "text-success-400 group-hover:text-success-600"
                break;
            case "ERROR":
                notiBgClasses = "alert-error text-error-600 bg-error-100 border border-error-300"
                durationClasses = 'bg-error-500';
                closeBtnClasses = "text-error-400 group-hover:text-error-600"
                break;
            case "INFO":
                notiBgClasses = "alert-info text-info-600 bg-info-100 border border-info-300"
                durationClasses = 'bg-info-500';
                closeBtnClasses = "text-info-400 group-hover:text-info-600"
                break;
            case "WARNING":
                notiBgClasses = "alert-warning text-warning-600 bg-warning-100 border border-warning-300"
                durationClasses = 'bg-warning-500';
                closeBtnClasses = "text-warning-400 group-hover:text-warning-600"
                break;
            default:
                notiBgClasses = "alert-info text-info-600 bg-info-100 border border-info-300"
                durationClasses = 'bg-info-500';
                closeBtnClasses = "text-info-400 group-hover:text-info-600"
                break;
        }
        return { notiBgClasses, closeBtnClasses, durationClasses };
    }

</script>

<div class="toast toast-top toast-end z-[9999]">
    {#each notiManager.notifications as noti (noti.id) }
        {@render showToastNoti(noti, getNotiToastConfig(noti))}
    {/each}
    <!-- <div class="alert alert-success text-success-600 py-3 px-4 bg-success-100 border border-success-300
        rounded-xl shadow-lg pointer-events-auto transform transition-all
        pb-4 relative overflow-hidden"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            <CheckIcon class="size-5" strokeWidth=3/>
            <div class="flex flex-col items-start justify-center gap-0 font-medium">
                <span class="font-semibold text-base">Success !</span>
                <p class="text-sm">Login successful! Welcome back.</p>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle hover:bg-transparent group" 
                aria-label="close">
                <XIcon class="size-5 text-success-400 group-hover:text-success-600"/>
            </button>
            <div class="absolute bottom-0 left-0 w-full h-1">
                <div class="absolute left-0 h-full bg-success-500"
                    style:animation="shrink-rtl 5000ms linear forwards"></div>
            </div>
    </div>
    <div class="alert alert-error text-error-600 py-3 px-4 bg-error-100 border border-error-300
        rounded-xl shadow-lg pointer-events-auto transform transition-all
        pb-4 relative overflow-hidden"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            <CircleXIcon class="size-5" strokeWidth=3/>
            <div class="flex flex-col items-start justify-center gap-0 font-medium">
                <span class="font-semibold text-base">Error !</span>
                <p class="text-sm">Invalid username or password. Please try again.</p>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle hover:bg-transparent group" 
                aria-label="close">
                <XIcon class="size-5 text-error-400 group-hover:text-error-600"/>
            </button>
            <div class="absolute bottom-0 left-0 w-full h-1 bg-error-100">
                <div class="absolute left-0 h-full bg-error-500"
                    style:animation="shrink-rtl 5000ms linear forwards"></div>
            </div>
    </div> -->
</div>

{#snippet showToastNoti(noti: NotificationToast, toastConfig: NotiToastConfig)}
    <div class="alert py-3 px-4 rounded-xl shadow-lg pointer-events-auto transform transition-all
            pb-4 relative overflow-hidden
            {toastConfig.notiBgClasses}"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}>
            {#if noti.notiType === 'SUCCESS'}
                <CheckIcon class="size-5" strokeWidth=3/>
            {:else if noti.notiType === 'ERROR'}
                <CircleXIcon class="size-5" strokeWidth=3/>
            {:else if noti.notiType === 'INFO'}
                <InfoIcon class="size-5" strokeWidth=3 />
            {/if}
            <div class="flex flex-col items-start justify-center gap-0 font-medium">
                {#if noti.title}
                    <span class="font-semibold text-base">{noti.title}</span>
                {/if}
                <p class="text-sm">{noti.message}</p>
            </div>
            <button class="btn btn-ghost btn-sm btn-circle hover:bg-transparent group" 
                aria-label="close"
                onclick={() => notiManager.removeNotification(noti.id)}>
                <XIcon class="size-5 {toastConfig.closeBtnClasses}"/>
            </button>
            <div class="absolute bottom-0 left-0 w-full h-1">
                <div class="absolute left-0 h-full {toastConfig.durationClasses}"
                    style:animation="shrink-rtl {noti.duration}ms linear forwards"></div>
            </div>
    </div>
{/snippet}

<style>
    /* Use -global- to ensure the inline style attribute can find it */
    @keyframes -global-shrink-rtl {
        0% { 
            width: 100%; 
        }
        100% { 
            width: 0%; 
        }
    }
</style>
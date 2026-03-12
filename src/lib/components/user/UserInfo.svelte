<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { LogoutIcon, SettingsIcon, UserRoundIcon } from "$lib/icons";
	import { notiManager } from "$lib/states/notification-state.svelte";
	import type { Result } from "$lib/types/result-types";
	import { navigateToLogin } from "$lib/utils/navigation";

    const logout = async () => {
        let notiMessage = '';
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result: Result = await response.json();
            if (response.ok && result.success) {
                // reload all load func to update new locals.userInfo
                await invalidateAll();
                navigateToLogin();
            } else {
                notiMessage = 'An error occurs when logging out';
                notiManager.notifyError(notiMessage);
            }
        } catch (err) {
            // unhandled error occurs at UI level
            notiManager.notifyError(`An unexpected error occurs when logging out!`);
        }
    }

</script>

<div class="flex items-center gap-4 pl-4 border-l border-base-300">
    <div class="dropdown dropdown-end">
        <button tabindex="0" class="relative group" aria-label="view user info">
            <div class="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-transparent group-hover:ring-primary transition-all"
                data-alt="User profile avatar showing a smiling person"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVOJBXDLmJId5AXGVdGmEOuv-czVbwXkJW8XHxZeb2aP8xtbqq43sf0Vdi-i26EbMft3VJsxnu25xxr-n5Eo0GdRPBIWbNT4llij40Y2pGSd_A7Xbde5wANVO2kqMACf6go5rELwoyQTyDEkZ2NKFl_kyDIijqLiazcAEFvcZqtqjoOWloffS6V_I4QqtxcxjEFl454NOvBpF9UrV--txUSwN647U-y3vQaoM4i9VjQCLIRGldFrPbAMwE9b7Mu_9PkAnkDOtowyI");'>
            </div>
        </button>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-lg shadow-xl z-[60] w-48 p-0 py-2
            border border-base-300 space-y-2">
            <li>
                <a class="flex items-center gap-3 px-4 py-2 text-sm text-base-content 
                    hover:bg-white hover:text-primary transition-colors rounded-none"
                    href="#">
                    <UserRoundIcon class="size-4" />
                    <span class="font-medium">View Profile</span>
                </a>
            </li>
            <li>
                <a class="flex items-center gap-3 px-4 py-2 text-sm text-base-content 
                    hover:bg-white hover:text-primary transition-colors rounded-none"
                    href="#">
                    <SettingsIcon class="size-4" />
                    <span class="font-medium">Settings</span>
                </a>
            </li>
            <div class="my-1 border-t border-base-300"></div>
            <li>
                <button class="flex items-center gap-3 px-4 py-2 text-sm text-base-content 
                    hover:bg-white hover:text-error transition-colors rounded-none"
                    type="button"
                    onclick={logout}>
                    <LogoutIcon class="size-4" />
                    <span class="font-medium">Logout</span>
                </button>
            </li>
        </ul>
    </div>
</div>
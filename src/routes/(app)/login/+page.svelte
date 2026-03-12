<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation";
	import { page } from "$app/state";
	import LoginForm from "$lib/components/auth/LoginForm.svelte";
	import { notiManager } from "$lib/states/notification-state.svelte";
	import type { Result } from "$lib/types/result-types";
	import { navigateToHomePage, redirectToUrl } from "$lib/utils/navigation";

    const login = async({ username, password }: { username: string; password: string; }) => {
        let notiMessage = '';
        const redirectTo = page.url.searchParams.get('redirectTo');
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
            });

            const result: Result = await response.json();
            if (response.ok && result.success) {
                // reload all load func to update new locals.userInfo
                await invalidateAll();
                redirectToUrl(redirectTo);
                
                notiMessage = 'Login successfully!';
                notiManager.notifySuccess(notiMessage);
            } else {
                notiMessage = `Login failed: ${result.message}`;
                notiManager.notifyError(notiMessage);
            }
        } catch (err) {
            // unhandled error occurs at UI level
            notiManager.notifyError(`An unexpected error occurs!: ${(err as any).message}`);
        }
    }

</script>

<main class="flex-1 flex items-center justify-center p-6 bg-base-100">
    <LoginForm
        onFormSubmitted={login} />
</main>
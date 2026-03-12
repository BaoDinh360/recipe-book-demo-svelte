<script lang="ts">
	import { page } from "$app/state";
	import RegisterForm from "$lib/components/auth/RegisterForm.svelte";
	import { notiManager } from "$lib/states/notification-state.svelte";
	import type { Result } from "$lib/types/result-types";
	import type { UserRegisterPayload } from "$lib/types/user-authen-types";
	import { navigateToLogin } from "$lib/utils/navigation";

    const addUser = async(registerPayload: UserRegisterPayload) => {
        let notiMessage = '';
        const redirectTo = page.url.searchParams.get('redirectTo');
        try {
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerPayload)
            });
            const result: Result<{id: string, username: string}> = await response.json();
            if(response.ok && result.success) {
                navigateToLogin(redirectTo);
                notiMessage = `Create account successfully! You can login now`;
                notiManager.notifySuccess(notiMessage);
            } else {
                notiMessage = `Create account failed: ${result.message}`;
                notiManager.notifyError(notiMessage);
            }
        } catch (err) {
            // unhandled error occurs at UI level
            notiManager.notifyError(`An unexpected error occurs!: ${(err as any).message}`);
        }
    }

</script>

<main class="flex-1 flex items-center justify-center p-6 bg-base-100">
    <RegisterForm 
        onFormSubmitted={addUser}/>
</main>
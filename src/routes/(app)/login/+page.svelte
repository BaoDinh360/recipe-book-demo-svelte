<script lang="ts">
	import { goto } from "$app/navigation";
	import LoginForm from "$lib/components/auth/LoginForm.svelte";
	import { notifyError } from "$lib/stores/notification-stores";

    const login = async({ username, password }: { username: string; password: string; }) => {
        let message = '';
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
            });

            const responseBody = await response.json();
            if (response.ok && responseBody.success) {
                goto('/');
            } else {
                // failed
                message = responseBody.message ?? 'Invalid credentials';
                notifyError(message);
            }
        } catch (err) {
            console.error('An exception occurs: ', err);
            notifyError('An unexpected error occurs!');
        }
    }

</script>

<main class="flex-1 flex items-center justify-center p-6 bg-base-100">
    <LoginForm
        onFormSubmitted={login} />
</main>
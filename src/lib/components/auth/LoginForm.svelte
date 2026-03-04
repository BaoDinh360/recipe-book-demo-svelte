<script lang="ts">
	import { ChefHatIcon, EyeIcon, EyeOffIcon, LockKeyholeIcon, UserRoundIcon } from "$lib/icons";
    import { z } from "zod";

    // props
    let { onFormSubmitted }: {
        onFormSubmitted: ({ username, password}: { username: string, password: string }) 
            => void
    } = $props();

    // local state
    let loginFormState: {
        username: string;
        password: string;
    } = $state({
        username: '',
        password: ''
    });

    let showPassword = $state(false);
    let passInputType = $derived(showPassword ? 'text' : 'password');

    // login form inputs errors state
    let loginFormErrors: {
        username?: string;
        password?: string;
    } = $state({
        username: undefined,
        password: undefined
    })

    // zod validation schema
    const loginSchema = z.object({
        username: z.string()
            .nonempty('Please enter your username')
            .max(100, 'Username is too long'),
        password: z.string()
            .nonempty('Please enter your password')
    });

    const validateForm = async (): Promise<boolean> => {
        resetFormErrors();
        const validateRes = await loginSchema.safeParseAsync(loginFormState);
        // form invalid
        if (!validateRes.success) {
            
            for(const issue of validateRes.error.issues) {
                // mapping erros with keys
                let key = issue.path[0] as keyof { username?: string; password?: string; };
                // formErrors[key] = issue.message;
                loginFormErrors[key] = issue.message;
            }
            return false;
        }
        // form valid
        return true;
    }

    const resetFormErrors = () => {
        loginFormErrors = {
            username: undefined,
            password: undefined,
        };
    }

    const submitForm = async(e: Event) => {
        e.preventDefault();

        // form validation
        const isFormValid = await validateForm();
        if(!isFormValid) {
            return;
        }
        onFormSubmitted({ username: loginFormState.username, password: loginFormState.password });
    }
</script>

<div class="w-full max-w-[480px] bg-base-200/70 p-8 rounded-2xl shadow-sm border border-base-300">
    <div class="flex flex-col items-center mb-8">
        <div class="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <ChefHatIcon class="size-8" />
        </div>
        <h1 class="text-base-content tracking-tight text-2xl font-semibold leading-tight text-center font-display">
            Welcome Back
        </h1>
        <p class="text-base-content/80 text-sm mt-2">Log in to manage your recipes</p>
    </div>
    <form onsubmit={submitForm}
        class="space-y-4">
        <div class="form-control w-full">
            <div class="label text-base-content text-base font-medium leading-normal">
                <span>Username</span>
            </div>
            <label class="h-14 input input-bordered w-full flex items-center gap-2 overflow-hidden rounded-2xl text-neutral leading-normal text-base
                border border-base-300 bg-base-200 placeholder:text-neutral/40 px-5 font-normal
                focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <UserRoundIcon class="size-5 text-base-content/40" />
                <input type="text" class="grow" placeholder="Enter your username..."
                    bind:value={loginFormState.username} />
            </label>
            {@render showInputError(loginFormErrors.username)}
        </div>
        <div class="form-control w-full">
            <div class="label text-base-content text-base font-medium leading-normal">
                <span>Password</span>
            </div>
            <label class="h-14 input input-bordered w-full flex items-center gap-2 overflow-hidden rounded-2xl text-neutral leading-normal text-base
                border border-base-300 bg-base-200 placeholder:text-neutral/40 px-5 font-normal
                focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <LockKeyholeIcon class="size-5 text-base-content/40" />
                <input type={passInputType} class="grow" placeholder="Enter your password..."
                    bind:value={loginFormState.password} />
                <button class="btn btn-sm btn-circle btn-ghost"
                    type="button" onclick={() => showPassword = !showPassword}>
                    {#if showPassword}
                        <EyeOffIcon class="size-5 text-base-content/40" />
                    {:else}
                        <EyeIcon class="size-5 text-base-content/40" />
                    {/if}
                </button>
            </label>
            {@render showInputError(loginFormErrors.password)}
        </div>
        <div class="pt-4 w-full">
            <button class="w-full btn btn-primary cursor-pointer items-center justify-center overflow-hidden 
                rounded-2xl h-14 px-4 text-primary-content text-lg font-bold leading-normal tracking-[0.015em] 
                hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
                type="submit">
                <span class="truncate">Login</span>
            </button>
        </div>
    </form>
    <div class="mt-8 text-center border-t border-base-300 pt-6">
        <p class="text-base-content font-light text-sm">
            Don't have an account?
            <a class="text-primary font-semibold hover:underline ml-1" href="/register">Create an account</a>
        </p>
    </div>
</div>

{#snippet showInputError(message: string | undefined)}
    {#if message}
        <p class="input-error-msg">{message}</p>
    {/if}
{/snippet}
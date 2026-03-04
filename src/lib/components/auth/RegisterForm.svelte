<script lang="ts">
	import { EyeIcon, EyeOffIcon, IdCardIcon, LockKeyholeIcon, MailIcon, UserRoundIcon } from "$lib/icons";
	import type { UserRegisterForm, UserRegisterPayload } from "$lib/types/user-authen-types";

    // props
    let { onFormSubmitted }: {
        onFormSubmitted: (registerPayload: UserRegisterPayload) => void
    } = $props();

    const defaultFormState: UserRegisterForm = {
        name: '',
        email: '',
        username: '',
        password: ''
    };
    // local state
    let registerFormState: UserRegisterForm = $state(defaultFormState);

    let showPassword = $state(false);
    let passInputType = $derived(showPassword ? 'text' : 'password');

    const submitForm = async(e: Event) => {
        e.preventDefault();

        const { name, email, username, password } = $state.snapshot(registerFormState);
        const registerPayload: UserRegisterPayload = {
            name,
            email,
            username,
            password,
            passwordConfirm: password
        };
        onFormSubmitted(registerPayload);
        clearPassword();
    }

    const resetFormState = () => {
        registerFormState = defaultFormState;
    }
    const clearPassword = () => {
        registerFormState.password = '';
    }

</script>

<div class="w-full max-w-[480px] bg-base-200/70 p-8 rounded-2xl shadow-sm border border-base-300">
    <div class="flex flex-col items-center mb-8">
        <h1 class="text-base-content tracking-tight text-2xl font-semibold leading-tight 
            text-center font-display">
            Create Account
        </h1>
    </div>
    <form onsubmit={submitForm}
        class="space-y-4">
        <div class="form-control w-full">
            <div class="label text-base-content text-sm font-semibold leading-normal">
                <span>Name</span>
            </div>
            <label class="h-12 input input-bordered w-full flex items-center gap-2 overflow-hidden rounded-2xl text-neutral leading-normal text-base
                border border-base-300 bg-base-200 placeholder:text-base-content/40 px-5 font-normal
                focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <IdCardIcon class="size-5 text-base-content/40" />
                <input type="text" class="grow" placeholder="Enter your name..."
                    bind:value={registerFormState.name}/>
            </label>
        </div>
        <div class="form-control w-full">
            <div class="label text-base-content text-sm font-semibold leading-normal">
                <span>Email</span>
            </div>
            <label class="h-12 input input-bordered w-full flex items-center gap-2 overflow-hidden rounded-2xl text-neutral leading-normal text-base
                border border-base-300 bg-base-200 placeholder:text-base-content/40 px-5 font-normal
                focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <MailIcon class="size-5 text-base-content/40" />
                <input type="text" class="grow" placeholder="email@example.com"
                    bind:value={registerFormState.email}/>
            </label>
        </div>
        <div class="form-control w-full">
            <div class="label text-base-content text-sm font-semibold leading-normal">
                <span class="input-required">Username</span>
            </div>
            <label class="h-12 input input-bordered w-full flex items-center gap-2 overflow-hidden rounded-2xl text-neutral leading-normal text-base
                border border-base-300 bg-base-200 placeholder:text-base-content/40 px-5 font-normal
                focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <UserRoundIcon class="size-5 text-base-content/40" />
                <input type="text" class="grow" placeholder="Choose a unique username..."
                    bind:value={registerFormState.username}/>
            </label>
        </div>
        <div class="form-control w-full">
            <div class="label text-base-content text-sm font-semibold leading-normal">
                <span class="input-required">Password</span>
            </div>
            <label class="h-12 input input-bordered w-full flex items-center gap-2 overflow-hidden rounded-2xl text-neutral leading-normal text-base
                border border-base-300 bg-base-200 placeholder:text-base-content/40 px-5 font-normal
                focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <LockKeyholeIcon class="size-5 text-base-content/40" />
                <input type={passInputType} class="grow" placeholder="Create your password..."
                    bind:value={registerFormState.password}/>
                <button class="btn btn-sm btn-circle btn-ghost"
                    type="button" onclick={() => showPassword = !showPassword}>
                    {#if showPassword}
                        <EyeOffIcon class="size-5 text-base-content/40" />
                    {:else}
                        <EyeIcon class="size-5 text-base-content/40" />
                    {/if}
                </button>
            </label>
        </div>
        <div class="pt-4 w-full">
            <button class="w-full btn btn-primary cursor-pointer items-center justify-center overflow-hidden 
                rounded-2xl h-14 px-4 text-primary-content text-lg font-bold leading-normal tracking-[0.015em] 
                hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
                type="submit">
                <span class="truncate">Create account</span>
            </button>
        </div>
    </form>
    <div class="mt-8 text-center border-t border-base-300 pt-6">
        <p class="text-base-content font-light text-sm">
            Already have an account?
            <a class="text-primary font-semibold hover:underline ml-1" href="/login">Login</a>
        </p>
    </div>
</div>
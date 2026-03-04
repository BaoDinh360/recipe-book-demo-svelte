<script lang="ts">
	import { page } from "$app/state";
	import { NAV_MENU_ITEMS } from "$lib/constants";
	import { UtensilsCrossedIcon } from "$lib/icons";
	import { authState } from "$lib/states/AuthState.svelte";
	import { navigateToLogin, navigateToRegister } from "$lib/utils/navigation";
	import UserInfo from "../user/UserInfo.svelte";

    const navItems = NAV_MENU_ITEMS;

    let currentPath = $derived(page.url.pathname);
    let showRegisterBtn = $derived(currentPath === '/login' && !authState.isLoggedIn);


</script>

<header class="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/95 backdrop-blur-sm">
    <div class="flex items-center justify-between px-6 py-4 max-w-[1280px] mx-auto w-full">
        <!-- App title + icon -->
        <div class="flex items-center gap-4 text-neutral">
            <div class="flex items-center justify-center text-primary">
                <UtensilsCrossedIcon class="size-8" />
            </div>
            <h2 class="text-xl text-base-content font-heading font-bold leading-tight tracking-tight">
                Recipe Manager
            </h2>
        </div>
        <div class="hidden md:flex flex-1 justify-end gap-8 items-center">
            <!-- menu section -->
            <nav class="flex items-center gap-6 font-heading">
                {#each navItems as item }
                    <a href="{item.url}" class="text-sm transition-colors"
                        class:font-medium={currentPath !== item.url}
                        class:hover:text-primary={currentPath !== item.url}
                        class:font-bold={currentPath === item.url}
                        class:text-primary={currentPath === item.url}>
                        {item.name}
                    </a>
                {/each}
            </nav>
            {#if authState.isLoggedIn}
                <UserInfo />
            {:else if showRegisterBtn}
                <button class="btn btn-sm btn-primary w-24 h-10 rounded-lg text-primary-content 
                    text-sm font-bold transition-all"
                    onclick={() => navigateToRegister()}>
                    Register
                </button>
            {:else}
                <button class="btn btn-sm btn-primary w-24 h-10 rounded-lg text-primary-content 
                    text-sm font-bold transition-all"
                    onclick={() => navigateToLogin()}>
                    Login
                </button>
            {/if}
        </div>
        <!-- collapsible menu do later-->
        <div class="md:hidden text-neutral">
            <span class="material-symbols-outlined">menu</span>
        </div>
    </div>
</header>

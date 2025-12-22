<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
    import '../../app.css';
    import { SquarePlusIcon } from '$lib/icons';
	import HeaderBar from '$lib/components/layout/HeaderBar.svelte';
    let { children } = $props();

</script>

<div class="space-y-4">
    <!-- <div class="flex justify-end items-center w-full mx-auto">
        {#if page.route.id === '/recipes'}
            <button class="btn btn-primary btn-sm md:btn-md w-36 font-semibold text-white"
                onclick={() => goto('/recipes/create')}>
                <SquarePlusIcon />
                Create
            </button>
        {/if}
    </div> -->
    <HeaderBar />
    <!-- child content -->
    {@render children?.()}
</div>

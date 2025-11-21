<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
    import '../../app.css';
    import { SquarePlusIcon } from '$lib/icons';
    let { children } = $props();

</script>

<div class="space-y-4">
    <div class="flex justify-end items-center w-full mx-auto">
        {#if page.route.id === '/recipes'}
            <!-- only show create button in index page -->
            <button class="btn btn-primary btn-sm md:btn-md w-36 font-semibold text-white"
                onclick={() => goto('/recipes/create')}>
                <SquarePlusIcon />
                Create
            </button>
        {/if}
    </div>

    <!-- child content -->
    {@render children?.()}
</div>

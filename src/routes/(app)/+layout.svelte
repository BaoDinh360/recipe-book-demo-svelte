<script lang="ts">
    import '../../app.css';
	import HeaderBar from '$lib/components/layout/HeaderBar.svelte';
	import { authState } from '$lib/states/auth state.svelte';
    let { data, children } = $props();

    // sync server locals.userInfo with UI global user state
    $effect.pre(() => {
        authState.currentUser = data.userInfo ?? null;
    })

</script>

<div class="min-h-screen">
    <HeaderBar />
    <!-- child content -->
    {@render children?.()}
</div>

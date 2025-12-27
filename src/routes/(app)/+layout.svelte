<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
    import '../../app.css';
    import { SquarePlusIcon } from '$lib/icons';
	import HeaderBar from '$lib/components/layout/HeaderBar.svelte';
    let { children } = $props();

</script>

<div class="">
    <HeaderBar />
    <!-- child content -->
    {@render children?.()}
</div>

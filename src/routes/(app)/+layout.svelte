<script lang="ts">
    import '../../app.css';
	import HeaderBar from '$lib/components/layout/HeaderBar.svelte';
    let { children } = $props();

</script>

<div class="min-h-screen">
    <HeaderBar />
    <!-- child content -->
    {@render children?.()}
</div>

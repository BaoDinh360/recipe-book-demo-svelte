<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NotificationArea from '$lib/components/shared/NotificationArea.svelte';

	let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Show notification -->
<NotificationArea />

<div class="bg-base-100 font-body text-deep-charcoal min-h-screen flex flex-col">
	{@render children?.()}
</div>

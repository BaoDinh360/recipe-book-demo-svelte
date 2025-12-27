<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NotificationArea from '$lib/components/shared/NotificationArea.svelte';
	import TopBarHeader from '$lib/components/layout/TopBarHeader.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Show notification -->
<NotificationArea />

<div class="bg-base-100 font-body text-deep-charcoal min-h-screen flex flex-col overflow-x-hidden">
	<!-- sidebar layout -->
	<!-- <Sidebar />
	<div class="flex-1 overflow-y-auto bg-gray-50">
		<TopBarHeader />
		<div class="p-4 md:px-8 md:pb-10 md:pt-6">
			{@render children?.()}
		</div>
	</div> -->

	{@render children?.()}
</div>

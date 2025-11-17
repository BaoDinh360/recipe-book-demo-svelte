<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NotificationArea from '$lib/components/NotificationArea.svelte';
	import { BookOpenTextIcon, ChefHatIcon, HouseHeartIcon } from '$lib/icons';
	import TopBarHeader from '$lib/components/TopBarHeader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Show notification -->
<NotificationArea />

<!-- sidebar layout -->
<div class="flex min-h-screen">
	<!-- left sidebar collapsible -->
	<div id="sidebar" class="w-60 bg-indigo-600 text-white flex-shrink-0 flex flex-col p-4 shadow-2xl 
		sticky top-0 h-screen hidden md:flex transition-all duration-300">
		<!-- App title -->
		<a href="/" class="text-2xl font-extrabold mb-8 pt-2 overflow-hidden whitespace-nowrap">
			<div class="flex items-center gap-1 lg:gap-2">
				<BookOpenTextIcon class="h-6 w-6" />
				Recipe Book
			</div>	
		</a>
		<!-- Menu -->
		<ul class="menu p-0 space-y-1 flex-grow flex flex-col gap-3">
			<li class="rounded-lg">
				<a href="/" class="text-white font-semibold flex items-center gap-4 p-3">
					<HouseHeartIcon class="h-5 w-5 flex-shrink-0" />
					<span class="sidebar-title overflow-hidden whitespace-nowrap">Home</span>
				</a>
			</li>
			<li class="rounded-lg">
				<a href="/recipes" class="text-white font-semibold flex items-center gap-4 p-3">
					<ChefHatIcon class="h-5 w-5 flex-shrink-0" />
					<span class="sidebar-title overflow-hidden whitespace-nowrap">Recipes</span>
				</a>
			</li>
		</ul>
	</div>
	<!-- top header bar -->
	<div class="flex-1 overflow-y-auto bg-gray-100">
		<TopBarHeader />
		<!-- children content -->
		<div class="p-4 md:px-8 md:pb-10 md:pt-8">
			{@render children?.()}
		</div>
	</div>
</div>

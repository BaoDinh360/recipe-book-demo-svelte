<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- sidebar layout -->
<div class="flex min-h-screen">
	<!-- left sidebar collapsible -->
	<div id="sidebar" class="w-60 bg-indigo-600 text-white flex-shrink-0 flex flex-col p-4 shadow-2xl 
		sticky top-0 h-screen hidden md:flex transition-all duration-300">
		<!-- App title -->
		<a href="/" class="text-2xl font-extrabold mb-8 pt-2 overflow-hidden whitespace-nowrap">
			Recipe Book
		</a>
		<!-- Menu -->
		<ul class="menu p-0 space-y-1 flex-grow flex flex-col gap-3">
			<li class="rounded-lg">
				<a href="/" class="text-white font-semibold flex items-center gap-4 p-3">
					<!-- Icon for Home -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
					<span class="sidebar-title overflow-hidden whitespace-nowrap">Home</span>
				</a>
			</li>
			<li class="rounded-lg">
				<a href="/recipes" class="text-white font-semibold flex items-center gap-4 p-3">
					<!-- Icon for Home -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
					<span class="sidebar-title overflow-hidden whitespace-nowrap">Recipe</span>
				</a>
			</li>
		</ul>
	</div>
	<!-- children content -->
	<div class="flex-1 p-4 md:p-10 overflow-y-auto">
		{@render children?.()}
	</div>
</div>

<!-- {@render children?.()} -->

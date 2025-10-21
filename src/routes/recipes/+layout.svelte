<script lang="ts">
    import '../../app.css';
    let { children } = $props();
</script>

<div class="navbar bg-gray-50 rounded-xl shadow-md mb-8 w-full mx-auto border-b border-gray-100">
    <div class="flex flex-row items-center gap-8">
        <div class="flex">
            <h1 class="font-bold text-gray-700 ml-4 text-xl">Recipes</h1>
        </div>
        <div class="flex items-center gap-3 p-2">
            <a href="/recipes" class="btn btn-ghost text-indigo-700 hover:bg-gray-200 text-lg">
                List
            </a>
            <a href="/recipes/create" class="btn btn-ghost text-indigo-700 hover:bg-gray-200 font-semibold text-lg">
                Create
            </a>
        </div>
    </div>
</div>

{@render children?.()}
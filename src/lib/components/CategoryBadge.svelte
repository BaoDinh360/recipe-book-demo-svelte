<script lang="ts">
	import type { RecipeCategory } from "$lib/recipe-types";
	import { getCategoryColorStyle } from "$lib/utils/category-style";
    let { category }: {
        category: RecipeCategory
    } = $props();
    let categoryStyleClass = $derived(getCategoryColorStyle(category));
</script>

<span class="p-4 badge badge-lg font-semibold {categoryStyleClass}">
    {category}
</span>
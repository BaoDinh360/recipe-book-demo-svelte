<script lang="ts">
    import { twMerge } from 'tailwind-merge';
	import { clsx } from 'clsx';
	import { getCategoryColorStyle } from "$lib/utils/category-style";
	import type { RecipeCategory } from '$lib/types/recipe-types';
    let { class: className = '', category, ...rest }: {
        category: RecipeCategory,
        class?: string,
    } = $props();
    let categoryStyleClass = $derived(getCategoryColorStyle(category));

    const baseStyleClass = $derived(`p-4 badge badge-lg font-semibold text-base ${categoryStyleClass}`)
    const finalClass = $derived(twMerge(clsx(baseStyleClass, className)));
</script>

<span class={finalClass} {...rest}>
    {category}
</span>
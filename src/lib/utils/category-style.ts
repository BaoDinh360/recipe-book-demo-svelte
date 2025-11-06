import type { RecipeCategory } from "$lib/recipe-types";

// mapping category with style class
const categoryColorMap: Record<RecipeCategory, string> = {
    'Breakfast': 'bg-amber-100 text-amber-700',
    'Lunch': 'bg-emerald-100 text-emerald-700',
    'Dinner': 'bg-blue-100 text-blue-700',
    'Desserts': 'bg-pink-100 text-pink-700'
};

export const getCategoryColorStyle = (category: RecipeCategory) => {
    return categoryColorMap[category] || 'bg-neutral-100 text-gray-700';
};
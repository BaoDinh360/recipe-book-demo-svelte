import type { SelectOption } from "./types";

export const categoryOptions: SelectOption[] = [
    {label: 'Breakfast', value: 'Breakfast'},
    {label: 'Lunch', value: 'Lunch'},
    {label: 'Dinner', value: 'Dinner'},
    {label: 'Desserts', value: 'Desserts'},
];

export const sortingOptions: SelectOption[] = [
    {label: 'Oldest', value: 'created'},
    {label: 'Latest', value: '-created'}
];

// pagination
export const DEFAULT_START_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 4;

const ITEMS_PER_PAGE_ARR = [4, 8, 12];
export const itemsPerPageOptions: SelectOption[] = ITEMS_PER_PAGE_ARR.map((item) => ({
    label: item.toString(),
    value: item
}));

// menu navbar items
export const NAV_MENU_ITEMS = [
    { name: 'Browse Recipes', url: '#' },
    { name: 'My Recipes', url: '/my-recipes' },
    { name: 'Meal Planner', url: '#' },
    { name: 'Create recipe', url: '/recipes/create' }
]
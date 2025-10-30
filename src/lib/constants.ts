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

const ITEMS_PER_PAGE_ARR = [3, 6, 9];
export const itemsPerPageOptions: SelectOption[] = ITEMS_PER_PAGE_ARR.map((item) => ({
    label: item.toString(),
    value: item
}));
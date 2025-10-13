import type { SelectOption } from "./types";

export const categoryOptions: SelectOption[] = [
        {label: 'Breakfast', value: 'Breakfast'},
        {label: 'Lunch', value: 'Lunch'},
        {label: 'Dinner', value: 'Dinner'},
        {label: 'Desserts', value: 'Desserts'},
    ];
export const sortingOptions: SelectOption[] = [
    {label: 'Oldest', value: 'DATE_ASC'},
    {label: 'Latest', value: 'DATE_DESC'}
];
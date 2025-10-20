export interface Recipe {
    id: string;
    recipeCode: string;
    title: string;
    description: string;
    instructions: string[];
    prepTimeMin: number;
    category: RecipeCategory;
    dateCreated: Date;
}

export type RecipeCategory = 
    'Breakfast' | 
    'Lunch' |
    'Dinner' |
    'Desserts';


export enum FormState {
    ADD = 'ADD',
    EDIT = 'EDIT'
};

export type SelectOption = {
    label: string,
    value: string | number | object,
}

export type FilterCriteria = {
    category: string | null;
    prepTimeMin: number | null;
    sortBy: SortCriteria;
};

export type SortCriteria = 'DATE_ASC' | 'DATE_DESC';
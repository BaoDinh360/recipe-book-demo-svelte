
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

export enum PageType {
    INDEX,
    DETAIL,
    CREATE,
    EDIT
};
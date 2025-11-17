
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
    EDIT,
    DEFAULT,
};

export type RecipeFormErrors = {
    title: string | undefined,
    category: string | undefined,
    prepTimeMin: string | undefined
};

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T
};
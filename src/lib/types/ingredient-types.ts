
// pocketbase full ingredients record
export interface IngredientPbRecord {
    id: string;
    code: string;
    name: string;
    unit: string;
    // pocketbase generated props
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
}

export interface IngredientSelect {
    id: string;
    code: string;
    name: string;
    unit: string;
};
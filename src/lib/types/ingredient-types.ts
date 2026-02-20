import type { IngredientsResponse } from "./pocketbase-types";


// base ingredient domain type
export type IngredientBase = IngredientsResponse;

// ingredients dropdown select
export type IngredientSelect = Pick<IngredientBase, 'id' | 'code' | 'name' | 'unit'>;

// export interface IngredientPbRecord {
//     id: string;
//     code: string;
//     name: string;
//     unit: string;
//     // pocketbase generated props
//     collectionId: string;
//     collectionName: string;
//     created: string;
//     updated: string;
// }

// export interface IngredientSelect {
//     id: string;
//     code: string;
//     name: string;
//     unit: string;
// };
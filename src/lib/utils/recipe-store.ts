// import type { Recipe } from "$lib/types";

// const STORAGE_KEYS = 'recipes';

// // helper functions
// export const fetchRecipesData = (): Recipe[] => {
//     if(typeof window === 'undefined'){
//         // handle SSR
//         return[];
//     }
//     // handle client side
//     let result: Recipe[] = [];
//     try {
//         const savedRecipes = localStorage.getItem(STORAGE_KEYS);
//         if (savedRecipes) {
//             console.log('localStorage has recipe data. Loading from localStorage');
//             const parsed: Recipe[] = JSON.parse(savedRecipes);
//             // hydrated localStorage parsed result, JSON lose Date() class type
//             const hydrated = parsed.map(p => ({
//                 ...p,
//                 dateCreated: new Date(p.dateCreated)
//             }));
//             result = hydrated;
//         }
//         else {
//             console.log('localStorage has no data. Return emtpy data');
//         }
//     } catch (error) {
//         console.warn('Invalid recipes data found in localStorage. Clearing localStorage');
//         localStorage.removeItem('recipes');
//     }
//     return result;
// }
// export const persistRecipesData = (recipes: Recipe[]) => {
//     if(typeof window === 'undefined'){
//         // handle SSR
//         return;
//     }
//     localStorage.setItem('recipes', JSON.stringify(recipes));
//     console.log('recipe persisted to localStorage');
// }
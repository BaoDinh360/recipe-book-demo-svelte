import { POCKETBASE_HOST } from '$env/static/private';
import PocketBase from 'pocketbase';

const pocketbaseHost = POCKETBASE_HOST;

export const pocketbaseClient: PocketBase = new PocketBase(pocketbaseHost);

// collection names
export const RECIPES = 'recipes';
export const INGREDIENTS = 'ingredients';
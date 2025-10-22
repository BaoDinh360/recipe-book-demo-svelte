<script lang="ts">
    import { goto } from "$app/navigation";
	import RecipeForm from "$lib/components/RecipeForm.svelte";
	import type { CreateRecipeData } from "$lib/recipe-types";
	import { createRecipe } from "$lib/utils/recipe-service";

    // path: /recipes/create/

    const onCreateRecipe = async(recipeData: CreateRecipeData): Promise<void> => {
        console.log('recipeData received: ', recipeData);
        try {
            // create recipe
            const created = await createRecipe(recipeData);
            if(created !== null) {
                // temp: use toast msg later
                console.log('Create new recipe success: ', created);
                // go back to index /recipes page
                await goto('/recipes');
            }
            else {
                console.log('Failed to create recipe, return null');
            }
        } catch (error) {
            console.error('Failed to create recipe: ', error);
        }
    }
    const onCancel = () => {
        // redirect to index /recipes 
        goto('/recipes');
    }

</script>

<RecipeForm 
    onSubmit={onCreateRecipe}
    {onCancel}/>

<style>

</style>
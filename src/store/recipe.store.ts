import {
  createRecipe,
  deleteRecipe,
  getRecepis,
  updateRecipe as updateRecipeAction, // ✅ переименовал, чтобы не конфликтовало с методом стора
} from '@/actions/recipe';
import { IRecipe } from '@/types/recipe';
import { create } from 'zustand';

interface IActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

interface IRecipeState {
  recipes: IRecipe[];
  isLoading: boolean;
  error: string | null;
  loadRecipes: () => Promise<void>;
  addRecipe: (formData: FormData) => Promise<IActionResult>;
  updateRecipe: (id: string, formData: FormData) => Promise<IActionResult>;
  removeRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<IRecipeState>((set) => ({
  recipes: [],
  isLoading: false,
  error: null,

  loadRecipes: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await getRecepis();

      if (result.success) {
        set({ recipes: result.recipes || [], isLoading: false });
      } else {
        set({
          error: result.error || 'Failed to load recipes',
          isLoading: false,
        });
      }
    } catch (error) {
      console.log('error', error);
      set({ error: 'Failed to load recipes', isLoading: false });
    }
  },

  addRecipe: async (formData: FormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createRecipe(formData);

      if (result.success) {
        set((state) => ({
          recipes: [...state.recipes, result.recipe!],
          isLoading: false,
        })); // к текущему рецепту добавляем новый рецепт

        return { success: true, recipe: result.recipe };
      } else {
        set({
          error: result.error || 'Failed to add recipe',
          isLoading: false,
        });
        return {
          success: false,
          error: result.error || 'Failed to add recipe',
        };
      }
    } catch (error) {
      console.log('error', error);
      set({ error: 'Failed to add recipe', isLoading: false });
      return { success: false, error: 'Failed to add recipe' };
    }
  },

  updateRecipe: async (id: string, formData: FormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await updateRecipeAction(id, formData);

      if (result.success) {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id ? result.recipe! : recipe
          ),
          isLoading: false,
        }));

        return { success: true, recipe: result.recipe };
      } else {
        set({
          error: result.error || 'Failed to update recipe',
          isLoading: false,
        });
        return {
          success: false,
          error: result.error || 'Failed to update recipe',
        };
      }
    } catch (error) {
      console.log('error', error);
      set({ error: 'Failed to update recipe', isLoading: false });
      return { success: false, error: 'Failed to update recipe' };
    }
  },

  removeRecipe: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteRecipe(id);

      if (result.success) {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
          isLoading: false,
        }));
      } else {
        set({
          error: result.error || 'Failed to delete recipe',
          isLoading: false,
        });
      }
    } catch (error) {
      console.log('error', error);
      set({ error: 'Failed to delete recipe', isLoading: false });
    }
  },
}));

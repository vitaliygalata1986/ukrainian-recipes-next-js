import { createIngredint, deleteIngredient, getIngredients } from '@/actions/ingredient';
import { IIngredient } from '@/types/ingredient';
import { create } from 'zustand';

interface IngredientStore {
  ingredients: IIngredient[];
  isLoading: boolean;
  error: string | null;
  loadIngredients: () => Promise<void>;
  addIngredient: (formData: FormData) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
}

// метод set - позволяет обновлять состояние стора

export const useIngredientStore = create<IngredientStore>((set) => ({
  // зададим нач. состояния нашего стора
  ingredients: [],
  isLoading: false,
  error: null,

  // метод для загрузки ингредиентов
  loadIngredients: async () => {
    set({ isLoading: true, error: null }); // обнулим ошибку и поставим загрузку в true
    try {
      const result = await getIngredients();
      if (result.success) {
        // так как мы возвращали return { success: true, ingredients } в getIngredients;
        // если успех, то обновляем состояние стора
        set({ ingredients: result.ingredients, isLoading: false });
      } else {
        set({
          error: result.error || 'Failed to load ingredients',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error loading ingredients:', error);
      set({ error: 'Failed to load ingredients', isLoading: false });
    }
  },
  addIngredient: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createIngredint(formData);
      if (result.success) {
        set((state) => ({
          ingredients: [...state.ingredients, result.ingredient],
          isLoading: false,
        }));
      } else {
        set({
          error: result.error || 'Failed to add ingredient',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error adding ingredient:', error);
      set({ error: 'Failed to add ingredient', isLoading: false });
    }
  },
  removeIngredient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await deleteIngredient(id);
      if (result.success) {
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id
          ),
          isLoading: false,
        }));
      } else {
        set({
          error: result.error || 'Failed to delete ingredient',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      set({ error: 'Failed to delete ingredient', isLoading: false });
    }
  },
}));

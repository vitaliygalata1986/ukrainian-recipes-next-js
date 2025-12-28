'use client';

import RecipeForm from '@/forms/recipe.form';
import { useRecipeStore } from '@/store/recipe.store';
import { IRecipe } from '@/types/recipe';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const { recipes, isLoading, error } = useRecipeStore();
  const [recipe, setRecipe] = useState<IRecipe | null>(null); // рецепт, который мы хотим отредактировать
  const [hasSearched, setHasSearched] = useState(false); // флаг, чтобы избежать бесконечного цикла

  useEffect(() => {
    if (recipes.length > 0 || error) {
      const foundRecipe = recipes.find((r) => r.id === id) || null;
      setRecipe(foundRecipe || null);
      setHasSearched(true);
    }
  }, [recipes, id, error]);

  if (isLoading) {
    return <div className="text-center">Завантаження рецепту...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500">Помилка: {error}</div>;
  }
  if (hasSearched && !recipe) {
    // если поиск завершен и рецепт не найден
    return <div className="text-center text-red-500">Рецепт не знайдено.</div>;
  }
  if (recipe) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          Редагувати рецепт {recipe.name}
        </h1>
        <RecipeForm initialRecipe={recipe} />
      </div>
    );
  }
  return <p className='text-center'>Завантаження...</p>
};

export default EditRecipePage;

// рецепт, который мы хотим отредактировать мы будем искать по его id

// https://www.youtube.com/watch?v=KZb53sf-PEg&t=2437s 3-10-44

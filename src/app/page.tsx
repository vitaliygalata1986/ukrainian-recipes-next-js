'use client';

import { useRecipeStore } from '@/store/recipe.store';
import Link from 'next/link';
import { Button } from '@heroui/react';
import RecipeCard from '@/components/common/recipe-cards';

export default function Home() {
  const { recipes, isLoading, error } = useRecipeStore();

  return (
    <>
      <div className="flex w-full justify-center items-center mb-4">
        <Link href="/recipes/new">
          <Button color="primary">Додати рецепт</Button>
        </Link>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {isLoading && <div>Завантаження рецептів...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </>
  );
}

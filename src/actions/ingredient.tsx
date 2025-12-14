'use server';

import { ingredientSchema } from '@/schema/zod';
import { prisma } from '@/utils/prisma';
import { ZodError } from 'zod';

export async function createIngredint(formData: FormData) {
  // try catch нужен для того, чтобы отловить ошибку
  try {
    // console.log('formData', formData);
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
      pricePerUnit: formData.get('pricePerUnit')
        ? parseFloat(formData.get('pricePerUnit') as string)
        : null,
      description: formData.get('description'),
    };
    // далее провалидируем наши данные
    const validatedData = ingredientSchema.parse(data);

    // дальше выполняем асинхронный запрос
    const ingredient = await prisma.ingredient.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        unit: validatedData.unit,
        pricePerUnit: validatedData.pricePerUnit,
        description: validatedData.description,
      },
    });

    return { success: true, ingredient }; // будем возвращать ответ
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.issues.map((e) => e.message).join(', ') };
    }
    console.error('Error creating ingredint:', error);
    return { error: 'Error creating ingredint' };
  }
}

// функция для получения всех ингредиентов из базы данных и отправки их на клиент
export async function getIngredients() {
  try {
    // обращаексь к базе данных через prisma client и получаем все ингредиенты, используя метод findMany (ingredient - это модель в нашей базе данных)
    const ingredients = await prisma.ingredient.findMany();
    return { success: true, ingredients };
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return { error: 'Error fetching ingredients' };
  }
}

// удаление ингредиента по id
export async function deleteIngredient(id: string) {
  try {
    const ingredient = await prisma.ingredient.delete({
      where: { id }, // удаляем по id, where - условие удаления
    });
    return { success: true, ingredient };
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return { error: 'Error deleting ingredient' };
  }
}

/*
  as в TypeScript — это оператор приведения типа (type assertion).
  Он говорит компилятору: «поверь мне, я знаю, что тут именно такой тип». 
  Тоесть as string — это утверждение типа: «отныне относись к этому значению как к строке».
*/

'use server';

import { prisma } from '@/utils/prisma';

// получим полный список рецептов
export async function getRecepis() {
  try {
    // нам нужно не только получить таблицу рецептов, но и связанные с ними ингредиенты

    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    return { success: true, recipes };
  } catch (error) {
    console.error('Error fetching recipes:', error);

    return { success: false, error: 'Error fetching recipes' };
  }
}

// создание нового рецепта
export async function createRecipe(formData: FormData) {
  try {
    // получим из FormaData нужные поля
    const name = formData.get('name') as string; // имя рецепта
    const description = formData.get('description') as string; // описание рецепта
    const imageUrl = formData.get('imageUrl') as string | null; // URL изображения рецепта

    // дальше нужно получить ингредиенты
    // нам ненужны все поля FormData, а только те, которые относятся к ингредиентам
    const ingredients = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('ingredient_'))
      .map(([key, value]) => ({
        ingredientId: value as string,
        quantity: parseFloat(
          formData.get(`quantity_${key.split('_')[1]}`) as string
        ),
      }));
    // проверим что имя рецепта и ингредиенты переданы
    if (!name || ingredients.length === 0) {
      return { success: false, error: 'Name and ingredients are required' };
    }

    // создадим рецепт вместе с ингредиентами
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        imageUrl,
        ingredients: {
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return { success: true, recipe };
  } catch (error) {
    console.error('Error creating recipe:', error);
    return { success: false, error: 'Error creating recipe' };
  }
}

// обновление рецепта
export async function updateRecipe(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string | null;

    const ingredients = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('ingredient_'))
      .map(([key, value]) => ({
        ingredientId: value as string,
        quantity: parseFloat(
          formData.get(`quantity_${key.split('_')[1]}`) as string
        ),
      }));
    if (!name || ingredients.length === 0) {
      return { success: false, error: 'Name and ingredients are required' };
    }

    // сначала удалим все старые ингредиенты рецепта
    // const resipe = await prisma.recipeIngredient.deleteMany({
    //   where: { recipeId: id },
    // });
    // затем обновим сам рецепт
    const recipe = await prisma.recipe.update({
      where: { id }, // при обновлении указываем id рецепта
      data: {
        name,
        description,
        imageUrl,
        ingredients: {
          deleteMany: { recipeId: id }, // удаляем старые ингредиенты (тоесть удаляем связи в таблице recipe_ingredients)
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: {
        // для работы со связями сразу подтягиваем ингредиенты
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return { success: true, recipe };
  } catch (error) {
    console.error('Error updating recipe:', error);
    return { success: false, error: 'Error updating recipe' };
  }
}

// удаление рецепта
export async function deleteRecipe(id: string) {
  try {
    // при удалении рецепта сначала удалим связанные ингредиенты
    // recipeIngredient - это связующая таблица между рецептами и ингредиентами
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });
    // затем удалим сам рецепт
    await prisma.recipe.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return { success: false, error: 'Error deleting recipe' };
  }
}

// Твой запрос делает SELECT из таблицы recipe, и сразу “подтягивает” связанные записи через связи Prisma.

/*
  1) prisma.recipe.findMany()
     Возвращает массив всех рецептов (все строки из таблицы recipes).

     Концептуально:
     SELECT * FROM recipes;

  2) include: { ingredients: ... }
     Prisma дополнительно загружает relation-поле Recipe.ingredients.

     Важно:
     ingredients в модели Recipe — это НЕ колонка в таблице recipes.
     Это виртуальная связь Prisma, которая “смотрит” на таблицу recipe_ingredients
     (на записи RecipeIngredient, где recipeId = recipes.id).

     То есть для каждого recipe Prisma подтянет массив строк из recipe_ingredients:
     [
       { id, recipeId, ingredientId, quantity, ... },
       ...
     ]

  3) include внутри ingredients: { ingredient: true }
     Это второй уровень include:
     для КАЖДОЙ строки из recipe_ingredients Prisma также подтянет связанную запись Ingredient
     по ingredientId -> ingredients.id.

     То есть итоговая структура будет такая:
     recipes = [
       {
         id,
         name,
         description,
         imageUrl,
         ingredients: [
           {
             id,              // id из recipe_ingredients
             recipeId,
             ingredientId,
             quantity,
             ingredient: {    // объект из таблицы ingredients
               id,
               name,
               category,
               unit,
               pricePerUnit,
               description,
               ...
             }
           },
           ...
         ]
       },
       ...
     ]

  4) Что это даёт на практике
     Ты получаешь сразу готовый вложенный JSON “Рецепт -> список ингредиентов -> данные ингредиента”,
     не делая ручных запросов в цикле (это защищает от N+1).

  5) Сколько SQL-запросов реально выполняется?
     Prisma может сделать:
       - либо несколько запросов (например: recipes -> recipe_ingredients -> ingredients),
       - либо join'ы (зависит от версии Prisma и оптимизаций).
     Но логика всегда одна: собрать связи через recipe_ingredients и вложить их в результат.

  6) Если тебе нужно вывести “чистый список ингредиентов” без обёртки RecipeIngredient
     (то есть не ingredients: [{ quantity, ingredient: {...}}], а просто ingredients: [{...}]),
     то это уже надо будет преобразовать вручную в JS/TS после запроса
     (потому что quantity лежит именно в связующей таблице).
*/

/*
// тоесть мы сначала берем все рецепты, потом у каждого рецепта забираем связанные ингридиенты, сами связанные ингридиенты берем по id -> ingredientId и собираем всеэто в вложенный объект.

1) Берём все Recipe из recipes.

2) Для каждого рецепта подтягиваем его строки из recipe_ingredients (модель RecipeIngredient) по recipeId = recipe.id.
Это даёт ingredientId и quantity.

По каждому ingredientId подтягиваем Ingredient из ingredients и Prisma вкладывает его внутрь соответствующей строки RecipeIngredient как поле ingredient.

То есть структура такая:
Recipe → RecipeIngredient (quantity, ingredientId) → Ingredient (name, unit, …)
*/

/*
Разбор:
    const ingredients = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith('ingredient_')
    );

    Эта строка берёт все поля из FormData, превращает их в массив пар [key, value], и оставляет только те пары, у которых имя поля (key) начинается с "ingredient_".

Разберём по частям:

1) formData.entries()
FormData хранит поля как “словарь” (ключ → значение).
entries() возвращает итерируемый список пар:
for (const [key, value] of formData.entries()) {
  // key: string
  // value: FormDataEntryValue (string | File)
}

Пример (если в форме было так):

    name = "Borscht"
    description = "..."
    ingredient_0_id = "uuid1"
    ingredient_0_quantity = "200"
    ingredient_1_id = "uuid2"
    ingredient_1_quantity = "50"

    То entries() даст примерно:
    [
        ["name", "Borscht"],
        ["description", "..."],
        ["ingredient_0_id", "uuid1"],
        ["ingredient_0_quantity", "200"],
        ["ingredient_1_id", "uuid2"],
        ["ingredient_1_quantity", "50"],
    ]

    2) Array.from(...)
        entries() — это не массив, а iterable.
        Array.from() превращает его в обычный массив, чтобы можно было делать .filter(), .map() и т.д.
    
    3) .filter(([key]) => key.startsWith('ingredient_'))
        filter оставляет только те элементы, где ключ начинается с "ingredient_".
        То есть после фильтра останется:    
    [
        ["ingredient_0_id", "uuid1"],
        ["ingredient_0_quantity", "200"],
        ["ingredient_1_id", "uuid2"],
        ["ingredient_1_quantity", "50"],
    ]

    4) .map(...) превращает каждую пару в объект { ingredientId, quantity }
    Итог: что получается в ingredients
    В итоге ingredients становится массивом вроде:
    [
        { ingredientId: "uuid1", quantity: 200 },
        { ingredientId: "uuid2", quantity: 50 },
    ]   


*/

/*
const recipe = await prisma.recipe.create({
  data: {
    name,
    description,
    imageUrl,
    ingredients: {
      create: ingredients.map(({ ingredientId, quantity }) => ({
        ingredient: { connect: { id: ingredientId } },
        quantity,
      })),
    },
  },
  include: {
    ingredients: { include: { ingredient: true } },
  },
});

Шаг A: создаётся строка в recipes:
    name, description, image_url

Шаг B: Prisma создаёт строки в recipe_ingredients (по одной на каждый элемент массива)
Для каждого { ingredientId, quantity } ты делаешь:

{
  ingredient: { connect: { id: ingredientId } },
  quantity
}

Это означает:
    не создавать новый Ingredient
    а подключить существующий Ingredient по id
    и записать quantity в recipe_ingredients

    То есть в recipe_ingredients появится примерно:
        (id=..., recipeId=<новый рецепт>, ingredientId=<uuid1>, quantity=200)
        (id=..., recipeId=<новый рецепт>, ingredientId=<uuid2>, quantity=50)

        
*/

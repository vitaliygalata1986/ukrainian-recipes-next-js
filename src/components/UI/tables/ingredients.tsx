'use client';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { useAuthStore } from '@/store/auth.store';
import { useIngredientStore } from '@/store/ingredient.store';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

const IngredientsTable = () => {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore();
  const { isAuth } = useAuthStore();

  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  const getCategoryLabel = (value: string) => {
    const option = CATEGORY_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getUnitLabel = (value: string) => {
    const option = UNIT_OPTIONS.find((unit) => unit.value === value);
    return option ? option.label : value;
  };

  if(!isAuth){
    return <p>Не авторизовано</p>;
  }

  // если у нас идет загрузка или пользователь не авторизован, показываем сообщение об отсутствии доступа
  return !isLoading && isAuth ? (
    <Table
      aria-label="Список інгредієнтів"
      classNames={{
        wrapper: 'mt-4',
        table: 'w-full',
        th: 'text-black',
        td: 'text-black',
      }}
    >
      <TableHeader>
        <TableColumn>Назва</TableColumn>
        <TableColumn>Категорія</TableColumn>
        <TableColumn>Одиниця виміру</TableColumn>
        <TableColumn>Ціна за одиницю</TableColumn>
        <TableColumn>Опис</TableColumn>
        <TableColumn>Дії</TableColumn>
      </TableHeader>
      <TableBody>
        {ingredients.map((ingredient) => (
          <TableRow key={ingredient.id}>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{getCategoryLabel(ingredient.category)}</TableCell>
            <TableCell>{getUnitLabel(ingredient.unit)}</TableCell>
            <TableCell>
              {ingredient.pricePerUnit !== null
                ? `${ingredient.pricePerUnit} ₴`
                : '-'}
            </TableCell>
            <TableCell>{ingredient.description || '-'}</TableCell>
            <TableCell>
              <Button
                className="danger"
                onPress={() => handleDelete(ingredient.id)}
                size="sm"
              >
                Видалити
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p className="mt-4 text-center text-black">
      Немає доступу до інгредієнтів. Будь ласка, авторизується.
    </p>
  );
};

export default IngredientsTable;

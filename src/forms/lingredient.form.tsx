'use client';

import { useState } from 'react';
import { Form, Input, Select, SelectItem, Button } from '@heroui/react';
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';

const IngredientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    pricePerUnit: null as number | null,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Form className="w-[400px]" onSubmit={handleSubmit}>
      <Input
        isRequired
        aria-label="Name"
        name="name"
        placeholder="Введіть назву інгредієнта"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        validate={(value) => {
          if (!value) return "Назва інгредієнта обов'язкова";
          return null;
        }}
      />
      <div className="flex gap-2 w-full">
        <div className="w-1/3">
          <Select
            isRequired
            aria-label="Category"
            name="category"
            placeholder="Виберіть категорію"
            selectedKeys={formData.category ? [formData.category] : []}
            classNames={{
              trigger: 'bg-default-100 w-full',
              innerWrapper: 'text-sm',
              value: 'text-sm',
              selectorIcon: 'text-black',
            }}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} className="text-black">
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-1/3">
          <Select
            isRequired
            name="unit"
            aria-label="Unit"
            placeholder="Виберіть одиницю виміру"
            selectedKeys={formData.unit ? [formData.unit] : []}
            classNames={{
              trigger: 'bg-default-100 w-full',
              innerWrapper: 'text-sm',
              value: 'text-sm',
              selectorIcon: 'text-black',
            }}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            {UNIT_OPTIONS.map((option) => (
              <SelectItem key={option.value} className="text-black">
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-1/3">
          <Input
            isRequired
            aria-label="Ціна"
            name="pricePerUnit"
            placeholder="Ціна"
            type="number"
            value={
              formData.pricePerUnit !== null
                ? formData.pricePerUnit.toString()
                : ''
            }
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null;
              setFormData({ ...formData, pricePerUnit: value });
            }}
            endContent={
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                ₴
              </span>
            }
            classNames={{
              inputWrapper: 'bg-default-100',
              input: 'text-sm focus:outline-none',
            }}
            validate={(value) => {
              if (!value) return "Ціна обов'язкова";
              const num = parseFloat(value);
              if (isNaN(num) || num < 0) return 'Ціна повинна бути позитивною';
              return null;
            }}
          />
        </div>
      </div>

      <Input
        aria-label="Опис"
        name="description"
        placeholder="Введіть опис (необов'язково)"
        type="text"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
      />
      <div className="flex w-full justify-end items-center">
        <Button className="primary" type="submit">
          Додати інгредієнт
        </Button>
      </div>
    </Form>
  );
};

export default IngredientForm;

// name - название ингредиента
// category - категория ингредиента
// unit - единица измерения
// pricePerUnit - цена за единицу здесь мы явно указываем TS что pricePerUnit может быть number, когда цена введена, или null когда оно пустое
// без этого TS могбы определить тип any как null
// description - описание

/*
  selectedKeys в <Select> — это проп, который говорит компоненту: «какие элементы сейчас выбраны».
  По сути это аналог value у обычного <select>, только в виде набора ключей.

  У каждого <SelectItem> есть key={option.value}.
  Проп selectedKeys принимает список (на самом деле Iterable) этих ключей.
  Когда в formData.category есть значение (например "meat"), ты передаёшь ["meat"] → селект показывает, что пункт с key="meat" выбран.
  Когда formData.category пустой, ты передаёшь [] → ничего не выбрано, показывается placeholder.

  То есть:
    selectedKeys делает компонент контролируемым: выбранное значение полностью определяется состоянием formData.category.
    При изменении выбора в onChange ты сохраняешь новый category в formData, и в следующий рендер selectedKeys уже содержит новый ключ → Select перерисовывается с новым выбранным значением.
*/

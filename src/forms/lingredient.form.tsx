'use client';

import { useState, useTransition } from 'react';
import { Input, Select, SelectItem, Button, Form } from '@heroui/react'; // Form убрали
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { createIngredint } from '@/actions/ingredient';

const initialState = {
  name: '',
  category: '',
  unit: '',
  pricePerUnit: null as number | null,
  description: '',
};

const IngredientForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialState);

  const [isPending, startTransition] = useTransition(); // позволяет управлять отложенными обновлениями состояния
  // isPending - это булево значение, которое указывает, находится ли переход в ожидании.
  // startTransition - это функция, которая позволяет пометить обновление состояния как переход.

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createIngredint(formData);
      // formData здесь — не наш локальный стейт,
      // а объект FormData, который собрал HeroUI Form из всех полей (name="...").
      // Мы просто прокидываем его в server action createIngredint.

      if (result.error) {
        setError(result.error);
        alert('Помилка при створенні інгредієнта');
      } else {
        setError(null);
        // После успешного сохранения очищаем локальное состояние,
        // чтобы сбросить значения инпутов в UI.
        setFormData(initialState);
        alert('Інгредієнт успішно створено');
      }
    });
  };

  return (
    <Form className="w-[400px]" action={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
              value: 'truncate',
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
              value: 'truncate',
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
        <Button className="primary" type="submit" isLoading={isPending}>
          Додати інгредієнт
        </Button>
      </div>
    </Form>
  );
};

export default IngredientForm;

// name         – название ингредиента (строка, обязательное поле).
// category     – категория ингредиента; в БД это enum Category.
// unit         – единица измерения; в БД это enum Unit.
// pricePerUnit – цена за одну единицу (number | null).
// description  – описание ингредиента (опциональное поле).

/*
    Form из @heroui/react — это обёртка над обычным HTML-формом (<form>).
    Он поддерживает 2 способа работы:
    1) onSubmit={(e) => ...} — классический React:
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      ...
    };
    2) action={(formData: FormData) => ...} — удобный шорткат:
    HeroUI внутри сам делает:
      const formData = new FormData(event.currentTarget);
      props.action?.(formData);
    То есть, вместо того чтобы ловить event, делать new FormData(...) и париться,
    ты сразу получаешь готовый FormData объект.
    action — это колбэк, который получает FormData.

    2. Почему сигнатура именно (formData: FormData)
      Потому что HeroUI уже:
        перехватил submit,
        сделал preventDefault() за тебя,
        собрал все поля по name="..." в FormData.

        const handleSubmit = async (formData: FormData) => {
          await createIngredint(formData);
        };

      4. Связка с серверным действием (createIngredint)
        Сейчас у тебя схема такая:
        Form (HeroUI) в клиентском компоненте собирает FormData и вызывает твой handleSubmit.
        В handleSubmit ты вызываешь server action createIngredint(formData) — Next.js сам сделает запрос на сервер, выполнит код на сервере, и вернёт результат.
        То есть цепочка: поля формы → FormData → handleSubmit → createIngredint (на сервере)
*/

// В Next.js 15 можно передавать server actions напрямую в action формы,
// и они будут вызываться на сервере с тем же FormData.
// В нашем случае мы используем промежуточный handleSubmit,
// чтобы:
//   1) вызвать server action createIngredint(formData);
//   2) потом локально очистить форму в клиентском состоянии.

// Кратко по смыслу:
// formData: FormData в handleSubmit — это не твой useState, а браузерный FormData, который собрал <Form action={...}>.
// createIngredint — server action, который Next 15 умеет вызывать прямо из action={...}.
// Ты оборачиваешь его в свой handleSubmit, чтобы после сервера ещё и почистить локальный стейт (сбросить форму в UI).

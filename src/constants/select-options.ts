export const CATEGORY_OPTIONS = [
  { value: 'VEGETABLES', label: 'Овочі' },
  { value: 'FRUITS', label: 'Фрукти' },
  { value: 'MEAT', label: 'М’ясо' },
  { value: 'DAIRY', label: 'Молочні продукти' },
  { value: 'SPICES', label: 'Спеції' },
  { value: 'OTHER', label: 'Інше' },
] as const;

export const UNIT_OPTIONS = [
  { value: 'GRAMS', label: 'Грами' },
  { value: 'KILOGRAMS', label: 'Килограммы' },
  { value: 'LITERS', label: 'Літри' },
  { value: 'MILLILITESR', label: 'Мілілітри' },
  { value: 'PIECES', label: 'Штуки' },
] as const;

/*
    as const в TypeScript — это “const-утверждение” (const assertion). Оно говорит компилятору:
    “Считай это значение максимально буквальным и неизменяемым”.
*/

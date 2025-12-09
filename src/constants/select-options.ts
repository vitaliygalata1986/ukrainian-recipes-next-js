export const CATEGORY_OPTIONS = [
  { value: 'VEGETABLES', label: 'Усі' },
  { value: 'FRUITS', label: 'Китайська' },
  { value: 'MEAT', label: 'Iталійська' },
  { value: 'DAIRY', label: 'Японська' },
  { value: 'SPICES', label: 'Французька' },
  { value: 'OTHER', label: 'Бельгійська' },
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

import { handlers } from '@/auth/auth';

export const { GET, POST } = handlers;

// handlers - создают стандартные обработчики запросов (эндпоинты) (GET, POST) для маршрутов авторизации

// Пример:
// http://localhost:3000/api/auth/signin
// http://localhost:3000/api/auth/signout
// http://localhost:3000/api/auth/callback
// http://localhost:3000/api/auth/session

// get запрос используется для получения jwt токена и статуса аутентификации
// post запрос используется для входа / выхода и обновления сессии

/*
  создание файла route.js - это часть новой парадигмы Next JS, где API роуты определяются через get/post и других http методов из файла route.js

*/

import { getToken } from 'next-auth/jwt';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

export async function middleware(request: NextAuthRequest) {
  const { pathname } = request.nextUrl;
  // console.log(pathname); // about || ingredients
  // мы не можем здесь использовать isAuth так как midlleware исполняется на уровне сервера
  // поэтому будем вытаскивать jwt токен из куки
  const token = await getToken({ req: request });
  // дальше определим массив, содержащий защищённые роуты
  const protectedRoutes = ['/ingredients'];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // проверяем, начинается ли путь с одного из защищённых роутов
    // если токена нет в куках, редиректим на главную
    if (!token) {
      const url = new URL('/error', request.url); // создаём новый URL для редиректа на страницу ошибки
      url.searchParams.set(
        'message',
        'Недостатньо прав для перегляду цієї сторінки'
      ); // устанавливаем параметр сообщения
      return NextResponse.redirect(url); // выполняем редирект на страницу ошибки неавторизованного пользователя прерывая дальнейшую обработку запроса
    }
  }
  return NextResponse.next(); // если токен есть, продолжаем обработку запроса
}

// объявим конфиг для middleware
export const config = {
  matcher: ['/ingredients'], // указываем пути, на которые будет срабатывать middleware
};

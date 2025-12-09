'use client';

import { siteConfig } from '@/config/site.config';
import { usePathname } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

const PageContent = () => {
  const pathname = usePathname();
  // console.log(pathname); // /about
  const pageContent =
    siteConfig.pageContent[pathname as keyof typeof siteConfig.pageContent];

  if (!pageContent) {
    return <div>Страница не найдена</div>;
  }
  const cleanHtml = DOMPurify.sanitize(pageContent.content);
  // return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  return <div>{parse(cleanHtml)}</div>;
};

export default PageContent;

// Что такое typeof siteConfig.pageContent

/*
    siteConfig — это объект.
    typeof siteConfig в TypeScript даёт тип этого объекта.
    Соответственно:
        typeof siteConfig.pageContent
    — это тип объекта pageContent, что-то вроде:
    {
        '/': { content: string };
        '/ingredients': { content: string };
        '/about': { content: string };
    }
    (логически, то, что TS о нём знает).

    keyof берёт множество ключей типа-объекта.
    keyof typeof siteConfig.pageContent
    получится союз строковых литералов:
    '/' | '/ingredients' | '/about'
    То есть: “одна из этих строк”.
    Почему нужен as keyof ...
    usePathname() в Next.js типизирован как:
    const pathname: string;
    Для TypeScript это любой string, в том числе "lol" или "/some/other".
    Но объект siteConfig.pageContent знает только три ключа:
    '/' | '/ingredients' | '/about'
    Если написать просто:
    siteConfig.pageContent[pathname]
    TS ругается: “нельзя индексировать этим string, вдруг такого ключа нет”.
    Поэтому ты говоришь компилятору:
    «Поверь мне, pathname — это один из ключей pageContent»
    и явно приводишь тип:
    pathname as keyof typeof siteConfig.pageContent
    В итоге для TS индекс выглядит безопасным, и он даёт правильный тип:
    const pageContent: { content: string } | undefined

    Итог
        typeof siteConfig.pageContent → берём тип объекта.
        keyof ... → забираем ключи этого объекта ('/' | '/ingredients' | '/about').
        as keyof ... → утверждаем, что pathname принадлежит этому множеству ключей (убираем ошибку компиляции).
        Для JavaScript в рантайме это никак не влияет — только для TypeScript-типизации.
*/

/*
dangerouslySetInnerHTML - это такой атрибут, который позволяет нам вставить HTML внутрь нашего компонента (он есть в реакте и в next).
Позволяет вставлять html напрямую в DOM, минуя стандартное экранирование реакта.
*/

/*
1. DOMPurify.sanitize(pageContent.content)
    DOMPurify — это библиотека для защиты от XSS (cross-site scripting).
    DOMPurify.sanitize(html) делает примерно следующее:
      Удаляет <script> теги и другие опасные штуки.
      Срезает опасные атрибуты, типа onClick="...", onload="...", javascript:... в href и т.п.
      Оставляет только безопасные теги и атрибуты (по своему внутреннему white-list’у).
    В результате выдаёт безопасную HTML-строку, которую уже можно безопасно показывать пользователю.
  Пример:
    const dirtyHtml = '<img src=x onerror="alert(1)"><script>alert(2)</script><p>Hi</p>';
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
      // cleanHtml будет примерно: '<img src="x"><p>Hi</p>'
    
    Зачем это нужно: если pageContent.content приходит, например, из CMS/БД и туда может попасть что угодно, без очистки ты рискуешь позволить кому-то выполнить JS на странице пользователя.  
 
  2. parse(cleanHtml)
     html-react-parser — библиотека, которая:
      Берёт строку с HTML ('<p>Привет</p><strong>Мир</strong>')
      Разбирает её (парсит) в React-элементы (<p>Привет</p><strong>Мир</strong> как JSX)
  По сути это альтернатива:
     <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  Но:
    parse возвращает набор React-элементов, а не “сырой” HTML.
    С ними можно дальше работать как с обычным JSX (оборачивать в компоненты, подмешивать логику и т.д.).
    Пример:
      const cleanHtml = '<p><strong>Привет</strong>, мир!</p>';
      const reactNodes = parse(cleanHtml);

      // reactNodes — это уже ReactElement, который можно вернуть из компонента
      return <div>{reactNodes}</div>;

    В итоге:
      const cleanHtml = DOMPurify.sanitize(pageContent.content);
      return <div>{parse(cleanHtml)}</div>;
      
      Берём HTML-строку из конфигурации / CMS (pageContent.content).
      Очищаем её от всего опасного → cleanHtml.
      Парсим очищенную строку в React-ноды → parse(cleanHtml).
      Рендерим результат как обычный JSX.
        Так ты:
          и безопасен (DOMPurify),
          и удобен в React (html-react-parser вместо dangerouslySetInnerHTML).
*/

/*
  Что делает isomorphic-dompurify
    isomorphic-dompurify — обёртка над DOMPurify, которая:
    аккуратно работает и в Node (SSR), и в браузере, не падая при отсутствии window/document;
    на сервере использует безопасный вариант (часто через JSDOM или условную инициализацию);
    в браузере ведёт себя как обычный DOMPurify.
  То есть она “изоморфная” (универсальная): один и тот же импорт можно использовать и в клиентском, и в серверном коде, не боясь упасть.

  Почему dompurify ломался в Next
    Обычный dompurify из пакета 'dompurify' рассчитан на браузер и при подключении ожидает наличие window / document. Типичная ошибка в Next:
    ReferenceError: window is not defined
    или document is not defined
    В Next.js код:
      одновременно существует в двух мирах:
      серверный бандл (Node, без window/document)
      клиентский бандл (браузер)
      даже если компонент помечен 'use client', сам модуль с import DOMPurify from 'dompurify' может один раз выполняться на сервере при сборке/рендере.
    Если внутри библиотеки при import сразу делается что-то вроде:
      const windowObj = window;
      — на сервере это роняет всё приложение.
  Поэтому Next + чистый dompurify часто → ошибка про window/document is not defined.


  Тоесть с помощью этой библиотеки на сервере в момент выполения SSR будет использоваться JSDOM, тоесть некая эмуляция DOM, тоесть window/document в Node-среде.
в то время как в браузере будет использоваться обычная DOMPurify.
*/

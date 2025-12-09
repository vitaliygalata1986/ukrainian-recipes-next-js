'use client';

import { siteConfig } from '@/config/site.config';
import { usePathname } from 'next/navigation';

const Title = () => {
  const pathname = usePathname();
  //  console.log(pathname); // /about

  const currentNavItem = siteConfig.navItems.find(
    // find возращает первый элемент удовлетворяющий условию
    (item) => item.href === pathname
  );

  // console.log(currentNavItem); // {label: 'О нас', href: '/about'}

  const pageTitle = currentNavItem ? currentNavItem.label : siteConfig.title;

  // console.log(pageTitle); // О нас

  return (
    <div className="w-full flex justify-center my-6">
      <h1 className="text-3xl font-bold">{pageTitle}</h1>
    </div>
  );
};

export default Title;

'use client';

import { siteConfig } from '@/config/site.config';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from '@heroui/react';
import { i } from 'framer-motion/client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AcmeLogo = () => {
  return (
    <Image
      src="/window.svg"
      alt={siteConfig.title}
      width={26}
      height={26}
      priority
    />
  );
};

export default function Header() {
  const pathname = usePathname(); // http://localhost:3000/ingredients -> /ingredients
  // console.log(pathname);

  const getNavItems = () => {
    {
      return siteConfig.navItems.map((item) => {
        const isActive = item.href === pathname;
        return (
          <NavbarItem key={item.href}>
            <Link
              color="foreground"
              href={item.href}
              className={`px-3 py-1  ${
                isActive ? 'text-blue-500' : 'text-white'
              }
               hover:text-blue-300 hover:border
               hover:border-blue-300 rounded-md
               transition-all duration-200
                `}
            >
              {item.label}
            </Link>
          </NavbarItem>
        );
      });
    }
  };

  return (
    <Navbar className="bg-black text-white">
      <NavbarBrand>
        <Link href="/" className="flex gap-1 text-white">
          <AcmeLogo />
          <p className="font-bold text-inherit">{siteConfig.title}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {getNavItems()}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Логин</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Регистрация
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

'use client';

import { layoutConfig } from '@/config/layout.config';
import { siteConfig } from '@/config/site.config';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RegistrationModal from '../modals/registration.modal';
import { useEffect, useState } from 'react';
import LoginModal from '../modals/login.modal';
import { signOutFunc } from '@/actions/sign-out';
import { useAuthStore } from '@/store/auth.store';

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
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pathname = usePathname(); // http://localhost:3000/ingredients -> /ingredients
  // console.log(pathname);

  const { isAuth, session, status, setAuthState } = useAuthStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session, setAuthState]);

  // проверим статус сессии
  // const isAuth = status === 'authenticated';

  // console.log('session', session); // null
  // console.log('status', status); // 'unauthenticated' or 'authenticated'

  const handleSignOut = async () => {
    try {
      await signOutFunc();
    } catch (error) {
      console.log('error', error);
    }

    setAuthState('unauthenticated', null); // тоесть при выходе убираем сессию и устанавливаем статус unauthenticated
  };

  const getNavItems = () => {
    {
      return siteConfig.navItems
        .filter((item) => {
          // если пользователь навигирует на страницу ингредиентов, показываем этот пункт меню только если он авторизован
          // тоесть страница попадет в false и не отрендерится (тоесть не попадет в mapping)
          if (item.href === '/ingredients') {
            return isAuth;
          }
          return true;
        })
        .map((item) => {
          const isActive = item.href === pathname;
          return (
            <NavbarItem key={item.href}>
              <Link
                color="foreground"
                href={item.href}
                className={`px-3 py-1  
                ${isActive ? 'text-blue-500' : 'text-white'}
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
    <Navbar
      className="bg-black text-white"
      style={{ height: layoutConfig.headerHeight }}
    >
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
        {isAuth && <p>Привiт, {session?.user?.email}</p>}
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : !isAuth ? (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onPress={() => setIsLoginOpen(true)}
              >
                Логін
              </Button>
            </NavbarItem>

            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onPress={() => setIsRegistrationOpen(true)}
              >
                Реєстрація
              </Button>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem className="hidden lg:flex">
            <Button
              as={Link}
              color="primary"
              href="#"
              variant="flat"
              onPress={handleSignOut}
            >
              Вийти
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </Navbar>
  );
}

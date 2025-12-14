'use client';

import { useAuthStore } from '@/store/auth.store';
import { useIngredientStore } from '@/store/ingredient.store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface IProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {
  const { data: session, status } = useSession();
  const { isAuth, setAuthState } = useAuthStore();
  const { loadIngredients } = useIngredientStore();

  useEffect(() => {
    setAuthState(status, session); // устанавливаем состояние
  }, [status, session, setAuthState]);

  useEffect(() => {
    loadIngredients();
  }, [isAuth, loadIngredients]);

  return <>{children}</>;
};

export default AppLoader;

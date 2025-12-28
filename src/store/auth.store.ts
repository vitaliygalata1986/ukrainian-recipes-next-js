import type { Session } from 'next-auth';
import { create } from 'zustand';

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthState {
  isAuth: boolean;
  status: SessionStatus;
  session: Session | null; // внутри store будем хранить саму сессию которую получаем из next-auth (сессия )
  setAuthState: (status: SessionStatus, session: Session | null) => void; // метод установки состояния в наш store
}

// метод set - позволяет обновлять состояние стора

export const useAuthStore = create<AuthState>((set) => ({
  // зададим нач. состояния нашего стора
  isAuth: false,
  status: 'loading',
  session: null,
  setAuthState: (status, session) =>
    // в stor устанавливаем новое состояние
    set(() => ({
      isAuth: status === 'authenticated', // если статус аутентифицирован, то isAuth будет true
      status, // после этого перезаписываем статус на authenticated
      session, // и сохраняем сессию, которую мы получали из useSession
    })),
}));

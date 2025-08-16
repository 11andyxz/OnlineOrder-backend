import { create } from 'zustand';
import type { UserView } from '@api/types';

export interface AuthState {
  user: UserView | null;
  setUser: (u: UserView) => void;
  logout: () => void;
}

const localKey = 'online-ordering:user';

function loadUser(): UserView | null {
  try {
    const raw = localStorage.getItem(localKey);
    return raw ? (JSON.parse(raw) as UserView) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  setUser: (u) => {
    localStorage.setItem(localKey, JSON.stringify(u));
    set({ user: u });
  },
  logout: () => {
    localStorage.removeItem(localKey);
    set({ user: null });
  }
}));



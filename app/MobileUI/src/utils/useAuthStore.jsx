import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import { deleteItemAsync, getItem, setItem } from "expo-secure-store";

export const useAuthStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            hasCompletedOnboarding: false,
            isAdmin: false,
            user: null,

            logIn: () => {
                set((state) => ({
                    ...state,
                    isLoggedIn: true,
                }));
            },

            logInAsAdmin: () => {
                set((state) => ({
                    ...state,
                    isAdmin: true,
                    isLoggedIn: true,
                }));
            },

            logOut: () => {
                set((state) => ({
                    ...state,
                    isAdmin: false,
                    isLoggedIn: false,
                    user: null,
                }));
            },

            completeOnboarding: () => {
                set((state) => ({
                    ...state,
                    hasCompletedOnboarding: true,
                }));
            },

            resetOnboarding: () => {
                set((state) => ({
                    ...state,
                    hasCompletedOnboarding: false,
                }));
            },

            // ======================
            // AUTH / USER
            // ======================
            setUser: (userData) => {
                set({
                    user: userData
                });
            },
            clearUser: () => {
                set({
                    user: null
                });
            },
        }),

        {
            name: "auth-store",
            storage: createJSONStorage(() => ({
                setItem,
                getItem,
                removeItem: deleteItemAsync,
            })),
        }
    )
);

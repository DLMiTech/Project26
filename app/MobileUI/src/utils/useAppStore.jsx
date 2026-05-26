import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
    deleteItemAsync,
    getItem,
    setItem
} from "expo-secure-store";

export const useAppStore = create(
    persist(
        (set, get) => ({



            // ======================
            // ACCOUNT BALANCE
            // ======================
            balances: {
                savings: 0,
                current: 0,
                wallet: 0,
            },

            setBalances: (balances) => {
                set({
                    balances
                });
            },

            updateBalance: (account, amount) => {
                set((state) => ({
                    balances: {
                        ...state.balances,
                        [account]: amount
                    }
                }));
            },

            // ======================
            // TRANSACTIONS
            // ======================

            transactions: [],

            addTransaction: (transaction) => {
                set((state) => ({
                    transactions: [
                        transaction,
                        ...state.transactions
                    ]
                }));
            },

            clearTransactions: () => {
                set({
                    transactions: []
                });
            },

            // ======================
            // SETTINGS
            // ======================

            settings: {
                darkMode: false,
                notifications: true,
            },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        ...newSettings
                    }
                }));
            },

            // ======================
            // LOGOUT EVERYTHING
            // ======================
            resetApp: () => {
                set({
                    user: null,

                    balances: {
                        savings: 0,
                        current: 0,
                        wallet: 0,
                    },

                    transactions: [],

                    settings: {
                        darkMode: false,
                        notifications: true,
                    }
                });
            },

        }),

        {
            name: "app-store",

            storage: createJSONStorage(() => ({
                setItem,
                getItem,
                removeItem: deleteItemAsync,
            })),
        }
    )
);
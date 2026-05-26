import React, { createContext, useContext, useState } from "react";
import DLMToast from "./DLMToast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = ({ type, message, duration }) => {
        setToast({ type, message, duration });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {toast && (
                <DLMToast
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
};
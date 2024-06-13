import { createContext, useEffect, useState } from "react";

// Using context so we can share values without passing as props to any part of the application
export const DarkModeContext = createContext();

// serves as the provider for the DarkModeContext used to wrap other parts of the app
// so that any child component can access the dark mode state and functions it provides.
export const DarkModeContextProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(
        JSON.parse(localStorage.getItem('darkMode')) || false 
    )

    const toggle = () => {
        setDarkMode(!darkMode)
    }

    // Sets the localStorage to the current darkmde only when the darkmode changes
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode)
    },[darkMode])

    return (
        <DarkModeContext.Provider value={{darkMode, toggle}}>
            {children}
        </DarkModeContext.Provider> 
    )
}
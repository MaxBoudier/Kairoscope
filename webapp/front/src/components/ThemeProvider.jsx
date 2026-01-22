import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
})

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(storageKey) || defaultTheme
    })

    useEffect(() => {
        const root = window.document.documentElement

        // Helper to apply or remove the dark class
        const applyTheme = (isDark) => {
            root.classList.remove("light", "dark")
            if (isDark) {
                root.classList.add("dark")
            } else {
                // Optional: add 'light' class if needed by some styles, 
                // but usually removing 'dark' is enough for default
                root.classList.add("light")
            }
        }

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")

            applyTheme(systemTheme.matches)

            const listener = (e) => {
                applyTheme(e.matches)
            }

            systemTheme.addEventListener("change", listener)
            return () => systemTheme.removeEventListener("change", listener)
        } else {
            applyTheme(theme === "dark")
        }
    }, [theme])

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}

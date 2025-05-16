
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language";
import AppLayout from "./components/AppLayout";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AppLayout />
      </LanguageProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}

export default App;

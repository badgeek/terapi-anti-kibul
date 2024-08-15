import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import AplikasiTerapiAntiKibul from './components/antikibul'


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AplikasiTerapiAntiKibul />
    </ThemeProvider>
  )
}

export default App

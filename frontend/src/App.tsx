import { ThemeProvider, createTheme } from "@suid/material";
import Home from "./Home";
import { BackdropWrapper } from "./mgrui/lib/components/BackdropWrapper";

export default function App() {
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: "dark"
      }
    })}>
      <BackdropWrapper>
        <Home />
      </BackdropWrapper>
    </ThemeProvider>
  )
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { NavBar } from "./components/NavBar";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityPage } from "./pages/PriorityPage";
import { useReadStatus } from "./hooks/useReadStatus";
import { init } from "logging-middleware";
import { AUTH_TOKEN } from "./api/config";

init(AUTH_TOKEN);

const theme = createTheme({
  palette: { mode: "light", primary: { main: "#1976d2" } },
  typography: { fontFamily: "'Roboto', sans-serif" }
});

export default function App() {
  let readStatus = useReadStatus();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<NotificationsPage readStatus={readStatus} />} />
          <Route path="/priority" element={<PriorityPage readStatus={readStatus} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
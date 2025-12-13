import { Routes, Route } from "react-router-dom";
import { StockProvider } from "./context/StockContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PortfolioPage from "./pages/PortfolioPage";
import { LocaleProvider } from "./context/LocaleContextType";

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <StockProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="portfolio" element={<PortfolioPage />} />
            </Route>
          </Routes>
        </StockProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;

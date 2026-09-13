import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/i18n";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";
import ServicePage from "@/pages/ServicePage";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/services/:id" element={<ServicePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-center" />
    </LanguageProvider>
  );
}

import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import ModeSelection from "./pages/ModeSelection";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("app")!).render(
  <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModeSelection />} />
        <Route path="/single" element={<Game mode={'single'}/>} />
        <Route path="/double" element={<Game mode={'double'}/>} />
        {/* <Route path="/multi" element={<MultiGame />} />s */}
      </Routes>
    </BrowserRouter>
  </ToastProvider>
);
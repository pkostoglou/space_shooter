import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import ModeSelection from "./pages/ModeSelection";

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ModeSelection />} />
      <Route path="/single" element={<Game mode={'single'}/>} />
      <Route path="/double" element={<Game mode={'double'}/>} />
      {/* <Route path="/multi" element={<MultiGame />} />s */}
    </Routes>
  </BrowserRouter>
);
import React from "react";
import { createRoot } from "react-dom/client";
import RhythmCheck from "../RhythmCheck.tsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RhythmCheck />
  </React.StrictMode>
);

import { BrowserRouter } from "react-router-dom";
import Home from "./features/page";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between w-full">
        <Home />
      </div>
    </BrowserRouter>
  );
}
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/dashboard.tsx";
import History from "./pages/History.tsx";
import Statistics from "./pages/Statistics.tsx";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/statistics"
          element={<Statistics />}
        />

      </Routes>

    </BrowserRouter>
  );
}
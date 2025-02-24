import Authentication from "./components/Authentication";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

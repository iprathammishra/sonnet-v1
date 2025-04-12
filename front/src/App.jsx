import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; 
import DeviceWrapper from "./components/DeviceWrapper";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DeviceWrapper />} />
      <Route
        path="/:userId"
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

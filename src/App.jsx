import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import MotorcycleDetail from "./pages/MotorcycleDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMotorcycleForm from "./pages/AdminMotorcycleForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/bo-suu-tap" element={<Collection />} />
              <Route path="/xe/:id" element={<MotorcycleDetail />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/xe/moi"
                element={
                  <ProtectedRoute>
                    <AdminMotorcycleForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/xe/:id"
                element={
                  <ProtectedRoute>
                    <AdminMotorcycleForm />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

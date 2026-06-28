import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {
  Routes,
  Route
} from "react-router-dom";


import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Factures from "./pages/Factures";
import Settings from "./pages/Settings";
import ClientCreate from "./pages/ClientCreate";
import ClientEdit from "./pages/ClientEdit";
import CA from "./pages/CA";
import ProductCreate from "./pages/ProductCreate";
import Products from "./pages/Products";
import ProductEdit from './pages/ProductEdit';
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";




function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>

        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route

          path="/"

          element={

          <ProtectedRoute>

            <DashboardLayout />

          </ProtectedRoute>}

        >


        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="clients"
          element={<Clients />}
        />

        <Route
          path="factures"
          element={<Factures />}
        />

        <Route
          path="parametres"
          element={<Settings />}
        />

        <Route
          path="clientCreate"
          element={<ClientCreate />}
        />

        <Route
          path="clients/modifier/:id"
          element={
              <RoleRoute roles={["Administrateur","Responsable de production"]}>
                <ClientEdit />
              </RoleRoute>       
        }
        />

        <Route
          path="produits"
          element={<Products />}
        />

        <Route
          path="produits/nouveau"
          element={
                    <RoleRoute roles={["Administrateur","Responsable de production"]}>
                      <ProductCreate />
                    </RoleRoute>
                  }
        />

        <Route
          path="produits/modifier/:id"
          element={
                <RoleRoute roles={["Administrateur","Responsable de production"]}>
                  <ProductEdit />
                </RoleRoute>
            }
        />

        <Route 
          path="ca"
          element={<CA />}
        />

      </Route>

    </Routes>

  )
}

export default App

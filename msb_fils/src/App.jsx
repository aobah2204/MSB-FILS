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
import ProductDetails from './pages/ProductDetails'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import VehicleCreate from "./pages/VehicleCreate";
import VehicleEdit from "./pages/VehicleEdit";
import VehicleDetails from "./pages/VehicleDetails";
import ProductionChart from './components/ProductionChart';
import VenteChart from './components/VenteChart';
import AchatChart from './components/AchatChart';
import ProductionSites from "./pages/ProductionSites";
import ProductionSiteCreate from "./pages/ProductionSiteCreate";
import ProductionSiteDetails from "./pages/ProductionSiteDetails";
import Salaries from './pages/Salaries';
import SalarieCreate from './pages/SalarieCreate';
import SalarieEdit from './pages/SalarieEdit';
import Fournisseurs from './pages/Fournisseurs';
import FournisseurCreate from './pages/FournisseurCreate';
import FournisseurEdit from './pages/FournisseurEdit';

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
          </ProtectedRoute>}>


        <Route
          index
          element={<Dashboard />}
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
          path="clients"
          element={<Clients />}
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
          path="fournisseurs"
          element={<Fournisseurs />}
        />

        <Route
          path="fournisseurs/nouveau"
          element={<FournisseurCreate />}
        />

        <Route
          path="fournisseurs/modifier/:id"
          element={
              <RoleRoute roles={["Administrateur","Responsable de production"]}>
                <FournisseurEdit />
              </RoleRoute>       
          }
        />

        <Route 
          path="salaries"
          element={
            <RoleRoute roles={["Administrateur"]}>
              <Salaries />
            </RoleRoute> 
          }/>
        
        <Route 
          path="salaries/nouveau"
          element={
            <RoleRoute roles={["Administrateur"]}>
              <SalarieCreate />
            </RoleRoute>
          }/>
        
        <Route 
          path="salaries/modifier/:id"
          element={
            <RoleRoute roles={["Administrateur"]}>
              <SalarieEdit />
            </RoleRoute>
          }/>


        <Route
          path="produits"
          element={<Products />}
        />

        <Route
            path="produits/nouveau"
            element=
            {
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
          path="produits/details/:id"
          element={
                <ProductDetails />
            }
        />

        {/** Véhicules routes 
        <Route path="vehicules"> */}

          <Route path="vehicules"
            index
            element={<Vehicles />}
            />

          <Route
          path="vehicules/nouveau"
          element={<VehicleCreate />}
          />

          <Route
            path="vehicules/modifier/:id"
            element={<VehicleEdit />}
          />

          <Route
          path="vehicules/:id"
          element={<VehicleDetails />}
          />

        {/* Sites de production 
        <Route path="production-sites"> */}


          <Route path="production-sites"
            index
            element={<ProductionSites />}
          />


          <Route
            path="production-sites/nouveau"
            element={<ProductionSiteCreate />}
          />


          <Route
            path="production-sites/:id"
            element={<ProductionSiteDetails />}
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

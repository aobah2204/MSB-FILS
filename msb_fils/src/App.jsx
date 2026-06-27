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


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>

      <Route
        path="/"
        element={<DashboardLayout />}
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
          element={<ClientEdit />}
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

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
import ClientDetails from "./pages/ClientDetails";
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
import ProductionSiteEdit from "./pages/ProductionSiteEdit";
import ProductionSiteDetails from "./pages/ProductionSiteDetails";
import Salaries from './pages/Salaries';
import SalarieCreate from './pages/SalarieCreate';
import SalarieEdit from './pages/SalarieEdit';
import Fournisseurs from './pages/Fournisseurs';
import FournisseurCreate from './pages/FournisseurCreate';
import FournisseurEdit from './pages/FournisseurEdit';
import FournisseurDetails from './pages/FournisseurDetails';
import MatierePremiereCreate from './pages/MatierePremierCreate';
import MatierePremiereDetails from './pages/MatierePremiereDetails';
import MatierePremiereEdit from './pages/MatierePremiereEdit';
import MatieresPremieres from './pages/MatieresPremieres';
import Productions from './pages/Productions';
import ProductionCreate from './pages/ProductionCreate';
import ProductionEdit from './pages/ProductionEdit';
import ProductionDetails from './pages/ProductionDetails';
import Commandes from './pages/Commandes';
import CommandCreate from './pages/CommandCreate';
import CommandEdit from './pages/CommandEdit';
import CommandDetails from './pages/CommandDetails';
import Ventes from './pages/Ventes';
import VenteCreate from './pages/VenteCreate';
import VenteEdit from './pages/VenteEdit';
import VenteDetails from './pages/VenteDetails';
import Achats from './pages/Achats';
import AchatCreate from './pages/AchatCreate';
import AchatEdit from './pages/AchatEdit';
import AchatDetails from './pages/AchatDetails';
import Depenses from './pages/Depenses';
import DepenseCreate from './pages/DepenseCreate';
import DepenseDetails from './pages/DepenseDetails';
import Marchandises from './pages/Marchandises';
import MarchandiseCreate from './pages/MarchandiseCreate';
import MarchandiseEdit from './pages/MarchandiseEdit';
import MarchandiseDetails from './pages/MarchandiseDetails';
import Livraisons from './pages/Livraisons';
import LivraisonCreate from './pages/LivraisonCreate';
import LivraisonEdit from './pages/LivraisonEdit';
import LivraisonDetails from './pages/LivraisonDetails';
import PlanBuilder from './pages/PlanBuilder';

import Prestations from './pages/Prestations';
import PrestationCreate from './pages/PrestationCreate';
import PrestationEdit from './pages/PrestationEdit';
import PrestationDetails from './pages/PrestationDetails';

// ISSA DISTRIBUTION 
import IssaProduits from './pages/ISSA_DISTRIBUTION/IssaProduits';
import IssaProduitCreate from './pages/ISSA_DISTRIBUTION/IssaProduitCreate';
import IssaProduitEdit from './pages/ISSA_DISTRIBUTION/IssaProduitEdit';
import IssaProduitDetails from './pages/ISSA_DISTRIBUTION/IssaProduitDetails';



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
          path="clients/details/:id"
          element={<ClientDetails />}
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
              <RoleRoute roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}>
                <FournisseurEdit />
              </RoleRoute>       
          }
        />

        <Route
          path="fournisseurs/details/:id"
          element={<FournisseurDetails />}
        />

        <Route 
          path="salaries"
          element={
            <RoleRoute roles={["Administrateur", "Superviseur", "Coordinateur"]}>
              <Salaries />
            </RoleRoute> 
          }/>
        
        <Route 
          path="salaries/nouveau"
          element={
            <RoleRoute roles={["Administrateur", "Superviseur", "Coordinateur"]}>
              <SalarieCreate />
            </RoleRoute>
          }/>
        
        <Route 
          path="salaries/modifier/:id"
          element={
            <RoleRoute roles={["Administrateur", "Superviseur", "Coordinateur"]}>
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
              <RoleRoute roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}>
                <ProductCreate />
              </RoleRoute>
            }
        />

        <Route
          path="produits/modifier/:id"
          element={
                <RoleRoute roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}>
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

        {/** Matière premieres */}
        <Route
          path="matierespremieres"
          element={<MatieresPremieres />}
        />

        <Route
            path="matierespremieres/nouveau"
            element=
            {
              <RoleRoute roles={["Administrateur","Responsable de production",  "Superviseur", "Coordinateur"]}>
                <MatierePremiereCreate />
              </RoleRoute>
            }
        />

        <Route
          path="matierespremieres/modifier/:id"
          element={
                <RoleRoute roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}>
                  <MatierePremiereEdit />
                </RoleRoute>
            }
        />

        <Route
          path="matierespremieres/details/:id"
          element={
                <MatierePremiereDetails />
            }
        />

        {/** Productions routes */}
        <Route path="productions">
          <Route index element={<Productions />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<ProductionCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<ProductionEdit />} />
          <Route path="details/:id"
                element={<ProductionDetails />} />
        </Route>

        {/** Commandes routes */}
        <Route path="commandes">
          <Route index element={<Commandes />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<CommandCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<CommandEdit />} />
          <Route path="details/:id"
                element={<CommandDetails />} />
        </Route>

        {/** Ventes routes */}
        <Route path="ventes">
          <Route index element={<Ventes />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<VenteCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<VenteEdit />} />
          <Route path="details/:id"
                element={<VenteDetails />} />
        </Route>

        {/** Achats routes */}
        <Route path="achats">
          <Route index element={<Achats />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<AchatCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<AchatEdit />} />
          <Route path="details/:id"
                element={<AchatDetails />} />
        </Route>

        {/** Marchandises routes */}
        <Route path="marchandises">
          <Route index element={<Marchandises />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<MarchandiseCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<MarchandiseEdit />} />
          <Route path="details/:id"
                element={<MarchandiseDetails />} />
        </Route>

        {/** Livraisons routes */}
        <Route path="livraisons">
          <Route index element={<Livraisons />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<LivraisonCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<LivraisonEdit />} />
          <Route path="details/:id"
                element={<LivraisonDetails />} />
        </Route>

        {/** Prestations */}
        <Route path="prestations">
          <Route index element={<Prestations />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<PrestationCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<PrestationEdit />} />
          <Route path="details/:id"
                element={<PrestationDetails />} />
        </Route>

        {/** ISSA DISTRIBUTION */}
        <Route path="issaproduits">
          <Route index element={<IssaProduits />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<IssaProduitCreate />} />
          <Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<IssaProduitEdit />} />
          <Route path="details/:id"
                element={<IssaProduitDetails />} />
        </Route>

        {/** Plan builder routes */}
        <Route path="planbuilder">
          <Route index element={<PlanBuilder />} />          
        </Route>

        <Route path="depenses">
          <Route index element={<Depenses />} />
          <Route path="nouveau"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur", "Commercial"]}
                element={<DepenseCreate />} />
          {/*<Route path="modifier/:id"
                roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
                element={<DepenseEdit />} />*/}
          <Route path="details/:id"
                element={<DepenseDetails />} />
        </Route>

        {/** Véhicules routes 
        <Route path="vehicules"> */}

          <Route path="vehicules"
            index
            element={<Vehicles />}
            />

          <Route
          path="vehicules/nouveau"
          roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
          element={<VehicleCreate />}
          />

          <Route
            path="vehicules/modifier/:id"
            roles={["Administrateur","Responsable de production", "Superviseur", "Coordinateur"]}
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
            roles={["Administrateur", "Superviseur", "Coordinateur"]}
            element={<ProductionSiteCreate />}
          />

          <Route
            path="production-sites/modifier/:id"
            roles={["Administrateur", "Superviseur", "Coordinateur"]}
            element={<ProductionSiteEdit />}          
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

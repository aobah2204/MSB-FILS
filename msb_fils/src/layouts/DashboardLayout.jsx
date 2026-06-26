import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Outlet
} from "react-router-dom";


import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">

        <Header />

        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
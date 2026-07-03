import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, Pencil, Trash2, HandCoins } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

function Ventes() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);

  async function loadData() {
    const [{ data: salesData }, { data: clientsData }] = await Promise.all([
      supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
      supabase.from("clients").select("id, nom, prenom"),
    ]);

    setSales(salesData || []);
    setClients(clientsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteSale(sale) {
    if (!window.confirm("Supprimer cette vente ?")) return;

    await supabase.from("venteproduits").delete().eq("vente_id", sale.id);
    const { error } = await supabase.from("ventes").delete().eq("id", sale.id);

    if (error) {
      alert("Suppression impossible : " + error.message);
      return;
    }

    loadData();
  }

  const clientMap = Object.fromEntries(clients.map((client) => [client.id, `${client.nom} ${client.prenom}`]));

  async function ClientFullName(id){
    const client = await supabase.from("clients").select("nom, prenom").eq("id",id);
    return client.nom + " "+ client.prenom

  }

  return (
    <div className="product-page">
      <h1>Liste des ventes</h1>

      {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur'].includes(user?.role) && (
        <div>
          <NavLink to="/ventes/nouveau">
            <button className="profile" type="button">
              <HandCoins size={20} /> Nouvelle vente
            </button>
          </NavLink>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Mode paiement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.reference || "—"}</td>
                <td>{clientMap[sale.client_id] || "—"}</td>
                <td>{sale.date_vente || "—"}</td>
                <td>{sale.montant_total || 0}</td>
                <td>{sale.mode_paiement || "—"}</td>
                <td>
                  <NavLink to={`/ventes/details/${sale.id}`}>
                    <button className="profile" type="button"><Eye size={20} /></button>
                  </NavLink>
                  {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur'].includes(user?.role) && (
                    <>
                      <NavLink to={`/ventes/modifier/${sale.id}`}>
                        <button className="profile" type="button"><Pencil size={20} /></button>
                      </NavLink>
                      <button className="profileSupp" type="button" onClick={() => deleteSale(sale)}>
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ventes;

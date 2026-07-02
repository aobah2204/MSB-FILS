import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

function Commandes() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);

  async function loadData() {
    const [{ data: ordersData }, { data: clientsData }] = await Promise.all([
      supabase.from("commandes").select("*").order("date_commande", { ascending: false }),
      supabase.from("clients").select("id, nom"),
    ]);

    setOrders(ordersData || []);
    setClients(clientsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteOrder(order) {
    if (!window.confirm("Supprimer cette commande ?")) return;

    await supabase.from("commandeproduits").delete().eq("commande_id", order.id);
    const { error } = await supabase.from("commandes").delete().eq("id", order.id);

    if (error) {
      alert("Suppression impossible : " + error.message);
      return;
    }

    loadData();
  }

  const clientMap = Object.fromEntries(clients.map((client) => [client.id, client.nom]));

  return (
    <div className="product-page">
      <h1>Liste des commandes</h1>

      {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur'].includes(user?.role) && (
        <div>
          <NavLink to="/commandes/nouveau">
            <button className="profile" type="button">
              <ShoppingCart size={20} /> Nouvelle commande
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
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.reference || "—"}</td>
                <td>{clientMap[order.client_id] || "—"}</td>
                <td>{order.date_commande || "—"}</td>
                <td>{order.montant_total || 0}</td>
                <td>{order.statut || "En cours"}</td>
                <td>
                  <NavLink to={`/commandes/details/${order.id}`}>
                    <button className="profile" type="button"><Eye size={20} /></button>
                  </NavLink>
                  {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur'].includes(user?.role) && (
                    <>
                      <NavLink to={`/commandes/modifier/${order.id}`}>
                        <button className="profile" type="button"><Pencil size={20} /></button>
                      </NavLink>
                      <button className="profileSupp" type="button" onClick={() => deleteOrder(order)}>
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

export default Commandes;

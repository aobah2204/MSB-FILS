import { Eye, Pencil, Trash2, Package } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from "react";
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";

function Achats() {
  const { user } = useAuth();
  const [achatsList, setAchatsList] = useState([]);

  useEffect(() => {
    loadAchats();
  }, []);

  async function loadAchats() {
    try {
      const { data } = await supabase
        .from("achats")
        .select("*, fournisseurs(nom,prenom)")
        .order("created_at", { ascending: false });

      if (!data) return alert("Aucun achat");
      setAchatsList(data);
    } catch (error) {
      console.error("Erreur lors du chargement des achats :", error);
    }
  }

  async function deleteAchat(achat) {
    if (confirm("Supprimer cet achat ?")) {
      try {
        // Delete cascade: achats cascade to achatmatierepremieres
        await supabase.from("achats").delete().eq("id", achat.id);
        await loadAchats();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  return (
    <div className="product-page">

      <h1>Liste des achats</h1>
      {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur", "Commercial"].includes(
        user?.role
      ) && (
        <section>
          <div>
            <NavLink to="/achats/nouveau">
              <button className="profile">
                <Package size={20} /> Nouvel achat
              </button>
            </NavLink>
          </div>
        </section>
      )}

      <br/>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Fournisseur</th>
              <th>Date</th>
              <th>Montant total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {achatsList.map((achat) => (
              <tr key={achat.id}>
                <td>{achat.reference || "—"}</td>
                <td>{achat.fournisseurs?.nom + " "+ achat.fournisseurs?.prenom || "—"}</td>
                <td>{formatDate(achat.date_achat) || "—"}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(achat.montant_total) || 0 } FG</td>
                <td>{achat.statut || "—"}</td>
                {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur", "Commercial"].includes(
                  user?.role
                ) && (
                  <td>
                    <NavLink to={`/achats/details/${achat.id}`}>
                      <button className="profile">
                        <Eye size={20} />
                      </button>
                    </NavLink>
                    <NavLink to={`/achats/modifier/${achat.id}`}>
                      <button className="profile">
                        <Pencil size={20} />
                      </button>
                    </NavLink>
                    <button className="profileSupp" onClick={() => deleteAchat(achat)}>
                      <Trash2 size={20} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Achats;

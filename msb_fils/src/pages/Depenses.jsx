import { Eye, Pencil, Trash2, Package } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from "react";
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";

function Depenses() {
  const { user } = useAuth();
  const [DepensesList, setDepensesList] = useState([]);

  useEffect(() => {
    loadDepenses();
  }, []);

  async function loadDepenses() {
    try {
      const { data } = await supabase
        .from("Depenses")
        .select("*, fournisseurs(nom,prenom), siteproduction(nom, adresse), vehicules(immatriculation, marque)")
        .order("created_at", { ascending: false });

      if (!data) return alert("Aucun Dépense");
      setDepensesList(data);
    } catch (error) {
      console.error("Erreur lors du chargement des Dépenses :", error);
    }
  }

  async function deleteDepense(Depense) {
    if (confirm("Supprimer cette Depense ?")) {
      try {
        // Delete cascade: Depenses cascade to Depensematierepremieres
        await supabase.from("Depenses").delete().eq("id", Depense.id);
        await loadDepenses();
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

      <h1>Liste des Dépenses</h1>
      {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur"].includes(
        user?.role
      ) && (
        <section>
          <div>
            <NavLink to="/depenses/nouveau">
              <button className="profile">
                <Package size={20} /> Nouvelle Dépense
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
              <th>catégorie</th>
              <th>libelle</th>
              <th>Element associé</th>
              <th>Montant total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {DepensesList.map((Depense) => (
              <tr key={Depense.id}>
                <td>{Depense.reference || "—"}</td>
                <td>{Depense.categorie}</td>
                <td>{Depense.libelle}</td>
                {Depense.fournisseurs?.nom && <td>{Depense.fournisseurs?.nom} {Depense.fournisseurs?.prenom}</td>}
                {Depense.fournisseurs?.nom && <td>{Depense.fournisseurs?.nom} {Depense.fournisseurs?.prenom}</td>}
                {Depense.fournisseurs?.nom && <td>{Depense.fournisseurs?.nom} {Depense.fournisseurs?.prenom}</td>}
                <td>{formatDate(Depense.date_depense) || "—"}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(Depense.montant_total) || 0 } FG</td>
                <td>{Depense.statut || "—"}</td>
                {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur"].includes(
                  user?.role
                ) && (
                  <td>
                    <NavLink to={`/Depenses/details/${Depense.id}`}>
                      <button className="profile">
                        <Eye size={20} />
                      </button>
                    </NavLink>
                    <NavLink to={`/Depenses/modifier/${Depense.id}`}>
                      <button className="profile">
                        <Pencil size={20} />
                      </button>
                    </NavLink>
                    <button className="profileSupp" onClick={() => deleteDepense(Depense)}>
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

export default Depenses;

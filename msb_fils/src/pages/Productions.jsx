import { Pencil, Trash2, Package, Eye } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase.js";
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";

function Productions() {
  const { user } = useAuth();
  const [productionsList, setProductionsList] = useState([]);

  useEffect(() => {
    chargerProductions();
  }, []);

  async function chargerProductions() {
    try {
      await getAllProductions();
    } catch (error) {
      console.error("Erreur lors du chargement des productions :", error);
    }
  }

  async function getAllProductions() {
    const { data: productionsData } = await supabase
      .from("productions")
      .select("*")
      .order("dateproduction", { ascending: false });

    if (!productionsData || productionsData.length === 0) {
      setProductionsList([]);
      return;
    }

    const { data: sitesData } = await supabase.from("siteproduction").select("id, nom");
    const { data: productsData } = await supabase.from("products").select("id, nom");

    const siteMap = Object.fromEntries((sitesData || []).map((site) => [site.id, site.nom]));
    const productMap = Object.fromEntries((productsData || []).map((product) => [product.id, product.nom]));

    const formattedProductions = productionsData.map((production) => ({
      ...production,
      siteName: siteMap[production.site_id] || "—",
      productName: productMap[production.produit_id] || "—",
    }));

    setProductionsList(formattedProductions);
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  async function DeleteProduction(production) {
    if (!window.confirm("Supprimer cette production ?")) return;

    const { error: materialsError } = await supabase
      .from("materielproduction")
      .delete()
      .eq("production_id", production.id);

    if (materialsError) {
      alert("Erreur lors de la suppression des matériaux : " + materialsError.message);
      return;
    }

    const { error } = await supabase.from("productions").delete().eq("id", production.id);

    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      return;
    }

    await getAllProductions();
  }

  return (
    <div className="product-page">
      {['Administrateur', 'Responsable de production'].includes(user?.role) && (
        <section>
          <div>
            <NavLink to="/productions/nouveau">
              <button className="profile">
                <Package size={20} /> Nouvelle Production
              </button>
            </NavLink>
          </div>
        </section>
      )}

      <h2>Liste des productions</h2>

      <div className="table-container">
        <table className="data-table">
          <thead className="headerTable">
            <tr className="header_Table">
              <th>Site</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Date</th>
              <th>Coût total production</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {productionsList.map((production) => (
              <tr key={production.id}>
                <td>{production.siteName}</td>
                <td>{production.productName}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(production.quantite)}</td>
                <td>{formatDate(production.dateproduction)}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(production.cout_total)} FG</td>
                

                <td>
                  <NavLink to={`/productions/details/${production.id}`}>
                    <button className="profile" type="button">
                      <Eye size={20} />
                    </button>
                  </NavLink>

                  {['Administrateur', 'Responsable de production'].includes(user?.role) && (
                    <NavLink to={`/productions/modifier/${production.id}`}>
                      <button className="profile" type="button">
                        <Pencil size={20} />
                      </button>
                    </NavLink>
                  )}

                  {['Administrateur', 'Responsable de production'].includes(user?.role) && (
                    <button
                      className="profileSupp"
                      type="button"
                      onClick={() => DeleteProduction(production)}
                    >
                      <Trash2 size={20} />
                    </button>
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

export default Productions;
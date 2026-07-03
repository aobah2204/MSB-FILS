import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function CommandDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [productLines, setProductLines] = useState([]);

  async function loadOrder() {
    const { data, error } = await supabase.from("commandes").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Commande introuvable");
      navigate("/commandes");
      return;
    }

    setOrder(data);

    if (data.client_id) {
      const { data: clientData } = await supabase.from("clients").select("nom").eq("id", data.client_id).maybeSingle();
      setClient(clientData);
    }

    const { data: linesData } = await supabase
      .from("commandeproduits")
      .select("*, products(nom,unite)")
      .eq("commande_id", id);

    setProductLines(linesData || []);
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de la commande {id}</h1>
      <div className="card" style={{textAlign: "left"}}>
        <p><strong>Référence :</strong> {order.reference || "—"}</p>
        <p><strong>Client :</strong> {client?.nom || "—"}</p>
        <p><strong>Date :</strong> {formatDate(order.date_commande) || "—"}</p>
        <p><strong>Statut :</strong> {order.statut || "—"}</p>
        <p><strong>Description :</strong> {order.description || "—"}</p>
      </div>

      <h3>Produits commandés</h3>
      {productLines.length === 0 ? (
        <p>Aucun produit.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Unité</th>
                <th>Prix unitaire</th>
                <th>Total ligne</th>
              </tr>
            </thead>
            <tbody>
              {productLines.map((line) => (
                <tr key={line.id}>
                  <td>{line.products?.nom || "—"}</td>
                  <td>{line.quantite || 0}</td>
                  <td>{line.products?.unite || "—"}</td>
                  <td>{new Intl.NumberFormat("fr-FR").format(line.prix_unitaire) || 0} FG</td>
                  <td>{new Intl.NumberFormat("fr-FR").format(line.montant_ligne) || 0} FG</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
        <p><strong>Montant total :</strong> {new Intl.NumberFormat("fr-FR").format(order.montant_total) || 0} FG</p>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/commandes")}>Retour</button>
    </div>
  );
}

export default CommandDetails;

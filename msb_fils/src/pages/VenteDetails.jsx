import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function VenteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [client, setClient] = useState(null);
  const [productLines, setProductLines] = useState([]);

  async function loadSale() {
    const { data, error } = await supabase.from("ventes").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Vente introuvable");
      navigate("/ventes");
      return;
    }

    setSale(data);

    if (data.client_id) {
      const { data: clientData } = await supabase.from("clients").select("nom").eq("id", data.client_id).maybeSingle();
      setClient(clientData);
    }

    const { data: linesData } = await supabase
      .from("venteproduits")
      .select("*, products(nom)")
      .eq("vente_id", id);

    setProductLines(linesData || []);
  }

  useEffect(() => {
    loadSale();
  }, [id]);

  if (!sale) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de la vente</h1>
      <div className="card">
        <p><strong>Référence :</strong> {sale.reference || "—"}</p>
        <p><strong>Client :</strong> {client?.nom || "—"}</p>
        <p><strong>Date :</strong> {sale.date_vente || "—"}</p>
        <p><strong>Mode de paiement :</strong> {sale.mode_paiement || "—"}</p>
        <p><strong>Description :</strong> {sale.description || "—"}</p>
      </div>

      <h3>Produits vendus</h3>
      {productLines.length === 0 ? (
        <p>Aucun produit.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total ligne</th>
              </tr>
            </thead>
            <tbody>
              {productLines.map((line) => (
                <tr key={line.id}>
                  <td>{line.products?.nom || "—"}</td>
                  <td>{line.quantite || 0}</td>
                  <td>{line.prix_unitaire || 0}</td>
                  <td>{line.montant_ligne || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
        <p><strong>Montant total :</strong> {sale.montant_total || 0}</p>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/ventes")}>Retour</button>
    </div>
  );
}

export default VenteDetails;

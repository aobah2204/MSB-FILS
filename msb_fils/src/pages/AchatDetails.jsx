import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function AchatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [achat, setAchat] = useState(null);
  const [fournisseur, setFournisseur] = useState(null);
  const [productLines, setProductLines] = useState([]);

  async function loadAchat() {
    const { data, error } = await supabase.from("achats").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Achat introuvable");
      navigate("/achats");
      return;
    }

    setAchat(data);

    if (data.fournisseur_id) {
      const { data: fournisseurData } = await supabase
        .from("fournisseurs")
        .select("nom")
        .eq("id", data.fournisseur_id)
        .maybeSingle();
      setFournisseur(fournisseurData);
    }

    const { data: linesData } = await supabase
      .from("achatmatierepremieres")
      .select("*, matierespremieres(nom)")
      .eq("achat_id", id);

    setProductLines(linesData || []);
  }

  useEffect(() => {
    loadAchat();
  }, [id]);

  if (!achat) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de l'achat {id}</h1>
      <div className="card">
        <p>
          <strong>Référence :</strong> {achat.reference || "—"}
        </p>
        <p>
          <strong>Fournisseur :</strong> {fournisseur?.nom || "—"}
        </p>
        <p>
          <strong>Date :</strong> {achat.date_achat || "—"}
        </p>
        <p>
          <strong>Statut :</strong> {achat.statut || "—"}
        </p>
        <p>
          <strong>Description :</strong> {achat.description || "—"}
        </p>
      </div>

      <h3>Matières premières achetées</h3>
      {productLines.length === 0 ? (
        <p>Aucune matière.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total ligne</th>
              </tr>
            </thead>
            <tbody>
              {productLines.map((line) => (
                <tr key={line.id}>
                  <td>{line.matierespremieres?.nom || "—"}</td>
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
        <p>
          <strong>Montant total :</strong> {achat.montant_total || 0}
        </p>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/achats")}>
        Retour
      </button>
    </div>
  );
}

export default AchatDetails;

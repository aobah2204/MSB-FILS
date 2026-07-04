import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function DepenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Depense, setDepense] = useState(null);
  const [fournisseur, setFournisseur] = useState(null);
  const [productLines, setProductLines] = useState([]);

  async function loadDepense() {
    const { data, error } = await supabase.from("Depenses").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Depense introuvable");
      navigate("/Depenses");
      return;
    }

    setDepense(data);

    if (data.fournisseur_id) {
      const { data: fournisseurData } = await supabase
        .from("fournisseurs")
        .select("nom")
        .eq("id", data.fournisseur_id)
        .maybeSingle();
      setFournisseur(fournisseurData);
    }

    const { data: linesData } = await supabase
      .from("Depensematierepremieres")
      .select("*, matierespremieres(nom)")
      .eq("Depense_id", id);

    setProductLines(linesData || []);
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  useEffect(() => {
    loadDepense();
  }, [id]);

  if (!Depense) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de l'Depense {id}</h1>
      <div className="card" style={{textAlign: "left"}}>
        <p>
          <strong>Référence :</strong> {Depense.reference || "—"}
        </p>
        <p>
          <strong>Fournisseur :</strong> {fournisseur?.nom || "—"}
        </p>
        <p>
          <strong>Date :</strong> {formatDate(Depense.date_Depense) || "—"}
        </p>
        <p>
          <strong>Statut :</strong> {Depense.statut || "—"}
        </p>
        <p>
          <strong>Description :</strong> {Depense.description || "—"}
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
                  <td>{new Intl.NumberFormat("fr-FR").format(line.quantite) || 0}</td>
                  <td>{new Intl.NumberFormat("fr-FR").format(line.prix_unitaire) || 0} FG</td>
                  <td>{new Intl.NumberFormat("fr-FR").format(line.montant_ligne) || 0} FG</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
        <p>
          <strong>Montant total :</strong> {new Intl.NumberFormat("fr-FR").format(Depense.montant_total) || 0} FG
        </p>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/Depenses")}>
        Retour
      </button>
    </div>
  );
}

export default DepenseDetails;

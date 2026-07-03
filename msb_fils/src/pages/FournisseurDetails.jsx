import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import "../CSS/Clients.css";

function FournisseurDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fournisseur, setFournisseur] = useState(null);
  const [totalEnCours, setTotalEnCours] = useState(0);
  const [totalRecu, setTotalRecu] = useState(0);
  const [totalFacture, setTotalFacture] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);

  async function loadFournisseurData() {
    try {
      // Fetch fournisseur info
      const { data: fournisseurData, error: fournisseurError } = await supabase
        .from("fournisseurs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (fournisseurError || !fournisseurData) {
        alert("Fournisseur introuvable");
        navigate("/fournisseurs");
        return;
      }

      setFournisseur(fournisseurData);

      // Fetch achats by status
      const { data: achatData } = await supabase
        .from("achats")
        .select("montant_total, statut")
        .eq("fournisseur_id", id);

      if (achatData) {
        let enCours = 0;
        let recu = 0;
        let facture = 0;

        achatData.forEach((achat) => {
          if (achat.statut === "En cours") {
            enCours += achat.montant_total || 0;
          } else if (achat.statut === "Reçu") {
            recu += achat.montant_total || 0;
          } else if (achat.statut === "Facturé") {
            facture += achat.montant_total || 0;
          }
        });

        setTotalEnCours(enCours);
        setTotalRecu(recu);
        setTotalFacture(facture);
        setTotalGeneral(enCours + recu + facture);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du fournisseur :", error);
    }
  }

  useEffect(() => {
    loadFournisseurData();
  }, [id]);

  if (!fournisseur) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Fiche Fournisseur #{id}</h1>

      <div className="card">
        <p>
          <strong>Nom :</strong> {fournisseur.nom} {fournisseur.prenom}
        </p>
        <p>
          <strong>Société :</strong> {fournisseur.societe || "—"}
        </p>
        <p>
          <strong>Adresse :</strong> {fournisseur.adresse || "—"}
        </p>
        <p>
          <strong>Téléphone :</strong> {fournisseur.telephone || "—"}
        </p>
        <p>
          <strong>Email :</strong> {fournisseur.email || "—"}
        </p>
      </div>

      <h3>Résumé des achats</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff3e0",
            border: "2px solid #ff9800",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#e65100" }}>En cours</h4>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#bf360c" }}>
            {totalEnCours.toFixed(2)} Fg
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#e8f5e9",
            border: "2px solid #4caf50",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>Reçu</h4>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#1b5e20" }}>
            {totalRecu.toFixed(2)} Fg
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#e3f2fd",
            border: "2px solid #2196f3",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#1565c0" }}>Facturé</h4>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#0d47a1" }}>
            {totalFacture.toFixed(2)} Fg
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#f3e5f5",
            border: "2px solid #9c27b0",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#6a1b9a" }}>Total général</h4>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#4a148c" }}>
            {totalGeneral.toFixed(2)} Fg
          </p>
        </div>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/fournisseurs")}>
        Retour
      </button>
    </div>
  );
}

export default FournisseurDetails;

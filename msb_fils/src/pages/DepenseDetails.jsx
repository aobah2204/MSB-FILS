import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function DepenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Depense, setDepense] = useState(null);
  const [fournisseur, setFournisseur] = useState(null);
  const [site, setSite] = useState(null);
  const [vehicule, setVehicule] = useState(null);

  async function loadDepense() {
    const { data, error } = await supabase.from("depenses").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Dépense introuvable");
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

    if (data.site_id) {
      const { data: siteData } = await supabase
        .from("siteproduction")
        .select("nom, adresse")
        .eq("id", data.site_id)
        .maybeSingle();
      setSite(siteData);
    }

    if (data.vehicule_id) {
      const { data: vehiculeData } = await supabase
        .from("vehicules")
        .select("marque, immatriculation")
        .eq("id", data.vehicule_id)
        .maybeSingle();
      setFournisseur(vehiculeData);
    }

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
      <h1>Détails de la dépense {id}</h1>
      <div className="card" style={{textAlign: "left"}}>
        <p>
          <strong>Référence :</strong> {Depense.reference || "—"}
        </p>
        {site?.nom && 
        <p>
          <strong>Site associé :</strong> {site?.nom + " "+ site?.adresse || "—"}
        </p>
        }
        {vehicule?.marque &&
        <p>
          <strong>Véhicule associé :</strong> {vehicule?.marque + " "+ vehicule?.immatriculation || "—"}
        </p>
        }
        {fournisseur?.nom &&
        <p>
          <strong>Fournisseur associé :</strong> {fournisseur?.nom + " "+ fournisseur?.prenom || "—"}
        </p>
        }
        <p>
          <strong>Date :</strong> {formatDate(Depense.date_depense) || "—"}
        </p>
        <p>
          <strong>Statut :</strong> {Depense.statut || "—"}
        </p>
        <p>
          <strong>Libellé :</strong> {Depense.libelle || "—"}
        </p>        
      </div>

      

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
        <p>
          <strong>Montant total :</strong> {new Intl.NumberFormat("fr-FR").format(Depense.montant) || 0} FG
        </p>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/Depenses")}>
        Retour
      </button>
    </div>
  );
}

export default DepenseDetails;

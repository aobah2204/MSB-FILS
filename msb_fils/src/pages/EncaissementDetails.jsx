import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function EncaissementDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [Encaissement, setEncaissement] = useState({
    id:"",
    date_encaissement: "",
    libelle: "",
    montant: 0,
    categorie: "",
    type_liaison: "",
    site_id: "",
    vehicule_id: "",
    utilisateur_id: ""
  });
  const [fournisseur, setFournisseur] = useState({
    id:"",
    nom:"",
    prenom:"",
    societe:"",
    telephone:"",
    adresse:"",
    email:""
  });
  const [site, setSite] = useState({
    nom:"",
    adresse:"",
    responsable:"",
    telephone:"",
    capacite:"",
    surface:"",
    equipements:"",
    statut:true,
    resp_id: 0
  });
  const [vehicule, setVehicule] = useState({
    id: "",
    marque:"",
    modele:"",
    immatriculation:"",
    annee:"",
    chauffeur:"",
    kilometrage:"",
    carburant:"",
    user_id: 0,
  });
  const [salarie, setSalarie] = useState({
    id: "",
    fullname:"",
    telephone: "",
    email:"",
    role: "",
    adresse: "",
  });

  async function loadEncaissement() {
    const { data, error } = await supabase.from("Encaissements").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Dépense introuvable");
      navigate("/encaissement");
      return;
    }

    setEncaissement(data);
    console.log("Encaissement : ", data);

    if (data.fournisseur_id) {
      const { data: fournisseurData } = await supabase
        .from("fournisseurs")
        .select("*")
        .eq("id", data.fournisseur_id)
        .maybeSingle();
      setFournisseur(fournisseurData);
    }

    if (data.site_id) {
      const { data: siteData } = await supabase
        .from("siteproduction")
        .select("*")
        .eq("id", data.site_id)
        .maybeSingle();
      setSite(siteData);
    }

    if (data.vehicule_id) {
      const { data: vehiculeData } = await supabase
        .from("vehicules")
        .select("*")
        .eq("id", data.vehicule_id)
        .maybeSingle();
      setVehicule(vehiculeData);
      console.log("Vehicule : ",vehiculeData)
    }

    if (data.utilisateur_id) {
      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", data.utilisateur_id)
        .maybeSingle();
      setSalarie(userData);
      console.log(userData);
    }

  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  useEffect(() => {
    loadEncaissement();
  }, [id]);

  if (!Encaissement) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de la dépense {id}</h1>
      <div className="card" style={{textAlign: "left"}}>
        <p>
          <strong>Référence :</strong> {Encaissement.reference || "—"}
        </p>
        {Encaissement?.site_id !== 0  && 
        <p>
          <strong>Site associé :</strong> {site?.nom + " "+ site?.adresse || "—"}
        </p>
        }
        {Encaissement?.vehicule_id !== 0 &&
        <p>
          <strong>Véhicule associé :</strong> {vehicule?.marque + " "+ vehicule?.immatriculation || "—"}
        </p>
        }
        {Encaissement?.fournisseur_id !== 0 &&
        <p>
          <strong>Fournisseur associé :</strong> {fournisseur?.nom + " "+ fournisseur?.prenom + " : "+ fournisseur?.adresse || "—"}
        </p>
        }
        {Encaissement?.utilisateur_id !== 0 &&
        <p>
          <strong>Salarié associé :</strong> {salarie?.fullname || "—"}
        </p>
        }
        <p>
          <strong>Date :</strong> {formatDate(Encaissement.date_encaissement) || "—"}
        </p>
        <p>
          <strong>Statut :</strong> {Encaissement.statut || "—"}
        </p>
        <p>
          <strong>Libellé :</strong> {Encaissement.libelle || "—"}
        </p>        
      </div>

      

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
        <p>
          <strong>Montant total :</strong> {new Intl.NumberFormat("fr-FR").format(Encaissement.montant) || 0} FG
        </p>
        <p>
          <strong>Montant payé :</strong> {new Intl.NumberFormat("fr-FR").format(Encaissement.montant_paye) || 0} FG
        </p>
        <p>
          <strong>Rest à payer :</strong> {new Intl.NumberFormat("fr-FR").format(Encaissement.montant - Encaissement.montant_paye) || 0} FG
        </p>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/encaissement")}>
        Retour
      </button>
    </div>
  );
}

export default EncaissementDetails;

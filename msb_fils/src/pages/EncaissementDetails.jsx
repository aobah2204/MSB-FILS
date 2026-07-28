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
    site_id: 0,
    vehicule_id: 0,
    utilisateur_id: 0,
    prestation_id: 0,
    vente_id: 0,
    commande_id: 0
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

  const [vente, setVente] = useState([]);
  const [commande, setCommande] = useState([]);
  const [prestation, setPrestation] = useState([]);

  async function loadEncaissement() {
    const { data, error } = await supabase.from("encaissements").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Encaissement introuvable");
      navigate("/encaissements");
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
      //console.log("Vehicule : ",vehiculeData)
    }

    if (data.utilisateur_id) {
      const { data: userData } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", data.utilisateur_id)
        .maybeSingle();
      setSalarie(userData);
      //console.log(userData);
    }

    if (data.vente_id) {
      const { data: venteData } = await supabase
        .from("ventes")
        .select("*")
        .eq("id", data.vente_id)
        .maybeSingle();
      setVente(venteData);
    }

    if (data.prestation_id) {
      const { data: prestationData } = await supabase
        .from("prestations")
        .select("*")
        .eq("id", data.prestation_id)
        .maybeSingle();
      setPrestation(prestationData);
    }
    if (data.commande_id) {
      const { data: commandeData } = await supabase
        .from("commandes")
        .select("*")
        .eq("id", data.commande_id)
        .maybeSingle();
      setCommande(commandeData);
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
      <h1>Détails de l'encaissement #{Encaissement.reference}</h1>
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
        {Encaissement?.vente_id !== 0 &&
        <p>
          <strong>Vente associée :</strong> {vente?.reference || "—"} {vente?.description || "—"}
        </p>
        }
        {Encaissement?.commande_id !== 0 &&
        <p>
          <strong>Commande associée :</strong> {commande?.reference || "—"} {commande?.description || "—"}
        </p>
        }
        {Encaissement?.prestation_id !== 0 &&
        <p>
          <strong>Prestation associée :</strong> {prestation?.reference || "—"} {prestation?.description || "—"}
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
      </div>

      <button className="profile" type="button" onClick={() => navigate("/encaissements")}>
        Retour
      </button>
    </div>
  );
}

export default EncaissementDetails;

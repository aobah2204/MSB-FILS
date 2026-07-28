import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";

function IssaEncaissementDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [IssaEncaissement, setIssaEncaissement] = useState({
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

  async function loadIssaEncaissement() {
    const { data, error } = await supabase.from("issaencaissements").select("*").eq("id", id).maybeSingle();

    if (error || !data) {
      alert("Encaissement introuvable");
      navigate("/issaencaissements");
      return;
    }

    setIssaEncaissement(data);
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
        .from("issaventes")
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
    loadIssaEncaissement();
  }, [id]);

  if (!IssaEncaissement) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de l'Encaissement #{IssaEncaissement.reference}</h1>
      <div className="card" style={{textAlign: "left"}}>
        <p>
          <strong>Référence :</strong> {IssaEncaissement.reference || "—"}
        </p>
        {IssaEncaissement?.site_id !== 0  && 
        <p>
          <strong>Site associé :</strong> {site?.nom + " "+ site?.adresse || "—"}
        </p>
        }
        {IssaEncaissement?.vehicule_id !== 0 && 
        <p>
          <strong>Véhicule associé :</strong> {vehicule?.marque + " "+ vehicule?.immatriculation || "—"}
        </p>
        }
        {IssaEncaissement?.fournisseur_id !== 0 &&
        <p>
          <strong>Fournisseur associé :</strong> {fournisseur?.nom + " "+ fournisseur?.prenom + " : "+ fournisseur?.adresse || "—"}
        </p>
        }
        {IssaEncaissement?.utilisateur_id !== 0 &&
        <p>
          <strong>Salarié associé :</strong> {salarie?.fullname || "—"}
        </p>
        }
        {IssaEncaissement?.vente_id !== 0 &&
        <p>
          <strong>Vente associée :</strong> {vente?.reference || "—"} {vente?.date_vente || "—"} {vente?.description || "—"}
        </p>
        }
        {IssaEncaissement?.commande_id !== 0 &&
        <p>
          <strong>Commande associée :</strong> {commande?.reference || "—"} {commande?.date_commande || "—"} {commande?.description || "—"}
        </p>
        }
        {IssaEncaissement?.prestation_id !== 0 &&
        <p>
          <strong>Prestation associée :</strong> {prestation?.reference || "—"} {prestation?.date_prestation || "—"} {prestation?.description || "—"}
        </p>
        }
        <p>
          <strong>Date :</strong> {formatDate(IssaEncaissement.date_encaissement) || "—"}
        </p>
        <p>
          <strong>Statut :</strong> {IssaEncaissement.statut || "—"}
        </p>
        <p>
          <strong>Libellé :</strong> {IssaEncaissement.libelle || "—"}
        </p>        
      </div>

      

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
        <p>
          <strong>Montant total :</strong> {new Intl.NumberFormat("fr-FR").format(IssaEncaissement.montant) || 0} FG
        </p>
        
      </div>

      <button className="profile" type="button" onClick={() => navigate("/issaencaissements")}>
        Retour
      </button>
    </div>
  );
}

export default IssaEncaissementDetails;

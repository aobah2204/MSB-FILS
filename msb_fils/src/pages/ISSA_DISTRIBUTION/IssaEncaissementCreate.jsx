import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "postcss";
import { notify } from "../../utils/notifications.js";

function IssaEncaissementCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [sites, setSites] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [IssaEncaissements, setIssaEncaissements] = useState([]);

  const [prestations, setPrestations] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [ventes, setVentes] = useState([]);

  const [salarie, setSalarie] = useState();

  const [formData, setFormData] = useState({
    reference: "",
    libelle: "",
    categorie: "", 
    fournisseur_id: 0,
    site_id: 0,
    vehicule_id: 0,
    utilisateur_id: 0,
    date_encaissement: "",
    statut: "Payé",
    mode_paiement: "",
    montant: "",
    montant_paye: "",
    justificatif: "",
    type_liaison: "GENERAL",
    commande_id: 0,
    vente_id: 0,
    prestation_id: 0,
  });

  const [Encaissement, setEncaissement] = useState({
    date_encaissement: "",
    libelle: "",
    montant: 0,
    categorie: "",
    type_liaison: "GENERAL",
    site_id: "",
    vehicule_id: "",
    utilisateur_id: "",
    commande_id: 0,
    vente_id: 0,
    prestation_id: 0,
});

  useEffect(() => {
    loadData();
  }, []);

    async function loadData() {
        try {
        const { data: fournisseursData } = await supabase.from("fournisseurs").select("*");
        const { data: sitesData } = await supabase.from("siteproduction").select("*");
        const { data: vehiculesData } = await supabase.from("vehicules").select("id, immatriculation, marque");
        const { data: salariesData } = await supabase.from("utilisateurs").select("*");
        const { data: IssaEncaissementsData } = await supabase.from("issaencaissements").select("*");
        const { data: prestationsData } = await supabase.from("prestations").select("*");
        const { data: commandesData } = await supabase.from("commandes").select("*, clients(nom, prenom)");
        const { data: ventesData } = await supabase.from("issaventes").select("*, clients(nom, prenom)");

        setFournisseurs(fournisseursData || []);
        setSites(sitesData || []);
        setVehicules(vehiculesData || []);
        setSalaries(salariesData || []);
        setIssaEncaissements(IssaEncaissementsData || []);
        setCommandes(commandesData || []);
        setPrestations(prestationsData || []);
        setVentes(ventesData || []);

        } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        }
    }

    function handleChange(e) {

        const { name, value } = e.target;

        if (name === "type_liaison") {

            setEncaissement(prev => ({
                ...prev,
                type_liaison: value,
                site_id: "",
                vehicule_id: "",
                utilisateur_id: "",
                fournisseur_id: "",
                commande_id: "",
                prestation_id: "",
                vente_id: ""
            }));

            return;
        }

        setEncaissement(prev => ({
            ...prev,
            [name]: value
        }));

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function createNotification(titre, message, type, lien, user) {

        const { error: notificationError } = await supabase.from("notifications")
            .insert({
                titre: titre,
        
                message: message,
        
                type:type,
        
                utilisateur_id:null,
        
                lien:lien,
        
                auteur_id:user?.id
            });
        
            if(notificationError){
                alert("Notification non enregistrée : " + notificationError.message);
            }
    };


    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.categorie) {
        alert("Veuillez remplir tous les champs");
        return;
        }

        //console.log("Form data :", formData)

        try {
        const { data: EncaissementData, error: EncaissementError } = await supabase
            .from("issaencaissements")
            .insert([
            {
                reference: "ISSA_ENC_000"+(IssaEncaissements.length + 1),
                libelle: formData.libelle,
                categorie: formData.categorie,
                fournisseur_id: formData.fournisseur_id,
                site_id: formData.site_id,
                vehicule_id: formData.vehicule_id,
                utilisateur_id: formData.utilisateur_id,
                commande_id: formData.commande_id,
                vente_id: formData.vente_id,
                prestation_id: formData.prestation_id,
                date_encaissement: formData.date_encaissement,
                statut: formData.statut,
                montant: formData.montant,
                //montant_paye: formData.montant_paye,
                mode_paiement: formData.mode_paiement,
                justificatif: formData.justificatif,
                created_user_id: user?.id
            },
            ])
            .select();

        if (EncaissementError || !EncaissementData) {
            alert("Erreur lors de la création de l'encaissement "+ (EncaissementError ? EncaissementError.message : ""));
            return;
        }

        // Créer une notification
        await createNotification(
            "Nouvel encaissement créé",
            `Un nouvel encaissement a été créé avec la référence : ${EncaissementData[0].reference}`,
            "encaissement",
            `/issaencaissements/${EncaissementData[0].id}`,
            user
        );
        notify.success("Encaissement créé avec succès !");

        navigate("/issaencaissements");
        } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de la création");
        }
    }

  return (
    <div className="product-page">
      <h1>Nouvel encaissement</h1>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div>
            <label>Référence</label>
            <input
              type="text"
              name="reference"
              value={formData.reference || "ISSA_ENC_000"+(IssaEncaissements.length + 1)}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          <div>
            <label>Catégorie</label>
            <select
                name="categorie"
                value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
            > 
                <option>
                    ---Choisir---
                </option>
                <option>
                    Vente client
                </option>
                <option>
                    Acompte client
                </option>
                <option>
                    Paiement partiel
                </option>
                <option>
                    Solde de facture
                </option>
                <option>
                    Paiement comptant
                </option>
                <option>
                    Remboursement fournisseur
                </option>
                <option>
                    Remboursement prestataire
                </option>
                <option>
                    Subvention
                </option>
                <option>
                    Apport en capital
                </option>
                <option>
                    Emprunt bancaire
                </option>
                <option>
                    Revenus financiers
                </option>
                <option>
                    Autres produits
                </option>                   
                <option>
                    Divers
                </option>

            </select>
          </div>


          <div>
            <label>Date de la dépense</label>
            <input
              type="date"
              name="date_encaissement"
              value={formData.date_encaissement.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date_encaissement: e.target.value })}
            />
          </div>          

          <div>
            <label>Libellé</label>
            <textarea
              value={formData.libelle}
              name="libelle"
              onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
            />
          </div>
        

            <div>
                <label>Montant</label>
                <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                />
            </div>

            {/*
            <div>
                <label>Montant payé</label>
                <input
                type="number"
                name="montant_paye"
                value={formData.montant_paye}
                onChange={(e) => setFormData({ ...formData, montant_paye: e.target.value })}
                />
            </div>
            */}
            
            <div>
            <label>Moyen d'encaissement</label>
            <select
                name="mode_paiement"
                value={formData.mode_paiement}
                    onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
            > 
                <option>
                    ---Choisir---
                </option>
                <option>
                    Espèces
                </option>
                <option>
                    Chèque
                </option>
                <option>
                    Virement bancaire
                </option>
                <option>
                    Carte bancaire
                </option>
                <option>
                    Orange Money
                </option>
                <option>
                    Compensation comptable
                </option>
                <option>
                    Prélèvement automatique
                </option>
                <option>
                    MTN Money
                </option>
                <option>
                    Wave
                </option>
                <option>
                    PayPal
                </option>                
                <option>
                    Autres produits
                </option>                   
                <option>
                    Divers
                </option>

            </select>
          </div>

            <div>
                <label>Statut</label>
                <select
                value={formData.statut}
                name="statut"
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                >
                <option>Encaissé</option>
                <option>Non Encaissé</option>
                </select>
            </div>
        </div>

        <br/>
        <div className="form-group">

            <label>Associer à</label>

            <div className="radio-group">

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="VENTE"
                        checked={Encaissement.type_liaison === "VENTE"}
                        onChange={handleChange}
                    />
                    Vente
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="SITE"
                        checked={Encaissement.type_liaison === "SITE"}
                        onChange={handleChange}
                    />
                    Site
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="VEHICULE"
                        checked={Encaissement.type_liaison === "VEHICULE"}
                        onChange={handleChange}
                    />
                    Véhicule
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="SALARIE"
                        checked={Encaissement.type_liaison === "SALARIE"}
                        onChange={handleChange}
                    />
                    Salarié
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="FOURNISSEUR"
                        checked={Encaissement.type_liaison === "FOURNISSEUR"}
                        onChange={handleChange}
                    />
                    Fournisseur
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="COMMANDE"
                        checked={Encaissement.type_liaison === "COMMANDE"}
                        onChange={handleChange}
                    />
                    Commande
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="PRESTATION"
                        checked={Encaissement.type_liaison === "PRESTATION"}
                        onChange={handleChange}
                    />
                    Prestation
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="GENERAL"
                        checked={Encaissement.type_liaison === "GENERAL"}
                        onChange={handleChange}
                    />
                    Général
                </label>

            </div>

        </div>

        { /* Ventes */
        Encaissement.type_liaison === "VENTE" && (

        <div className="form-group">

            <label>Vente</label>

            <select
                name="vente_id"
                value={Encaissement.vente_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner une vente</option>

                {
                    ventes.map(vente => (

                        <option
                            key={vente.id}
                            value={vente.id}
                        >
                            {vente.reference} {vente.description} {vente.clients.nom} {vente.clients.prenom}
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* Sites */
        Encaissement.type_liaison === "SITE" && (

        <div className="form-group">

            <label>Site</label>

            <select
                name="site_id"
                value={Encaissement.site_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner un site</option>

                {
                    sites.map(site => (

                        <option
                            key={site.id}
                            value={site.id}
                        >
                            {site.nom}
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* Véhicules */
        Encaissement.type_liaison === "VEHICULE" && (

        <div className="form-group">

            <label>Véhicule</label>

            <select
                name="vehicule_id"
                value={Encaissement.vehicule_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner un véhicule</option>

                {
                    vehicules.map(v => (

                        <option
                            key={v.id}
                            value={v.id}
                        >
                            {v.immatriculation} - {v.marque}
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* Salarié */
        Encaissement.type_liaison === "SALARIE" && (

        <div className="form-group">

            <label>Salarié</label>

            <select
                name="utilisateur_id"
                value={Encaissement.utilisateur_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner un salarié</option>

                {
                    salaries?.map(sal => (

                        <option
                            key={sal.id}
                            value={sal.id}
                        >
                            {sal.fullname} -- {sal?.adresse} "{sal?.role}"
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* Fournisseur */
        Encaissement.type_liaison === "FOURNISSEUR" && (

        <div className="form-group">

            <label>Fournisseur</label>

            <select
                name="fournisseur_id"
                value={Encaissement.fournisseur_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner un fournisseur</option>

                {
                    fournisseurs?.map(f => (

                        <option
                            key={f.id}
                            value={f.id}
                        >
                            {f?.nom} {f?.prenom} -- {f?.societe}
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* COMMANDES */
        Encaissement.type_liaison === "COMMANDE" && (

        <div className="form-group">

            <label>Commande</label>

            <select
                name="commande_id"
                value={Encaissement.commande_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner la commande</option>

                {
                    commandes?.map(f => (

                        <option
                            key={f.id}
                            value={f.id}
                        >
                            {f?.reference} {f?.description} du : {f?.date_commande.split('T')[0]} par : {f?.clients.nom} {f?.clients.prenom}
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* Prestation */
        Encaissement.type_liaison === "PRESTATION" && (

        <div className="form-group">

            <label>Prestation</label>

            <select
                name="prestation_id"
                value={Encaissement.prestation_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner une prestation</option>

                {
                    prestations?.map(f => (

                        <option
                            key={f.id}
                            value={f.id}
                        >
                            {f?.reference} {f?.description} {f?.date_prestation} 
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }


        <div style={{ marginTop: "20px" }}>
          <button type="submit" className="profile">
            Enregistrer
          </button>
          <button
            type="button"
            className="profile"
            onClick={() => navigate("/issaencaissements")}
            style={{ marginLeft: "10px" }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default IssaEncaissementCreate;

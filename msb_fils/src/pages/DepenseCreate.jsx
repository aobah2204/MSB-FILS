import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "postcss";

function DepenseCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [sites, setSites] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [depenses, setDepenses] = useState([]);

  const [salarie, setSalarie] = useState();

  const [formData, setFormData] = useState({
    reference: "",
    libelle: "",
    categorie: "", 
    fournisseur_id: 0,
    site_id: 0,
    vehicule_id: 0,
    utilisateur_id: 0,
    date_depense: "",
    statut: "Payé",
    mode_paiement: "",
    montant: "",
    justificatif: "",
    type_liaison: "GENERAL",
  });

  const [depense, setDepense] = useState({
    date_depense: "",
    libelle: "",
    montant: 0,
    categorie: "",
    type_liaison: "GENERAL",
    site_id: "",
    vehicule_id: "",
    utilisateur_id: ""
});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: fournisseursData } = await supabase.from("fournisseurs").select("id, nom, prenom");
      const { data: sitesData } = await supabase.from("siteproduction").select("id, nom");
      const { data: vehiculesData } = await supabase.from("vehicules").select("id, immatriculation, marque");
      const { data: salariesData } = await supabase.from("utilisateurs").select("id, fullname");
      const { data: depensesData } = await supabase.from("depenses").select("*");

      setFournisseurs(fournisseursData || []);
      setSites(sitesData || []);
      setVehicules(vehiculesData || []);
      setSalaries(salariesData || []);
      setDepenses(depensesData || []);

    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  }

function handleChange(e) {

    const { name, value } = e.target;

    if (name === "type_liaison") {

        setDepense(prev => ({
            ...prev,
            type_liaison: value,
            site_id: "",
            vehicule_id: "",
            utilisateur_id: "",
            fournisseur_id: ""
        }));

        return;
    }

    setDepense(prev => ({
        ...prev,
        [name]: value
    }));

    setFormData({
        ...formData,
        [name]: value
    });
}


  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.categorie) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    //console.log("Form data :", formData)

    try {
      const { data: DepenseData, error: DepenseError } = await supabase
        .from("depenses")
        .insert([
          {
            reference: "MSB_DPS_000"+(depenses.length + 1),
            libelle: formData.libelle,
            categorie: formData.categorie,
            fournisseur_id: formData.fournisseur_id,
            site_id: formData.site_id,
            vehicule_id: formData.vehicule_id,
            utilisateur_id: formData.utilisateur_id,
            date_depense: formData.date_depense,
            statut: formData.statut,
            montant: formData.montant,
            mode_paiement: formData.mode_paiement,
            justificatif: formData.justificatif,
            created_user_id: user?.id
          },
        ])
        .select();

      if (DepenseError || !DepenseData) {
        alert("Erreur lors de la création de la dépense "+ (DepenseError ? DepenseError.message : ""));
        return;
      }

      navigate("/depenses");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création");
    }
  }

  return (
    <div className="product-page">
      <h1>Nouvelle Dépense</h1>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div>
            <label>Référence</label>
            <input
              type="text"
              name="reference"
              value={formData.reference || "MSB_DPS_000"+(depenses.length + 1)}
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
                    Carburant
                </option>
                <option>
                    Maintenance
                </option>
                <option>
                    Réparation
                </option>
                <option>
                    Pièce
                </option>
                <option>
                    Salaire
                </option>
                <option>
                    Electricité
                </option>
                <option>
                    Eau
                </option>
                <option>
                    Loyer
                </option>
                <option>
                    Transport
                </option>
                <option>
                    Matières premières
                </option>
                <option>
                    Consommables
                </option>
                <option>
                    Impôts
                </option>
                <option>
                    Assurance
                </option>
                <option>
                    Fournisseur
                </option>
                <option>
                    Prime de voyage
                </option>
                <option>
                    Frais de route
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
              name="date_depense"
              value={formData.date_depense.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date_depense: e.target.value })}
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

            <div>
                <label>Mode de paiement</label>
                <input
                type="text"
                name="mode_paiement"
                value={formData.mode_paiement}
                onChange={(e) => setFormData({ ...formData, mode_paiement: e.target.value })}
                />
            </div>

            <div>
                <label>Statut</label>
                <select
                value={formData.statut}
                name="statut"
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                >
                <option>Payé</option>
                <option>Non payé</option>
                </select>
            </div>
        </div>

        <div className="form-group">

            <label>Associer à</label>

            <div className="radio-group">

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="SITE"
                        checked={depense.type_liaison === "SITE"}
                        onChange={handleChange}
                    />
                    Site
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="VEHICULE"
                        checked={depense.type_liaison === "VEHICULE"}
                        onChange={handleChange}
                    />
                    Véhicule
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="SALARIE"
                        checked={depense.type_liaison === "SALARIE"}
                        onChange={handleChange}
                    />
                    Salarié
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="FOURNISSEUR"
                        checked={depense.type_liaison === "FOURNISSEUR"}
                        onChange={handleChange}
                    />
                    Fournisseur
                </label>

                <label>
                    <input
                        type="radio"
                        name="type_liaison"
                        value="GENERAL"
                        checked={depense.type_liaison === "GENERAL"}
                        onChange={handleChange}
                    />
                    Général
                </label>

            </div>

        </div>

        { /* Sites */
        depense.type_liaison === "SITE" && (

        <div className="form-group">

            <label>Site</label>

            <select
                name="site_id"
                value={depense.site_id}
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
        depense.type_liaison === "VEHICULE" && (

        <div className="form-group">

            <label>Véhicule</label>

            <select
                name="vehicule_id"
                value={depense.vehicule_id}
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
        depense.type_liaison === "SALARIE" && (

        <div className="form-group">

            <label>Salarié</label>

            <select
                name="utilisateur_id"
                value={depense.utilisateur_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner un salarié</option>

                {
                    salaries?.map(sal => (

                        <option
                            key={sal.id}
                            value={sal.id}
                        >
                            {sal.fullname} 
                        </option>

                    ))
                }

            </select>

        </div>

        )
        }

        { /* Fournisseur */
        depense.type_liaison === "FOURNISSEUR" && (

        <div className="form-group">

            <label>Fournisseur</label>

            <select
                name="fournisseur_id"
                value={depense.fournisseur_id}
                onChange={handleChange}
            >

                <option value="">Sélectionner un fournisseur</option>

                {
                    fournisseurs?.map(f => (

                        <option
                            key={f.id}
                            value={f.id}
                        >
                            {f?.nom} {f?.prenom} 
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
            onClick={() => navigate("/depenses")}
            style={{ marginLeft: "10px" }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepenseCreate;

import { Eye, Pencil, Trash2, Package, Search, Filter, RotateCcw } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from "react";
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";

function Depenses() {
  const { user } = useAuth();
  const [sites, setSites] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [depensesFiltrees, setDepensesFiltrees] = useState([]);

  useEffect(() => {
    loadDepenses();
}, []);

  async function loadDepenses() {
    try {
      const { data: depensesData } = await supabase
        .from("depenses")
        .select("*")
        .order("date_depense", { ascending: false });

      if (!depensesData) return alert("Aucun Dépense");
      setDepenses(depensesData);
      setDepensesFiltrees(depensesData);

      const { data: sitesData } = await supabase
        .from("siteproduction")
        .select("*");

      if (!sitesData) return alert("Aucun site");
      setSites(sitesData);

      const { data: fournisseursData } = await supabase
        .from("fournisseurs")
        .select("*");

      if (!fournisseursData) return alert("Aucun fournisseur");
      setFournisseurs(fournisseursData);

      const { data: vehiculesData } = await supabase
        .from("vehicules")
        .select("*");

      if (!vehiculesData) return alert("Aucun véhicule");
      setVehicules(vehiculesData);


    } catch (error) {
      console.error("Erreur lors du chargement des Dépenses :", error);
    }
  }

  async function deleteDepense(Depense) {
    if (confirm("Supprimer cette Depense ?")) {
      try {
        // Delete cascade: Depenses cascade to Depensematierepremieres
        await supabase.from("depenses").delete().eq("id", Depense.id);
        await loadDepenses();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  const [filters, setFilters] = useState({
      search: "",
      dateDebut: "",
      dateFin: "",
      categorie: "",
      site: "",
      fournisseur: "",
      vehicule: "",
      modePaiement: "",
      statut: "",
      montantMin: "",
      montantMax: ""
  });

  const handleFilterChange = (e) => {
      const { name, value } = e.target;

      setFilters(prev => ({
          ...prev,
          [name]: value
      }));
  };

  const depensesFiltres = depenses.filter(depense => {

      const date = new Date(depense.date_depense);

      return (

          (!filters.search ||
              depense.libelle.toLowerCase().includes(filters.search.toLowerCase()) ||
              depense.reference?.toLowerCase().includes(filters.search.toLowerCase()))

          &&

          (!filters.categorie ||
              depense.categorie === filters.categorie)

          &&

          (!filters.site ||
              depense.site_id === filters.site)

          &&

          (!filters.fournisseur ||
              depense.fournisseur_id === filters.fournisseur)

          &&

          (!filters.vehicule ||
              depense.vehicule_id === filters.vehicule)

          &&

          (!filters.modePaiement ||
              depense.mode_paiement === filters.modePaiement)

          &&

          (!filters.statut ||
              depense.statut === filters.statut)

          &&

          (!filters.dateDebut ||
              date >= new Date(filters.dateDebut))

          &&

          (!filters.dateFin ||
              date <= new Date(filters.dateFin + "T23:59:59"))

          &&

          (!filters.montantMin ||
              Number(depense.montant) >= Number(filters.montantMin))

          &&

          (!filters.montantMax ||
              Number(depense.montant) <= Number(filters.montantMax)))
  });

  const reinitialiser = () => {
      const initialFilters = {
        search: "",
        dateDebut: "",
        dateFin: "",
        categorie: "",
        site: "",
        fournisseur: "",
        vehicule: "",
        modePaiement: "",
        statut: "",
        montantMin: "",
        montantMax: ""
    };

    setFilters(initialFilters);
    setDepensesFiltrees(depenses);
  };


  const rechercher = () => {

    console.log("In recherche ...", filters, depenses);

      const resultat = depenses.filter((depense) => {

          // Recherche texte
          const rechercheOK =
              filters.search === "" ||

              depense.libelle?.toLowerCase().includes(filters.search.toLowerCase()) ||

              depense.reference?.toLowerCase().includes(filters.search.toLowerCase());

          // Catégorie
          const categorieOK =
              filters.categorie === "" ||
              depense.categorie === filters.categorie;

          // Site
          const siteOK =
              filters.site === "" ||
              depense.site_id == filters.site;

          // Fournisseur
          const fournisseurOK =
              filters.fournisseur === "" ||
              depense.fournisseur_id == filters.fournisseur;

          // Véhicule
          const vehiculeOK =
              filters.vehicule === "" ||
              depense.vehicule_id == filters.vehicule;

          // Paiement
          const paiementOK =
              filters.modePaiement === "" ||
              depense.mode_paiement.toLowerCase().trim() === filters.modePaiement.toLowerCase().trim();

          // Statut
          const statutOK =
              filters.statut === "" ||
              depense.statut === filters.statut;

          // Date
          const date = new Date(depense.date_depense);

          const dateDebutOK =
              filters.dateDebut === "" ||
              date >= new Date(filters.dateDebut);

          const dateFinOK =
              filters.dateFin === "" ||
              date <= new Date(filters.dateFin + "T23:59:59");

          // Montants
          const montantMinOK =
              filters.montantMin === "" ||
              Number(depense.montant) >= Number(filters.montantMin);

          const montantMaxOK =
              filters.montantMax === "" ||
              Number(depense.montant) <= Number(filters.montantMax);

          return (
              rechercheOK &&
              categorieOK &&
              siteOK &&
              fournisseurOK &&
              vehiculeOK &&
              paiementOK &&
              statutOK &&
              dateDebutOK &&
              dateFinOK &&
              montantMinOK &&
              montantMaxOK
          );

      });

      console.log("Resultat ", resultat);

      setDepensesFiltrees(resultat);

  };

  const montantTotal = depensesFiltrees.reduce(
      (total, depense) => total + Number(depense.montant || 0),
      0
  );

  const montantTotalPaye = depensesFiltrees.reduce(
      (total, depense) => total + Number(depense.montant_paye || 0),
      0
  );

  return (
    <div className="product-page">

      <h1>Liste des Dépenses</h1>
      {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur", "Commercial"].includes(
        user?.role
      ) && (
        <section>
          <div>
            <NavLink to="/depenses/nouveau">
              <button className="profile">
                <Package size={20} /> Ajouter une dépense
              </button>
            </NavLink>
          </div>
        </section>
      )}

      <br/>
      <div className="bg-white rounded-xl shadow-md p-5 mb-5">

            <div className="flex items-center gap-2 mb-4">
                <Filter size={22} />
                <h2 className="text-xl font-semibold">
                    Critères de recherche
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Recherche */}

                <div>
                    <label className="text-sm font-medium">
                        Recherche
                    </label>

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Libellé ou référence..."
                            className="w-full pl-10 p-2 border rounded-lg"
                        />

                    </div>
                </div>

                {/* Date début */}

                <div>

                    <label className="text-sm font-medium">
                        Du
                    </label>

                    <input
                        type="date"
                        name="dateDebut"
                        value={filters.dateDebut}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    />

                </div>

                {/* Date fin */}

                <div>

                    <label className="text-sm font-medium">
                        Au
                    </label>

                    <input
                        type="date"
                        name="dateFin"
                        value={filters.dateFin}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    />

                </div>

                {/* Catégorie */}

                <div>

                    <label className="text-sm font-medium">
                        Catégorie
                    </label>

                    <select
                        name="categorie"
                        value={filters.categorie}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">Toutes</option>

                        {/*{categories.map(cat => (

                            <option
                                key={cat}
                                value={cat}
                            >
                                {cat}
                            </option>

                        ))}*/}
            
                
                      <option>
                          Carburant
                      </option>
                      <option>
                          Transport
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
                          Manutention
                      </option>                
                      <option>
                          Divers
                      </option>


                    </select>

                </div>

                {/* Site */}

                <div>

                    <label className="text-sm font-medium">
                        Site
                    </label>

                    <select
                        name="site"
                        value={filters.site}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">
                            Tous
                        </option>

                        {sites.map(site => (

                            <option
                                key={site.id}
                                value={site.id}
                            >
                                {site.nom}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Fournisseur */}

                <div>

                    <label className="text-sm font-medium">
                        Fournisseur
                    </label>

                    <select
                        name="fournisseur"
                        value={filters.fournisseur}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">
                            Tous
                        </option>

                        {fournisseurs.map(f => (

                            <option
                                key={f.id}
                                value={f.id}
                            >
                                {f.nom} {f.prenom} - {f.societe}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Véhicule */}

                <div>

                    <label className="text-sm font-medium">
                        Véhicule
                    </label>

                    <select
                        name="vehicule"
                        value={filters.vehicule}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">
                            Tous
                        </option>

                        {vehicules.map(v => (

                            <option
                                key={v.id}
                                value={v.id}
                            >
                                {v.immatriculation} - {v.chauffeur}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Paiement */}

                <div>

                    <label className="text-sm font-medium">
                        Paiement
                    </label>

                    <select
                        name="modePaiement"
                        value={filters.modePaiement}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">Tous</option>
                        <option>Cash</option>
                        <option>Virement</option>
                        <option>Chèque</option>
                        <option>Orange Money</option>
                        <option>Carte bancaire</option>

                    </select>

                </div>

                {/* Statut */}

                <div>

                    <label className="text-sm font-medium">
                        Statut
                    </label>

                    <select
                        name="statut"
                        value={filters.statut}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">Tous</option>
                        <option>Payé</option>
                        <option>Non payé</option>
                    </select>

                </div>

                {/* Montant min */}

                <div>

                    <label className="text-sm font-medium">
                        Montant min
                    </label>

                    <input
                        type="number"
                        name="montantMin"
                        value={filters.montantMin}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    />

                </div>

                {/* Montant max */}

                <div>

                    <label className="text-sm font-medium">
                        Montant max
                    </label>

                    <input
                        type="number"
                        name="montantMax"
                        value={filters.montantMax}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    />

                </div>

            </div>

            {/* Boutons */}
                        
            <br/>
            <div className="grid">

                <button className="profile"
                    onClick={rechercher}
                >
                    Rechercher
                </button>

                <button
                    onClick={reinitialiser}
                    className="profile"
                >
                    <RotateCcw size={18} />
                    Réinitialiser
                </button>

            </div>

      </div>

      {/** Carte résumé dépenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5" style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "15px" }}>

          <div className="bg-white rounded-xl shadow p-5 profile">
              <h4 className="text-gray-500 text-sm">
                  Nombre de dépenses
              </h4>

              <p className="text-3xl font-bold">
                  {depensesFiltrees.length}
              </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 profileMontant">
              <h4 className="text-gray-500 text-sm">
                  Montant total
              </h4>

              <p className="text-3xl font-bold text-red-600">
                  {new Intl.NumberFormat("fr-FR").format(montantTotal)} GNF
              </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 profileEdit">
              <h4 className="text-gray-500 text-sm">
                  Total montant payé
              </h4>

              <p className="text-3xl font-bold text-red-600">
                  {new Intl.NumberFormat("fr-FR").format(montantTotalPaye)} GNF
              </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 profileSupp">
              <h4 className="text-gray-500 text-sm">
                  Total reste à payer
              </h4>

              <p className="text-3xl font-bold text-red-600">
                  {new Intl.NumberFormat("fr-FR").format(montantTotal - montantTotalPaye)} GNF
              </p>
          </div>

          

      </div>    
      

      <br/>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>catégorie</th>
              <th>libelle</th>
              <th>Date</th>
              <th>Montant total</th>
              <th>Montant payé</th>
              <th>Reste à payé</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {depensesFiltrees.map((Depense) => (
              <tr key={Depense.id}>
                <td>{Depense.reference || "—"}</td>
                <td>{Depense.categorie}</td>
                <td>{Depense.libelle}</td>                
                <td>{formatDate(Depense.date_depense) || "—"}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(Depense.montant) || 0 } FG</td>
                <td>{new Intl.NumberFormat("fr-FR").format(Depense.montant_paye) || 0 } FG</td>
                <td>{new Intl.NumberFormat("fr-FR").format(Depense.montant - Depense.montant_paye) || 0 } FG</td>
                <td>{Depense.statut || "—"}</td>
                {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur", "Commercial"].includes(
                  user?.role
                ) && (
                  <td>
                    <NavLink to={`/depenses/details/${Depense.id}`}>
                      <button className="profile">
                        <Eye size={20} />
                      </button>
                    </NavLink>
                    {/*<NavLink to={`/depenses/modifier/${Depense.id}`}>
                      <button className="profile">
                        <Pencil size={20} />
                      </button>
                    </NavLink>*/}
                    <button className="profileSupp" onClick={() => deleteDepense(Depense)}>
                      <Trash2 size={20} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

export default Depenses;

import { Eye, Pencil, Trash2, Package, Search, Filter, RotateCcw, Edit } from "lucide-react";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from "react";
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";
import CardList from "../components/CardList.jsx";
import Table from "../components/Table.jsx";

function Encaissements() {
  const { user } = useAuth();
  const [sites, setSites] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [Encaissements, setEncaissements] = useState([]);
  const [EncaissementsFiltrees, setEncaissementsFiltrees] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [ventes, setVentes] = useState([]);

  const columns=[

    {
    label:"Référence",
    key:"reference"
    },

    {
    label:"Client",
    key:"client_id"
    },

    {
    label:"Montant",
    key:"montant",

    render:(row)=>

    new Intl.NumberFormat("fr-FR")

    .format(row.montant_total)+" GNF"

    },

    {
    label:"Date",
    key:"date_vente"
    },

    {
    label:"Description",
    key:"description",
    mobile:false
    }

    ];

  useEffect(() => {
    loadEncaissements();
}, []);


const [isMobile,setIsMobile]=useState(window.innerWidth<768);

useEffect(()=>{

    const resize=()=>{

    setIsMobile(window.innerWidth<768);

};

window.addEventListener("resize",resize);

return()=>window.removeEventListener("resize",resize);

},[]);

  async function loadEncaissements() {
    try {
      const { data: EncaissementsData } = await supabase
        .from("encaissements")
        .select("*")
        .order("date_encaissement", { ascending: false });

      if (!EncaissementsData) return alert("Aucun Dépense");
      setEncaissements(EncaissementsData);
      setEncaissementsFiltrees(getFilteredEncaissements(EncaissementsData, { ...filters, mois_courant: true, tous: false }));

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

      const { data: ventesData } = await supabase
        .from("ventes")
        .select("*");

      if (!ventesData) return alert("Aucune vente");
      setVentes(ventesData);

      const { data: commandesData } = await supabase
        .from("commandes")
        .select("*");

      if (!commandesData) return alert("Aucune commande");
      setCommandes(commandesData);

      const { data: prestationsData } = await supabase
        .from("prestations")
        .select("*");

      if (!prestationsData) return alert("Aucune prestation");
      setPrestations(prestationsData);


    } catch (error) {
      console.error("Erreur lors du chargement des Encaissements :", error);
    }
  }

  async function deleteEncaissement(Encaissement) {
    if (confirm("Supprimer cet Encaissement ?")) {
      try {
        // Delete cascade: Encaissements cascade to Encaissementmatierepremieres
        await supabase.from("encaissements").delete().eq("id", Encaissement.id);
        await loadEncaissements();
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
      vente: "",
      commande: "",
      prestation: "",
      modePaiement: "",
      statut: "",
      montantMin: "",
      montantMax: "",
      mois_courant: true,
      tous: false,
  });

  const handleFilterChange = (e) => {
      const { name, value } = e.target;

      if (name === "periode") {
          setFilters(prev => ({ ...prev, mois_courant: value === "mois_courant", tous: value === "tous" }));
          return;
      }

      setFilters(prev => ({
          ...prev,
          [name]: value
      }));
  };

  const getFilteredEncaissements = (baseEncaissements = Encaissements, activeFilters = filters) => {
      const now = new Date();
      return baseEncaissements.filter((Encaissement) => {
          const date = new Date(Encaissement.date_encaissement);

          return (
              (!activeFilters.search ||
                  Encaissement.libelle?.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
                  Encaissement.reference?.toLowerCase().includes(activeFilters.search.toLowerCase()))

              &&

              (!activeFilters.categorie ||
                  Encaissement.categorie === activeFilters.categorie)

              &&

              (!activeFilters.site ||
                  Encaissement.site_id === activeFilters.site)

              &&

              (!activeFilters.fournisseur ||
                  Encaissement.fournisseur_id === activeFilters.fournisseur)

              &&

              (!activeFilters.vehicule ||
                  Encaissement.vehicule_id === activeFilters.vehicule)

              &&

              (!activeFilters.vente ||
                  Encaissement.vente_id === activeFilters.vente)

              &&

              (!activeFilters.commande ||
                  Encaissement.commande_id === activeFilters.commande)

              &&

              (!activeFilters.prestation ||
                  Encaissement.prestation_id === activeFilters.prestation)

              &&

              (!activeFilters.modePaiement ||
                  Encaissement.mode_paiement === activeFilters.modePaiement)

              &&

              (!activeFilters.statut ||
                  Encaissement.statut === activeFilters.statut)

              &&

              (!activeFilters.dateDebut ||
                  date >= new Date(activeFilters.dateDebut))

              &&

              (!activeFilters.dateFin ||
                  date <= new Date(activeFilters.dateFin + "T23:59:59"))

              &&

              (!activeFilters.montantMin ||
                  Number(Encaissement.montant) >= Number(activeFilters.montantMin))

              &&

              (!activeFilters.montantMax ||
                  Number(Encaissement.montant) <= Number(activeFilters.montantMax))

              &&

              (!activeFilters.mois_courant ||
                  (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()))
          );
      });
  };

  const EncaissementsFiltres = EncaissementsFiltrees;

  const reinitialiser = () => {
      const initialFilters = {
        search: "",
        dateDebut: "",
        dateFin: "",
        categorie: "",
        site: "",
        fournisseur: "",
        vehicule: "",
        vente: "",
        commande: "",
        prestation: "",
        modePaiement: "",
        statut: "",
        montantMin: "",
        montantMax: "",
        mois_courant: true,
        tous: false,
    };

    setFilters(initialFilters);
    setEncaissementsFiltrees(getFilteredEncaissements(Encaissements, initialFilters));
  };


  const rechercher = () => {

    setEncaissementsFiltrees(getFilteredEncaissements(Encaissements, filters));

  };

  const montantTotal = EncaissementsFiltrees.reduce(
      (total, Encaissement) => total + Number(Encaissement.montant || 0),
      0
  );

  const montantTotalPaye = EncaissementsFiltrees.reduce(
      (total, Encaissement) => total + Number(Encaissement.montant_paye || 0),
      0
  );

  const [visible, setVisible] = useState(false);

  return (
    <div className="product-page">

      <h1>Liste des Encaissements</h1>
      {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur", "Commercial"].includes(
        user?.role
      ) && (
        <section>
          <div>
            <NavLink to="/encaissements/nouveau">
              <button className="profile">
                <Package size={20} /> Ajouter un encaissement
              </button>
            </NavLink>
          </div>
        </section>
      )}

      <br/>

      <button className="profile" onClick={() => setVisible(!visible)}>
                {visible ? "Masquer" : "Afficher "} les critères de recherche
      </button>

 {visible && (
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

                {/* Ventes */}

                <div>

                    <label className="text-sm font-medium">
                        Vente
                    </label>

                    <select
                        name="vente"
                        value={filters.vente}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">
                            Tous
                        </option>

                        {ventes.map(v => (

                            <option
                                key={v.id}
                                value={v.id}
                            >
                                {v.reference} - {v.description}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Commandes */}

                <div>

                    <label className="text-sm font-medium">
                        Commande
                    </label>

                    <select
                        name="commande"
                        value={filters.commande}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">
                            Tous
                        </option>

                        {commandes.map(v => (

                            <option
                                key={v.id}
                                value={v.id}
                            >
                                {v.reference} - {v.description}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Prestation */}

                <div>

                    <label className="text-sm font-medium">
                        Prestation
                    </label>

                    <select
                        name="prestation"
                        value={filters.prestation}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >

                        <option value="">
                            Tous
                        </option>

                        {prestations.map(v => (

                            <option
                                key={v.id}
                                value={v.id}
                            >
                                {v.reference} - {v.description} -{v.date_prestation.split('T')[0]}
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

                {/* Période */}

                <div>
                    <label className="text-sm font-medium">
                        Période
                    </label>

                    <select
                        name="periode"
                        value={filters.mois_courant ? "mois_courant" : "tous"}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="tous">Tous</option>
                        <option value="mois_courant">Mois courant</option>
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
 )}
 
      {/** Carte résumé Encaissements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5" style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "15px" }}>

          <div className="bg-white rounded-xl shadow p-5 profile">
              <h4 className="text-gray-500 text-sm">
                  Nombre d' Encaissements
              </h4>

              <p className="text-3xl font-bold">
                  {EncaissementsFiltrees.length}
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

      </div>    
      

      <br/>
      {/*
      {
        isMobile ?

        <CardList

        data={EncaissementsFiltres}

        title={(v)=>v.reference}

        subtitle={(v)=>v.client_id}

        amount={(v)=>v.montant}

        date={(v)=>v.date_encaissement}

        actions={{

            view: (encaissement) => (

                <NavLink
                    to={`/encaissements/details/${encaissement.id}`}
                >
                    <button className="profile">
                        <Eye size={20}/>
                    </button>
                </NavLink>

            ),
            
            edit:(encaissement) => (

                <NavLink
                    to={`/encaissements/modifier/${encaissement.id}`}
                >
                    <button className="profile">
                        <Edit size={20}/>
                    </button>
                </NavLink>

            ),

            delete:(encaissement) => (

                <button
                    className="delete"
                    onClick={() => deleteEncaissement(encaissement.id)}
                >
                    <Trash2 size={20}/>
                </button>

            )

            }}

            />

            :

            <Table

            columns={columns}

            data={EncaissementsFiltres}

            actions={{

            view:(encaissement) => (

                <NavLink
                    to={`/encaissements/details/${encaissement.id}`}
                >
                    <button className="profile">
                        <Eye size={20}/>
                    </button>
                </NavLink>

            ),

            edit:handleEdit,

            delete:(encaissement) => (

                <button
                    className="delete"
                    onClick={() => deleteEncaissement(encaissement.id)}
                >
                    <Trash2 size={20}/>
                </button>

            )

            }}

            />

        }
    */}
    
    
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>catégorie</th>
              <th>libellé</th>
              <th>Date</th>
              <th>Montant total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {EncaissementsFiltrees.map((Encaissement) => (
              <tr key={Encaissement.id}>
                <td>{Encaissement.reference || "—"}</td>
                <td>{Encaissement.categorie}</td>
                <td>{Encaissement.libelle}</td>                
                <td>{formatDate(Encaissement.date_encaissement) || "—"}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(Encaissement.montant) || 0 } FG</td>
                <td>{Encaissement.statut || "—"}</td>
                {["Administrateur", "Responsable de production", "Superviseur", "Coordinateur", "Commercial"].includes(
                  user?.role
                ) && (
                  <td>
                    <NavLink to={`/encaissements/details/${Encaissement.id}`}>
                      <button className="profile">
                        <Eye size={20} />
                      </button>
                    </NavLink>
                    {/*<NavLink to={`/Encaissements/modifier/${Encaissement.id}`}>
                      <button className="profile">
                        <Pencil size={20} />
                      </button>
                    </NavLink>*/}
                    <button className="profileSupp" onClick={() => deleteEncaissement(Encaissement)}>
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

export default Encaissements;

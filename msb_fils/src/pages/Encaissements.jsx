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
      setEncaissementsFiltrees(EncaissementsData);

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

  const EncaissementsFiltres = Encaissements.filter(Encaissement => {

      const date = new Date(Encaissement.date_encaissement);

      return (

          (!filters.search ||
              Encaissement.libelle.toLowerCase().includes(filters.search.toLowerCase()) ||
              Encaissement.reference?.toLowerCase().includes(filters.search.toLowerCase()))

          &&

          (!filters.categorie ||
              Encaissement.categorie === filters.categorie)

          &&

          (!filters.site ||
              Encaissement.site_id === filters.site)

          &&

          (!filters.fournisseur ||
              Encaissement.fournisseur_id === filters.fournisseur)

          &&

          (!filters.vehicule ||
              Encaissement.vehicule_id === filters.vehicule)

          &&

          (!filters.modePaiement ||
              Encaissement.mode_paiement === filters.modePaiement)

          &&

          (!filters.statut ||
              Encaissement.statut === filters.statut)

          &&

          (!filters.dateDebut ||
              date >= new Date(filters.dateDebut))

          &&

          (!filters.dateFin ||
              date <= new Date(filters.dateFin + "T23:59:59"))

          &&

          (!filters.montantMin ||
              Number(Encaissement.montant) >= Number(filters.montantMin))

          &&

          (!filters.montantMax ||
              Number(Encaissement.montant) <= Number(filters.montantMax)))
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
    setEncaissementsFiltrees(Encaissements);
  };


  const rechercher = () => {

    console.log("In recherche ...", filters, Encaissements);

      const resultat = Encaissements.filter((Encaissement) => {

          // Recherche texte
          const rechercheOK =
              filters.search === "" ||

              Encaissement.libelle?.toLowerCase().includes(filters.search.toLowerCase()) ||

              Encaissement.reference?.toLowerCase().includes(filters.search.toLowerCase());

          // Catégorie
          const categorieOK =
              filters.categorie === "" ||
              Encaissement.categorie === filters.categorie;

          // Site
          const siteOK =
              filters.site === "" ||
              Encaissement.site_id == filters.site;

          // Fournisseur
          const fournisseurOK =
              filters.fournisseur === "" ||
              Encaissement.fournisseur_id == filters.fournisseur;

          // Véhicule
          const vehiculeOK =
              filters.vehicule === "" ||
              Encaissement.vehicule_id == filters.vehicule;

          // Paiement
          const paiementOK =
              filters.modePaiement === "" ||
              Encaissement.mode_paiement.toLowerCase().trim() === filters.modePaiement.toLowerCase().trim();

          // Statut
          const statutOK =
              filters.statut === "" ||
              Encaissement.statut === filters.statut;

          // Date
          const date = new Date(Encaissement.date_encaissement);

          const dateDebutOK =
              filters.dateDebut === "" ||
              date >= new Date(filters.dateDebut);

          const dateFinOK =
              filters.dateFin === "" ||
              date <= new Date(filters.dateFin + "T23:59:59");

          // Montants
          const montantMinOK =
              filters.montantMin === "" ||
              Number(Encaissement.montant) >= Number(filters.montantMin);

          const montantMaxOK =
              filters.montantMax === "" ||
              Number(Encaissement.montant) <= Number(filters.montantMax);

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

      setEncaissementsFiltrees(resultat);

  };

  const montantTotal = EncaissementsFiltrees.reduce(
      (total, Encaissement) => total + Number(Encaissement.montant || 0),
      0
  );

  const montantTotalPaye = EncaissementsFiltrees.reduce(
      (total, Encaissement) => total + Number(Encaissement.montant_paye || 0),
      0
  );

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
              <th>libelle</th>
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
                    <NavLink to={`/Encaissements/modifier/${Encaissement.id}`}>
                      <button className="profile">
                        <Pencil size={20} />
                      </button>
                    </NavLink>
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

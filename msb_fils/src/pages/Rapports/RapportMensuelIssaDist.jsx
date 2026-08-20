import { useEffect, useMemo, useState } from "react";
import {
    ShoppingCart,
    ShoppingBag,
    Wrench,
    Receipt,
    Wallet,
    FileDown,
    ChevronLeft,
    ChevronRight,
    RefreshCw
} from "lucide-react";

import {
    getRapportActivitesIssaDist
} from "../../services/rapportService";

import "./RapportMensuel.css";


function RapportMensuelIssaDist() {

    const [date, setDate] = useState(new Date());

    const [activites, setActivites] = useState([]);

    const [loading, setLoading] = useState(false);

    const [typeFilter, setTypeFilter] = useState("Tous");


    /*
     * =========================================
     * PERIODE
     * =========================================
     */

    const debutMois = useMemo(() => {

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );

    }, [date]);


    const debutMoisSuivant = useMemo(() => {

        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            1
        );

    }, [date]);


    const formatDateISO = (date) => {

        const annee = date.getFullYear();
        const mois = String(date.getMonth() + 1).padStart(2, "0");
        const jour = String(date.getDate()).padStart(2, "0");

        return `${annee}-${mois}-${jour}`;

    };


    /*
     * =========================================
     * NOM DU MOIS
     * =========================================
     */

    const nomMois = date.toLocaleDateString(
        "fr-FR",
        {
            month: "long",
            year: "numeric"
        }
    );


    /*
     * =========================================
     * CHARGEMENT
     * =========================================
     */

    const chargerRapport = async () => {

        try {

            setLoading(true);

            const data = await getRapportActivitesIssaDist(
                formatDateISO(debutMois),
                formatDateISO(debutMoisSuivant)
            );

            setActivites(data || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        chargerRapport();

    }, [date]);


    /*
     * =========================================
     * FILTRE
     * =========================================
     */

    const activitesFiltrees = useMemo(() => {

        if (typeFilter === "Tous") {

            return activites;

        } 
        
        if(typeFilter === "Vente"){
            return activites.filter(
                item => item.type_activite === "Issa vente"
            );
        }

        if(typeFilter === "Achat"){
            return activites.filter(
                item => item.type_activite === "Issa Achat"
            );
        }

        if(typeFilter === "Encaissement"){
            return activites.filter(
                item => item.type_activite === "Issa Encaissement"
            );
        }

        return activites.filter(
            item => item.type_activite === typeFilter
        );

    }, [activites, typeFilter]);


    /*
     * =========================================
     * STATISTIQUES
     * =========================================
     */

    const statistiques = useMemo(() => {

        const stats = {

            issaachats: 0,

            issaventes: 0,

            issaencaissements: 0

        };


        activites.forEach(item => {

            const montant =
                Number(item.montant) || 0;


            switch (item.type_activite) {

                case "Issa Achat":
                    stats.issaachats += montant;
                    break;
                
                case "Issa vente":
                    stats.issaventes += montant;
                    break;
                
                case "Issa Encaissement":
                    stats.issaencaissements += montant;
                    break;

                default:
                    break;

            }

        });


        stats.issaChiffreAffaires = stats.issaventes + stats.issaencaissements;

        stats.issaResultat = stats.issaChiffreAffaires - stats.issaachats;

        stats.issaTauxEncaissement = stats.issaChiffreAffaires > 0
            ? (stats.issaencaissements / stats.issaChiffreAffaires) * 100
            : 0;

        return stats;

    }, [activites]);


    /*
     * =========================================
     * FORMAT MONNAIE
     * =========================================
     */

    const formatMontant = (value) => {

        return new Intl.NumberFormat(
            "fr-FR"
        ).format(value) + " GNF";

    };


    /*
     * =========================================
     * NAVIGATION MOIS
     * =========================================
     */

    const moisPrecedent = () => {

        setDate(
            new Date(
                date.getFullYear(),
                date.getMonth() - 1,
                1
            )
        );

    };


    const moisSuivant = () => {

        setDate(
            new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                1
            )
        );

    };


    /*
     * =========================================
     * PDF
     * =========================================
     */

    const genererPDF = () => {

        window.print();

    };


    return (

        <div className="rapport-page">


            {/* HEADER */}

            <div className="rapport-header">

                <div>

                    <h1>
                        Rapport mensuel
                    </h1>

                    <p>
                        Synthèse des activités de l'entreprise
                    </p>

                </div>               


                <div className="rapport-actions">

                    <button
                        onClick={moisPrecedent}
                    >
                        <ChevronLeft size={18} />
                    </button>


                    <div className="rapport-mois">

                        {nomMois}

                    </div>


                    <button
                        onClick={moisSuivant}
                    >
                        <ChevronRight size={18} />
                    </button>


                    <button
                        className="btn-refresh"
                        onClick={chargerRapport}
                    >

                        <RefreshCw size={17} />

                    </button>


                    <button
                        className="btn-pdf"
                        onClick={genererPDF}
                    >

                        <FileDown size={17} />

                        Générer PDF

                    </button>

                </div>

            </div>


            {/* CARDS */}
            <div>

                <h2>
                    Issa Distribution
                </h2>                    

            </div>
            <div className="rapport-cards">

            
                <RapportCard
                    icon={<ShoppingCart />}
                    title="Issa Distribution Ventes"
                    value={formatMontant(
                        statistiques.issaventes
                    )}
                />



                <RapportCard
                    icon={<Wrench />}
                    title="Issa Distribution achats"
                    value={formatMontant(
                        statistiques.issaachats
                    )}
                />


                <RapportCard
                    icon={<Wallet />}
                    title="Issa Distribution Encaissements"
                    value={formatMontant(
                        statistiques.issaencaissements
                    )}
                />

            </div>

            {/* RESULTAT Issa Distribution */}

            <div className="rapport-finance">


                <div>

                    <span>
                        Chiffre d'affaires Issa Distribution
                    </span>

                    <strong>
                        {formatMontant(
                            statistiques.issaChiffreAffaires
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Résultat Issa Distribution
                    </span>

                    <strong>
                        {formatMontant(
                            statistiques.issaResultat
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Issa Taux d'encaissement
                    </span>

                    <strong>
                        {statistiques.issaTauxEncaissement.toFixed(2)}
                        %
                    </strong>

                </div>

            </div>           


            {/* FILTRES */}

                <div className="rapport-filtres">

                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(e.target.value)
                        }
                    >

                        <option value="Tous">
                            Toutes les activités
                        </option>                        

                        <option value="Issa Achat">
                            Issa Distribution Achats
                        </option>

                        <option value="Issa vente">
                            Issa Distribution Ventes
                        </option>

                        <option value="Issa Encaissement">
                            Issa Distribution Encaissements
                        </option>

                    </select>

            </div>
            
            {/* TABLE */}

            <div className="rapport-table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Type</th>

                            <th>Référence</th>

                            <th>Tiers</th>

                            <th>Mode paiement</th>

                            <th className="text-right">
                                Montant
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="loading"
                                >
                                    Chargement...
                                </td>

                            </tr>

                        ) : activitesFiltrees.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty"
                                >
                                    Aucune activité pour cette période
                                </td>

                            </tr>

                        ) : (

                            activitesFiltrees.map(
                                (item, index) => (

                                    <tr key={`${item.id}-${index}`}>

                                        <td>

                                            {new Date(
                                                item.date_operation
                                            ).toLocaleDateString(
                                                "fr-FR"
                                            )}

                                        </td>


                                        <td>

                                            <span
                                                className={`type type-${item.type_activite
                                                    .toLowerCase()
                                                    .replace("é", "e").replace(" ", "-")
                                                    }`}
                                            >

                                                {item.type_activite}

                                            </span>

                                        </td>


                                        <td>
                                            {item.reference || "-"}
                                        </td>


                                        <td>
                                            {item.tiers_nom || "-"}
                                        </td>


                                        <td>
                                            {item.mode_paiement || "-"}
                                        </td>


                                        <td className="text-right">

                                            {formatMontant(
                                                item.montant
                                            )}

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


function RapportCard({
    icon,
    title,
    value
}) {

    return (

        <div className="rapport-card">

            <div className="rapport-card-icon">

                {icon}

            </div>


            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>

    );

}


export default RapportMensuelIssaDist;
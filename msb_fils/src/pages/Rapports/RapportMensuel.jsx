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
    getRapportActivites
} from "../../services/rapportService";

import "./RapportMensuel.css";


function RapportMensuel() {

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

        return date
            .toISOString()
            .split("T")[0];

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

            const data = await getRapportActivites(
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

            ventes: 0,

            achats: 0,

            prestations: 0,

            depenses: 0,

            encaissements: 0,

            productions: 0

        };


        activites.forEach(item => {

            const montant =
                Number(item.montant) || 0;


            switch (item.type_activite) {

                case "Vente":
                    stats.ventes += montant;
                    break;

                case "Achat":
                    stats.achats += montant;
                    break;

                case "Prestation":
                    stats.prestations += montant;
                    break;

                case "Dépense":
                    stats.depenses += montant;
                    break;

                case "Encaissement":
                    stats.encaissements += montant;
                    break;

                case "Production":
                    stats.productions += montant;
                    break;

                default:
                    break;

            }

        });


        stats.chiffreAffaires =
            stats.ventes +
            stats.prestations + stats.encaissements;


        stats.resultat =
            stats.chiffreAffaires -
            stats.achats -
            stats.depenses - stats.productions;


        stats.tauxEncaissement =
            stats.chiffreAffaires > 0
                ? (
                    stats.encaissements /
                    stats.chiffreAffaires
                ) * 100
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

            <div className="rapport-cards">

                <RapportCard
                    icon={<ShoppingCart />}
                    title="Productions"
                    value={formatMontant(
                        statistiques.productions
                    )}
                />


                <RapportCard
                    icon={<ShoppingBag />}
                    title="Achats"
                    value={formatMontant(
                        statistiques.achats
                    )}
                />



                <RapportCard
                    icon={<Receipt />}
                    title="Dépenses"
                    value={formatMontant(
                        statistiques.depenses
                    )}
                />


            </div>

            <div className="rapport-cards">

            
                <RapportCard
                    icon={<ShoppingCart />}
                    title="Ventes"
                    value={formatMontant(
                        statistiques.ventes
                    )}
                />



                <RapportCard
                    icon={<Wrench />}
                    title="Prestations"
                    value={formatMontant(
                        statistiques.prestations
                    )}
                />


                <RapportCard
                    icon={<Wallet />}
                    title="Encaissements"
                    value={formatMontant(
                        statistiques.encaissements
                    )}
                />

            </div>

            {/* RESULTAT */}

            <div className="rapport-finance">


                <div>

                    <span>
                        Chiffre d'affaires
                    </span>

                    <strong>
                        {formatMontant(
                            statistiques.chiffreAffaires
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Résultat
                    </span>

                    <strong>
                        {formatMontant(
                            statistiques.resultat
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Taux d'encaissement
                    </span>

                    <strong>
                        {statistiques.tauxEncaissement.toFixed(2)}
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

                    <option value="Vente">
                        Ventes
                    </option>

                    <option value="Achat">
                        Achats
                    </option>

                    <option value="Prestation">
                        Prestations
                    </option>

                    <option value="Dépense">
                        Dépenses
                    </option>

                    <option value="Encaissement">
                        Encaissements
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
                                                    .replace("é", "e")
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


export default RapportMensuel;
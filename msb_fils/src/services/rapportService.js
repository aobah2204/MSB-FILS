import { supabase } from "../supabase";

export async function getBeneficesMensuels(dateDebut, dateFin) {

    const tables = await Promise.all([
        supabase
            .from("ventes")
            .select("date_vente, montant_total")
            .gte("date_vente", dateDebut)
            .lt("date_vente", dateFin),
        supabase
            .from("achats")
            .select("date_achat, montant_total")
            .gte("date_achat", dateDebut)
            .lt("date_achat", dateFin),
        supabase
            .from("depenses")
            .select("date_depense, montant")
            .gte("date_depense", dateDebut)
            .lt("date_depense", dateFin),
        supabase
            .from("encaissements")
            .select("date_encaissement, montant")
            .gte("date_encaissement", dateDebut)
            .lt("date_encaissement", dateFin),
        supabase
            .from("productions")
            .select("dateproduction, cout_total")
            .gte("dateproduction", dateDebut)
            .lt("dateproduction", dateFin)
    ]);

    const failedQuery = tables.find(({ error }) => error);
    if (failedQuery?.error) {
        console.error("Erreur calcul bénéfice mensuel :", failedQuery.error);
        throw failedQuery.error;
    }

    const months = new Map();
    const start = new Date(`${dateDebut}T00:00:00`);
    const end = new Date(`${dateFin}T00:00:00`);

    for (const month = new Date(start); month < end; month.setMonth(month.getMonth() + 1)) {
        const key = month.toISOString().slice(0, 7);
        months.set(key, {
            mois: key,
            ventes: 0,
            achats: 0,
            depenses: 0,
            encaissements: 0,
            productions: 0
        });
    }

    const addAmounts = (rows, dateField, amountField, totalField) => {
        (rows || []).forEach((row) => {
            const month = row[dateField]?.slice(0, 7);
            const result = months.get(month);
            if (result) result[totalField] += Number(row[amountField]) || 0;
        });
    };

    addAmounts(tables[0].data, "date_vente", "montant_total", "ventes");
    addAmounts(tables[1].data, "date_achat", "montant_total", "achats");
    addAmounts(tables[2].data, "date_depense", "montant", "depenses");
    addAmounts(tables[3].data, "date_encaissement", "montant", "encaissements");
    addAmounts(tables[4].data, "dateproduction", "cout_total", "productions");

    return Array.from(months.values()).map((month) => ({
        ...month,
        benefice: month.ventes + month.encaissements - month.achats - month.depenses - month.productions
    }));
}

export async function getRapportActivites(dateDebut, dateFin) {

    const { data, error } = await supabase
        .from("vw_rapport_activites")
        .select("*")
        .gte("date_operation", dateDebut)
        .lt("date_operation", dateFin)
        .order("date_operation", {
            ascending: false
        });

    if (error) {
        console.error("Erreur rapport :", error);
        throw error;
    }

    return data;
}

export async function getRapportActivitesIssaDist(dateDebut, dateFin) {

    const { data, error } = await supabase
        .from("vw_rapport_activites_issa_dist")
        .select("*")
        .gte("date_operation", dateDebut)
        .lt("date_operation", dateFin)
        .order("date_operation", {
            ascending: false
        });

    if (error) {
        console.error("Erreur rapport :", error);
        throw error;
    }

    return data;
}
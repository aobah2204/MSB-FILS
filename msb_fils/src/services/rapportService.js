import { supabase } from "../supabase";

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
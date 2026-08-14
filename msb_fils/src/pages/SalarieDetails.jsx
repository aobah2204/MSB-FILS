import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("fr-FR").format(num) + " FG";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
}

function SalarieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [salarie, setSalarie] = useState({
    id: "",
    fullname: "",
    role: "",
    telephone: "",
    email: "",
    adresse: "",
  });

  const [salaireList, setSalaireList] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSalarie() {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      alert("Salarié introuvable");
      navigate("/salaries");
      return;
    }

    setSalarie(data);
  }

  async function loadSalairePercu() {
    const { data } = await supabase
      .from("depenses")
      .select("*")
      .eq("utilisateur_id", id)
      .eq("type_liaison", "SALARIE")
      .order("date_depense", { ascending: false });

    setSalaireList(data || []);
  }

  async function loadActivityData() {
    const [{ data: depensesData }, { data: encaissementsData }, { data: ventesData }, { data: commandesData },
        { data: prestationsData }, { data: livraisonsData }, { data: productionsData }
    ] = await Promise.all([
      supabase
        .from("depenses")
        .select("id, montant, date_depense, created_user_id, utilisateur_id")
        .or(`created_user_id.eq.${id},utilisateur_id.eq.${id}`),
      supabase
        .from("encaissements")
        .select("id, montant, date_encaissement, created_user_id, utilisateur_id")
        .or(`created_user_id.eq.${id},utilisateur_id.eq.${id}`),
      supabase
        .from("ventes")
        .select("id, montant_total, date_vente, user_created_id, utilisateur_id")
        .or(`user_created_id.eq.${id},utilisateur_id.eq.${id}`),
      supabase
        .from("commandes")
        .select("id, montant_total, date_commande, user_create_id, utilisateur_id")
        .or(`user_create_id.eq.${id},utilisateur_id.eq.${id}`),
      supabase
        .from("achats")
        .select("id, montant, date_achat, user_create_id, utilisateur_id")
        .or(`user_create_id.eq.${id},utilisateur_id.eq.${id}`),
      supabase
        .from("livraisons")
        .select("id, montant, date_livraison, user_created_id, utilisateur_id")
        .or(`user_created_id.eq.${id},utilisateur_id.eq.${id}`),
      supabase
        .from("productions")
        .select("id, montant, date_production, user_creation_id, utilisateur_id")
        .or(`user_creation_id.eq.${id},utilisateur_id.eq.${id}`),
    ]);

    const map = new Map();

    const addEntry = (date, label, amount) => {
      if (!date) return;
      const key = new Date(date).toISOString().slice(0, 7);
      const monthLabel = new Date(`${key}-01T00:00:00`).toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });

      const current = map.get(key) || {
        mois: monthLabel,
        Saisie: 0,
        Ventes: 0,
        Dépenses: 0,
        Encaissements: 0,
        prestations: 0,
        livraisons: 0,
        productions: 0,
      };

      current[label] += Number(amount || 0);
      map.set(key, current);
    };

    (depensesData || []).forEach((item) => {
      addEntry(item.date_depense, "Dépenses", item.montant || 0);
      addEntry(item.date_depense, "Saisie", 1);
    });

    (encaissementsData || []).forEach((item) => {
      addEntry(item.date_encaissement, "Encaissements", item.montant || 0);
      addEntry(item.date_encaissement, "Saisie", 1);
    });

    (ventesData || []).forEach((item) => {
      addEntry(item.date_vente, "Ventes", item.montant_total || 0);
      addEntry(item.date_vente, "Saisie", 1);
    });

    (commandesData || []).forEach((item) => {
      addEntry(item.date_commande, "Saisie", 1);
    });

    (prestationsData || []).forEach((item) => {
      addEntry(item.date_prestation, "prestations", item.montant || 0);
      addEntry(item.date_prestation, "Saisie", 1);
    });

    (livraisonsData || []).forEach((item) => {
        addEntry(item.date_livraison, "livraisons", item.montant || 0);
        addEntry(item.date_livraison, "Saisie", 1);
    });

    (productionsData || []).forEach((item) => {
        addEntry(item.date_production, "productions", item.montant || 0);
        addEntry(item.date_production, "Saisie", 1);
    });

    setActivityData(Array.from(map.values()).sort((a, b) => {
      const dateA = new Date(a.mois);
      const dateB = new Date(b.mois);
      return dateA - dateB;
    }));
  }

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadSalarie(), loadSalairePercu(), loadActivityData()]);
      setLoading(false);
    };

    loadAll();
  }, [id]);

  const totalSalaires = useMemo(
    () => salaireList.reduce((sum, item) => sum + Number(item.montant || 0), 0),
    [salaireList]
  );

  if (loading) {
    return <div className="product-page">Chargement du profil salarié...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails du salarié</h1>

      <div className="cards" style={{ marginTop: 20 }}>
        <div className="card">
          <h3>Information</h3>
          <p><strong>Nom :</strong> {salarie.fullname || "—"}</p>
          <p><strong>Rôle :</strong> {salarie.role || "—"}</p>
          <p><strong>Téléphone :</strong> {salarie.telephone || "—"}</p>
          <p><strong>Email :</strong> {salarie.email || "—"}</p>
          <p><strong>Adresse :</strong> {salarie.adresse || "—"}</p>
        </div>

        <div className="card">
          <h3>Salaires perçus</h3>
          <p><strong>Total :</strong> {formatCurrency(totalSalaires)}</p>
          <p><strong>Nombre de paiements :</strong> {salaireList.length}</p>
          <p><strong>Dernier paiement :</strong> {salaireList[0] ? formatDate(salaireList[0].date_depense) : "—"}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Liste des salaires perçus</h3>

        {salaireList.length === 0 ? (
          <p>Aucun salaire enregistré pour ce salarié.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Libellé</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {salaireList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.reference || "—"}</td>
                    <td>{item.libelle || "—"}</td>
                    <td>{formatDate(item.date_depense)}</td>
                    <td>{formatCurrency(item.montant)}</td>
                    <td>{item.statut || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Activités du salarié</h3>

        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip formatter={(value) => new Intl.NumberFormat("fr-FR").format(value)} />
              <Legend />
                <Bar dataKey="Saisie" fill="#6366f1" name="Saisie" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Ventes" fill="#22c55e" name="Ventes" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Dépenses" fill="#f97316" name="Dépenses" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Encaissements" fill="#10b981" name="Encaissements" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prestations" fill="#3b82f6" name="Prestations" radius={[4, 4, 0, 0]} />
                <Bar dataKey="livraisons" fill="#f59e0b" name="Livraisons" radius={[4, 4, 0, 0]} />
                <Bar dataKey="productions" fill="#8b5cf6" name="Productions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/salaries")} style={{ marginTop: 20 }}>
        Retour
      </button>
    </div>
  );
}

export default SalarieDetails;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import "../CSS/Clients.css";

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [totalVentes, setTotalVentes] = useState(0);

  async function loadClientData() {
    try {
      // Fetch client info
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (clientError || !clientData) {
        alert("Client introuvable");
        navigate("/clients");
        return;
      }

      setClient(clientData);

      // Fetch commandes for this client
      const { data: commandesData } = await supabase
        .from("commandes")
        .select("montant_total")
        .eq("client_id", id);

      if (commandesData) {
        const total = commandesData.reduce((sum, cmd) => sum + (cmd.montant_total || 0), 0);
        setTotalCommandes(total);
      }

      // Fetch ventes for this client
      const { data: ventesData } = await supabase
        .from("ventes")
        .select("montant_total")
        .eq("client_id", id);

      if (ventesData) {
        const total = ventesData.reduce((sum, vte) => sum + (vte.montant_total || 0), 0);
        setTotalVentes(total);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du client :", error);
    }
  }

  useEffect(() => {
    loadClientData();
  }, [id]);

  if (!client) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Fiche Client #{id}</h1>

      <div className="card">
        <p>
          <strong>Nom :</strong> {client.nom} {client.prenom}
        </p>
        <p>
          <strong>Société :</strong> {client.societe || "—"}
        </p>
        <p>
          <strong>Adresse :</strong> {client.adresse || "—"}
        </p>
        <p>
          <strong>Téléphone :</strong> {client.telephone || "—"}
        </p>
        <p>
          <strong>Email :</strong> {client.email || "—"}
        </p>
      </div>

      <h3>Résumé d'activité</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            padding: "15px",
            backgroundColor: "#e8f5e9",
            border: "2px solid #4caf50",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>Total Commandes</h4>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#1b5e20" }}>
            {new Intl.NumberFormat("fr-FR").format(totalCommandes.toFixed(2))} Fg
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff3e0",
            border: "2px solid #ff9800",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: "#e65100" }}>Total Ventes</h4>
          <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#bf360c" }}>
            {new Intl.NumberFormat("fr-FR").format(totalVentes.toFixed(2))} Fg
          </p>
        </div>
      </div>

      <button className="profile" type="button" onClick={() => navigate("/clients")}>
        Retour
      </button>
    </div>
  );
}

export default ClientDetails;

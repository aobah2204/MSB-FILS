import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, Pencil, Trash2, ShoppingCart, FileText } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function Commandes() {

    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [produitsCommande, setProduitsCommande] = useState([]);

    async function loadData() {
        const [{ data: ordersData }, { data: clientsData }] = await Promise.all([
        supabase.from("commandes").select("*").order("date_commande", { ascending: false }),
        supabase.from("clients").select("id, nom, prenom"),
        ]);

        setOrders(ordersData || []);
        setClients(clientsData || []);
    }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteOrder(order) {
    if (!window.confirm("Supprimer cette commande ?")) return;

    await supabase.from("commandeproduits").delete().eq("commande_id", order.id);
    const { error } = await supabase.from("commandes").delete().eq("id", order.id);

    if (error) {
      alert("Suppression impossible : " + error.message);
      return;
    }

    loadData();
  }

    const clientMap = Object.fromEntries(clients.map((client) => [client.id, `${client.nom} ${client.prenom}`]));
    const [selectedCommand, setSelectedCommande] = useState();

    async function selectCommande(order) {

        const commande = orders.find(c => c.id === order.id);

        if (!commande) {
            console.error("Commande introuvable");
            return;
        }       

        setSelectedCommande(commande);
        //console.log("selected commande : ", selectedCommand);
        //getOrderLines(order);

        genererBonCommande(order);
    }

    async function getOrderLines(commande){

        const {data: Lines} = await supabase.from("commandeproduits").select("*").eq("commande_id", commande?.id);
        if(Lines){
            setProduitsCommande(Lines);
        }
        console.log("commande lignes : ", Lines)
        setProduitsCommande(Lines);
        return Lines
    }

    function formatMontant(value) {

        return new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(value));

    }

    async function genererBonCommande(order) {

      const {data: Lines} = await supabase.from("commandeproduits").select("*, products(nom, reference)").eq("commande_id", order?.id);
      if(Lines){
          setProduitsCommande(Lines);
      }

      const doc = new jsPDF();

      doc.setFont("helvetica");
      doc.setFontSize(10);
      doc.text("BON DE COMMANDE", 70, 20);

      doc.setFontSize(12);

      doc.text("Client : " + (clientMap[order.client_id] || "—"), 15, 40);
      doc.text("Date : " + (order.date_commande.split("T")[0] || "—"), 15, 48);
      doc.text("Référence : " + (order.reference || "—"), 15, 56);

      // Calcul du total
      const totalCommande = Lines.reduce(
          (sum, line) => sum + Number(line.montant_ligne || 0),
          0
      );

      autoTable(doc, {
          startY: 70,
          head: [["Produit", "Quantité", "Prix", "Total"]],
          body: 
              Lines.map(p => [
                  `${p.products.reference} - ${p.products.nom}`  || "—",
                  p.quantite || 0,    
                  p.prix_unitaire || 0,
                  p.montant_ligne || 0
              ]),

          theme: "grid",

          headStyles: {

              fillColor: [37, 99, 235],
              halign: "center",
              fontStyle: "bold"

          },

          styles: {

              valign: "middle"

          },

          columnStyles: {

              0: { halign: "left" },      // Produit
              1: { halign: "center" },    // Quantité
              2: { halign: "right" },     // Prix
              3: { halign: "right" }      // Total

          },

          foot: [[
              "",
              "",
              "TOTAL",
              totalCommande + " GNF"
          ]],

          footStyles: {

              fillColor: [240, 240, 240],
              textColor: 0,
              fontStyle: "bold"

          }

      });

      doc.save("BonCommande.pdf");
  }

  return (
    <div className="product-page">
      <h1>Liste des commandes</h1>

      {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur', "Commercial"].includes(user?.role) && (
        <div>
          <NavLink to="/commandes/nouveau">
            <button className="profile" type="button">
              <ShoppingCart size={20} /> Nouvelle commande
            </button>
          </NavLink>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.reference || "—"}</td>
                <td>{clientMap[order.client_id] || "—"}</td>
                <td>{new Date(order.date_commande).toLocaleDateString("fr-FR") || "—"}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(order.montant_total)} FG</td>
                <td>{order.statut || "En cours"}</td>
                <td>
                  <NavLink to={`/commandes/details/${order.id}`}>
                    <button className="profile" type="button"><Eye size={20} /></button>
                  </NavLink>
                  {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur', "Commercial"].includes(user?.role) && (
                    <>
                      <NavLink to={`/commandes/modifier/${order.id}`}>
                        <button className="profile" type="button"><Pencil size={20} /></button>
                      </NavLink>
                      <button className="profileSupp" type="button" onClick={() => deleteOrder(order)}>
                        <Trash2 size={20} />
                      </button>
                      <button className="profile" onClick={() => selectCommande(order)}>
                            <FileText size={20} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Commandes;

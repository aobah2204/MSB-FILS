import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Eye, Pencil, Trash2, HandCoins, FileText } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/Logo.png";


function Ventes() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);

  async function loadData() {
    const [{ data: salesData }, { data: clientsData }] = await Promise.all([
      supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
      supabase.from("clients").select("id, nom, prenom, adresse, telephone, email, societe"),
    ]);

    setSales(salesData || []);
    setClients(clientsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function deleteSale(sale) {
    if (!window.confirm("Supprimer cette vente ?")) return;

    await supabase.from("venteproduits").delete().eq("vente_id", sale.id);
    const { error } = await supabase.from("ventes").delete().eq("id", sale.id);

    if (error) {
      alert("Suppression impossible : " + error.message);
      return;
    }

    loadData();
  }

    const clientMap = Object.fromEntries(clients.map((client) => [client.id, `${client.nom} ${client.prenom}`]));
    const clientMapAdress = Object.fromEntries(clients.map((client) => [client.id, `${client.adresse}`]));
    const clientMapTel = Object.fromEntries(clients.map((client) => [client.id, `${client.telephone}`]));
    const clientMapSoc = Object.fromEntries(clients.map((client) => [client.id, `${client.societe}`]));
    const clientMapMail = Object.fromEntries(clients.map((client) => [client.id, `${client.email}`]));

  async function ClientFullName(id){
    const client = await supabase.from("clients").select("nom, prenom, adresse, telephone, email, societe").eq("id",id);

    return client.nom + " "+ client.prenom

  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
  }

  const [selectedVente, setSelectedVente] = useState();
  async function selectVente(sale) {

        const vente = sales.find(c => c.id === sale.id);

        if (!vente) {
            console.error("Commande introuvable");
            return;
        }       

        setSelectedVente(vente);
        //console.log("selected commande : ", selectedCommand);
        //getOrderLines(order);

        genererFacture(vente);
  }

  const [produitsVente, setProduitsVente] = useState([]);
  const [marchandisesVente, setMarchandisesVente] = useState([]);
  async function genererFacture(order) {
  
        const [{data: LinesP}, {data: LinesM}] = await Promise.all([
          await supabase.from("venteproduits").select("*, products(nom, description)").eq("vente_id", order?.id),
          await supabase.from("ventemarchandises").select("*, marchandises(nom, description)").eq("vente_id", order?.id),
        ])

        if(LinesP){
            setProduitsVente(LinesP);
        }
        if(LinesM){
            setMarchandisesVente(LinesM);
        }
  
        const doc = new jsPDF();  
        doc.setFontSize(22);

        // Logo
        doc.addImage(
                  logo,
                  "PNG",
                  15,   // X
                  10,   // Y
                  30,   // largeur
                  30    // hauteur
              );
        
        doc.text("Facture "+order?.reference, 70, 20);
  
        
  
        const leftX = 15;
        const rightX = 120;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");

        // Titres
        doc.text("FOURNISSEUR", leftX, 35);
        doc.text("CLIENT", rightX, 35);

        doc.setFont("helvetica", "normal");

        // Fournisseur
        doc.text("MSB & FILS", leftX, 43);
        doc.text("Conakry - Guinée", leftX, 49);
        doc.text("Tel : +224 620 00 00 00", leftX, 55);
        doc.text("Email : contact@msbfils.com", leftX, 61);

        // Client
        doc.text(clientMap[order.client_id] || "-", rightX, 43);
        doc.text(clientMapAdress[order.client_id] || "-", rightX, 49);
        doc.text(clientMapTel[order.client_id] || "-", rightX, 55);
        doc.text(clientMapSoc[order.client_id] || "-", rightX, 61);
        doc.text(clientMapMail[order.client_id] || "-", rightX, 67);
  
        // Calcul du total
        const totalP = LinesP.reduce(
            (sum, line) => sum + Number(line.montant_ligne || 0),
            0
        );

        // Calcul du total
        const totalM = LinesM.reduce(
            (sum, line) => sum + Number(line.montant_ligne || 0),
            0
        );

        const totalVente = totalM +  totalP;
        
  
        // Produits
        autoTable(doc, {
            startY: 75,
            head: [["Produit", "Quantité", "Prix", "Total"]],
            body: 
                LinesP.map(p => [
                    `${p.products?.nom} - ${p.products?.description}`  || "—",
                    p.quantite || 0,    
                    new Intl.NumberFormat("en-US").format(p.prix_unitaire) || 0,
                    new Intl.NumberFormat("en-US").format(p.montant_ligne) || 0
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
                new Intl.NumberFormat("en-US").format(totalP) + " GNF"
            ]],
  
            footStyles: {
  
                fillColor: [240, 240, 240],
                textColor: 0,
                fontStyle: "bold"
  
            }
  
        });

        // position de fin
        const y = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");

        doc.text("Marchandises", 15, y);

        // Marchandises
        autoTable(doc, {
            startY: y + 5,
            head: [["Marchandise", "Quantité", "Prix", "Total"]],
            body: 
                LinesM.map(p => [
                    `${p.marchandises.nom} - ${p.marchandises.description}`  || "—",
                    p.quantite || 0,    
                    new Intl.NumberFormat("en-US").format(p.prix_unitaire) || 0,
                    new Intl.NumberFormat("en-US").format(p.montant_ligne) || 0
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
                new Intl.NumberFormat("en-US").format(totalM) + " GNF"
            ]],
  
            footStyles: {
  
                fillColor: [240, 240, 240],
                textColor: 0,
                fontStyle: "bold"
  
            }
  
        });

        const montantpaye = new Intl.NumberFormat("en-US").format(order.montant_paye);
        const resteapaye = new Intl.NumberFormat("en-US").format(totalP + totalM - order.montant_paye);
        const totalFacture = new Intl.NumberFormat("en-US").format(order.montant_total);

        const z = doc.lastAutoTable.finalY + 15;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Montant Payé : " +
            montantpaye +
            " GNF",
            15,
            z
        );

        doc.text(
            "Rest à Payer : " +
            (resteapaye) +
            " GNF",
            15,
            z+15
        );

        doc.text(
            "Montant total : " +
            (totalFacture) +
            " GNF",
            15,
            z+30
        );
  
        doc.save("Facture_vente_"+order.reference+".pdf");
  }

  return (
    <div className="product-page">
      <h1>Liste des ventes</h1>

      {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur', "Commercial"].includes(user?.role) && (
        <div>
          <NavLink to="/ventes/nouveau">
            <button className="profile" type="button">
              <HandCoins size={20} /> Nouvelle vente
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
              <th>Mode paiement</th>
              <th>Total à payer</th>
              <th>Reste à payer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.reference || "—"}</td>
                <td>{clientMap[sale.client_id] || "—"}</td>
                <td>{formatDate(sale.date_vente) || "—"}</td>                
                <td>{sale.mode_paiement || "—"}</td>
                <td>{new Intl.NumberFormat("fr-FR").format(sale.montant_total) || 0} FG </td>
                <td>{new Intl.NumberFormat("fr-FR").format(sale.montant_total - sale.montant_paye) || 0} FG </td>
                <td>
                  <NavLink to={`/ventes/details/${sale.id}`}>
                    <button className="profileView" type="button"><Eye size={20} /></button>
                  </NavLink>
                  {['Administrateur', 'Responsable de production', 'Superviseur', 'Coordinateur', "Commercial"].includes(user?.role) && (
                    <>
                      <NavLink to={`/ventes/modifier/${sale.id}`}>
                        <button className="profileEdit" type="button"><Pencil size={20} /></button>
                      </NavLink>
                      <button className="profileSupp" type="button" onClick={() => deleteSale(sale)}>
                        <Trash2 size={20} />
                      </button>
                      <button className="profile" onClick={() => selectVente(sale)}>
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

export default Ventes;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

function CommandCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    reference: "",
    client_id: "",
    date_commande: "",
    statut: "En cours",
    description: "",
    user_create_id: user?.id,
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  async function loadOptions() {
    const [{ data: clientsData }, { data: productsData }] = await Promise.all([
      supabase.from("clients").select("id, nom, prenom"),
      supabase.from("products").select("id, nom, categorie, prixVente"),
    ]);

    setClients(clientsData || []);
    setProducts(productsData || []);
  }

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    const total = productLines.reduce((sum, line) => {
      return sum + (Number(line.quantite || 0) * Number(line.prix_unitaire || 0));
    }, 0);
    setTotalAmount(total);
  }, [productLines]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addProductLine() {
    setProductLines([
      ...productLines,
      {
        produit_id: "",
        quantite: 0,
        prix_unitaire: 0,
      },
    ]);
  }

  function updateProductLine(index, field, value) {
    const copy = [...productLines];
    const numValue = field !== "produit_id" ? Number(value) : value;

    copy[index][field] = numValue;

    if (field === "produit_id") {
      const selectedProduct = products.find((p) => String(p.id) === String(value));
      copy[index].prix_unitaire = Number(selectedProduct?.prixVente || 0);
    }

    setProductLines(copy);
  }

  function removeProductLine(index) {
    setProductLines(productLines.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.client_id) {
      alert("Veuillez sélectionner un client");
      return;
    }

    if (productLines.length === 0) {
      alert("Veuillez ajouter au moins un produit");
      return;
    }

    const commandePayload = {
      reference: form.reference,
      client_id: form.client_id,
      date_commande: form.date_commande || new Date().toISOString().slice(0, 10),
      statut: form.statut,
      description: form.description,
      montant_total: totalAmount,
      user_create_id: user?.id,
    };

    const { data: insertedCommande, error: insertError } = await supabase
      .from("commandes")
      .insert(commandePayload)
      .select()
      .single();

    if (insertError) {
      alert("Commande non enregistrée : " + insertError.message);
      return;
    }

    for (const line of productLines) {
      if (!line.produit_id || !line.quantite) continue;

      const linePayload = {
        commande_id: insertedCommande.id,
        produit_id: line.produit_id,
        quantite: Number(line.quantite),
        prix_unitaire: Number(line.prix_unitaire),
        montant_ligne: Number(line.quantite) * Number(line.prix_unitaire),
      };

      const { error: lineError } = await supabase.from("commandeproduits").insert(linePayload);

      if (lineError) {
        alert("Erreur lors de l'ajout du produit : " + lineError.message);
        return;
      }
    }

    alert("Commande enregistrée");
    navigate("/commandes");
  }

  return (
    <div className="product-page">
      <h1>Nouvelle commande</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>Référence</label>
        <input name="reference" value={form.reference} onChange={handleFormChange} />

        <label>Client</label>
        <select name="client_id" value={form.client_id} onChange={handleFormChange} required>
          <option value="">Choisir un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.nom} {client.prenom}</option>
          ))}
        </select>

        <label>Date commande</label>
        <input type="date" name="date_commande" value={form.date_commande} onChange={handleFormChange} />

        <label>Statut</label>
        <select name="statut" value={form.statut} onChange={handleFormChange}>
          <option value="En cours">En cours</option>
          <option value="Validée">Validée</option>
          <option value="Livrée">Livrée</option>
          <option value="Annulée">Annulée</option>
        </select>

        <label>Description</label>
        <input name="description" value={form.description} onChange={handleFormChange} />

        <h3>Produits</h3>

        {productLines.map((line, index) => (
          <div className="grid" key={index} style={{ marginBottom: "20px", gap: "10px" }}>
            <div>
              <label>Produit</label>
              <select
                value={line.produit_id || ""}
                onChange={(e) => updateProductLine(index, "produit_id", e.target.value)}
              >
                <option value="">Choisir</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom}-{p.categorie}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Quantité</label>
              <input
                type="number"
                value={line.quantite || ""}
                onChange={(e) => updateProductLine(index, "quantite", e.target.value)}
              />
            </div>

            <div>
              <label>Prix unitaire</label>
              <input
                type="number"
                onChange={(e) => updateProductLine(index, "prix_unitaire", e.target.value)}
              />
            </div>

            <div>
              <label>Total ligne</label>
              <output>
                {Number(line.quantite || 0) * Number(line.prix_unitaire || 0)}
              </output>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                className="profileSupp"
                type="button"
                onClick={() => removeProductLine(index)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        <button className="profile" type="button" onClick={addProductLine}>
          + Ajouter produit
        </button>

        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
          <label><strong>Montant total :</strong></label>
          <output style={{ fontSize: "18px", fontWeight: "bold" }}>{totalAmount}</output> Fg
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className="profile" type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

export default CommandCreate;

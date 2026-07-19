import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { supabase } from "../../supabase";
import Select from "react-select";
import { selectStyle } from "../../components/selectStyle";


function IssaVenteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reference: "",
    client_id: "",
    date_vente: "",
    mode_paiement: "",
    description: "",
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  async function loadData() {
    const [{ data: venteData }, { data: clientsData }, { data: productsData }, { data: linesData }] = await Promise.all([
      supabase.from("issaventes").select("*").eq("id", id).maybeSingle(),
      supabase.from("clients").select("id, nom, prenom"),
      supabase.from("issaproducts").select("id, nom, prixVente"),
      supabase.from("issaventeproduits").select("*").eq("vente_id", id),
    ]);

    setClients(clientsData || []);
    setProducts(productsData || []);

    if (venteData) {
      setForm(venteData);
    }

    if (linesData && linesData.length > 0) {
      setProductLines(linesData);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

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

    const ventePayload = {
      reference: form.reference,
      client_id: form.client_id,
      date_vente: form.date_vente,
      mode_paiement: form.mode_paiement,
      description: form.description,
      montant_total: totalAmount,
    };

    const { error: updateError } = await supabase
      .from("issaventes")
      .update(ventePayload)
      .eq("id", id);

    if (updateError) {
      alert("Vente non modifiée : " + updateError.message);
      return;
    }

    // await supabase.from("venteproduits").delete().eq("vente_id", id);

    for (const line of productLines) {
      if (!line.produit_id || !line.quantite) continue;

      const lineData = {
        vente_id: id,
        produit_id: line.produit_id,
        quantite: Number(line.quantite),
        prix_unitaire: Number(line.prix_unitaire),
        montant_ligne: Number(line.quantite) * Number(line.prix_unitaire),
      };

      if (!line.id) {
        const { error: insertError } = await supabase.from("issaventeproduits").insert(lineData);
        if (insertError) {
          alert("Erreur lors de l'ajout du produit : " + insertError.message);
          return;
        }
      } else {
        const { error: updateLineError } = await supabase
          .from("issaventeproduits")
          .update(lineData)
          .eq("id", line.id);
        if (updateLineError) {
          alert("Erreur lors de la modification du produit : " + updateLineError.message);
          return;
        }
      }
    }


    alert("Vente mise à jour");
    navigate("/issaventes");
  }

  // Select filter and style 
  const clientsOptions = clients.map((c) => ({
      value: c.id,
      label: `${c.nom} - ${c.prenom}`,
      client: c
  }));

  const handleFormChangeClient = (selectedOption) => {
      setForm((prev) => ({
          ...prev,
          client_id: selectedOption ? selectedOption.value : null,
      }));
  };

  return (
    <div className="product-page">
      <h1>Modifier la vente</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>Référence</label>
        <input name="reference" value={form.reference || ""} onChange={handleFormChange} />

        {/*
        <label>Client</label>
        <select name="client_id" value={form.client_id || ""} onChange={handleFormChange} required>
          <option value="">Choisir un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.nom}</option>
          ))}
        </select>
        */}

        <label>CLients</label>
        <div>              

            <Select className="list_select"
                options={clientsOptions}

                placeholder="Choisir un client..."

                isSearchable

                styles={selectStyle}

                name="client_id"

                value={
                    clientsOptions.find(
                        option => option.value === form.client_id
                    ) || null
                }

                onChange={handleFormChangeClient}
            />

        </div>

        <label>Date vente</label>
        <input type="date" name="date_vente" value={form.date_vente.split('T')[0] || ""} onChange={handleFormChange} />

        <label>Mode de paiement</label>
        <input name="mode_paiement" value={form.mode_paiement || ""} onChange={handleFormChange} />

        <label>Description</label>
        <input name="description" value={form.description || ""} onChange={handleFormChange} />

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
                  <option key={p.id} value={p.id}>{p.nom}</option>
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
                value={line.prix_unitaire || ""}
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

        <div className="profile" style={{ backgroundColor: "#a8415b"}}>
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

export default IssaVenteEdit;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";

import { selectStyle } from "../components/selectStyle";
import Marchandises from "./Marchandises";

function VenteCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    reference: "",
    client_id: "",
    site_id: "",
    date_vente: "",
    mode_paiement: "",
    description: "",
    user_create_id: user?.id,
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [marchandises, setMarchandises] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [marchandiseLines, setMarchandiseLines] = useState([]);
  const [sites, setSites] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  async function loadOptions() {
    const [{ data: clientsData }, { data: productsData }, { data: sitesData }, { data: marchandiseData }, { data: fournisseursData}] = await Promise.all([
      supabase.from("clients").select("id, nom, prenom"),
      supabase.from("products").select("id, nom, categorie, prixVente"),
      supabase.from("siteproduction").select("id, nom, adresse"),
      supabase.from("marchandises").select("id, nom, categorie, description"),
      supabase.from("fournisseurs").select("id, nom, prenom, societe"),
    ]);

    setClients(clientsData || []);
    setFournisseurs(fournisseursData || []);
    setProducts(productsData || []);
    setSites(sitesData || []);
    setMarchandises(marchandiseData || []);
  }

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    const totalP = productLines.reduce((sum, line) => {
      return sum + (Number(line.quantite || 0) * Number(line.prix_unitaire || 0));
    }, 0);
    const totalM = marchandiseLines.reduce((sum, line) => {
      return sum + (Number(line.quantite || 0) * Number(line.prix_unitaire || 0));
    }, 0);
    setTotalAmount(totalP + totalM);
  }, [productLines, marchandiseLines]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addProductLine() {
    setProductLines([
      ...productLines,
      {
        produit_id: "",
        site_id: "",
        quantite: 0,
        prix_unitaire: 0,
      },
    ]);
  }

  function addMarchandiseLine() {
    setMarchandiseLines([
      ...marchandiseLines,
      {
        marchandise_id: "",
        fournisseur_id: "",
        quantite: 0,
        prix_unitaire: 0,
      },
    ]);
  }

  function updateProductLine(index, field, value) {
      const copy = [...productLines];

      const numValue =
          field !== "produit_id" && field !== "site_id"
              ? Number(value)
              : value;

      copy[index][field] = numValue;

      // Si le produit ou le site change, on recherche le bon produit
      if (field === "produit_id" || field === "site_id") {

          const selectedProduct = products.find(
              (p) =>
                  String(p.id) === String(copy[index].produit_id) &&
                  String(p.site_id) === String(copy[index].site_id)
          );

          copy[index].prix_unitaire = Number(selectedProduct?.prixVente ?? 0);
      }

      setProductLines(copy);
  }

  function updateMarchandiseLine(index, field, value) {
      const copy = [...marchandiseLines];

      const numValue =
          field !== "marchandise_id" && field !== "fournisseur_id"
              ? Number(value)
              : value;

      copy[index][field] = numValue;

      // Si le marchandise ou le fournisseur change, on recherche le bon produit
      if (field === "marchandise_id" || field === "fournisseur_id") {

          const selectedMarchandise= marchandises.find(
              (p) =>
                  String(p.id) === String(copy[index].marchandise_id) &&
                  String(p.site_id) === String(copy[index].fournisseur_id)
          );

          copy[index].prix_unitaire = Number(selectedMarchandise?.prixVente ?? 0);
      }

      setMarchandiseLines(copy);
  }

  function updateSiteLine(field, value) {
    const copy = [...productLines];
    const numValue = field !== "site_id" ? Number(value) : value;

    copy[field] = numValue;

    if(field === "site_id"){
      const selectedSite = sites.find((p) => String(p.id) === String(value));
    }

    setSite(copy);
  }

  function updateFournisseurLine(field, value) {
    const copy = [...marchandiseLines];
    const numValue = field !== "fournisseur_id" ? Number(value) : value;

    copy[field] = numValue;

    if(field === "fournisseur_id"){
      const selectedFour = fournisseurs.find((p) => String(p.id) === String(value));
    }

    setFournisseur(copy);
  }

  function removeProductLine(index) {
    setProductLines(productLines.filter((_, i) => i !== index));
  }

  function removeMarchandiseLine(index) {
    setMarchandiseLines(marchandiseLines.filter((_, i) => i !== index));
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
      date_vente: form.date_vente || new Date().toISOString().slice(0, 10),
      mode_paiement: form.mode_paiement,
      description: form.description,
      montant_total: totalAmount,
      user_create_id: user?.id,
    };

    const { data: insertedVente, error: insertError } = await supabase
      .from("ventes")
      .insert(ventePayload)
      .select()
      .single();

    if (insertError) {
      alert("Vente non enregistrée : " + insertError.message);
      return;
    }

    // Ajout produits ventes
    for (const line of productLines) {
      if (!line.produit_id || !line.quantite) continue;

      const linePayload = {
        vente_id: insertedVente.id,
        produit_id: line.produit_id,
        site_id: line.site_id,
        fournisseur_id: line.fournisseur_id,
        quantite: Number(line.quantite),
        prix_unitaire: Number(line.prix_unitaire),
        montant_ligne: Number(line.quantite) * Number(line.prix_unitaire),
      };

      const { error: lineError } = await supabase.from("venteproduits").insert(linePayload);

      if (lineError) {
        alert("Erreur lors de l'ajout du produit : " + lineError.message);
        return;
      }
    }

    // Ajout marchandise ventes 
    for (const line of marchandiseLines) {
      if (!line.marchandise_id || !line.quantite) continue;

      const linePayload = {
        vente_id: insertedVente.id,
        marchandise_id: line.marchandise_id,
        fournisseur_id: line.fournisseur_id,
        quantite: Number(line.quantite),
        prix_unitaire: Number(line.prix_unitaire),
        montant_ligne: Number(line.quantite) * Number(line.prix_unitaire),
      };

      const { error: lineError } = await supabase.from("ventemarchandises").insert(linePayload);

      if (lineError) {
        alert("Erreur lors de l'ajout des marchandises de la ventes : " + lineError.message);
        return;
      }
    }

    alert("Vente enregistrée");
    navigate("/ventes");
  }

  // Select filter and style 
  const productOptions = products.map((p) => ({
      value: p.id,
      label: `${p.nom} - ${p.categorie}`,
      product: p
  }));

  // Select filter and style 
  const marchandiseOptions = marchandises.map((p) => ({
      value: p.id,
      label: `${p.nom} - ${p.categorie} - ${p.description}`,
      product: p
  }));

  // Select filter and style 
  const clientsOptions = clients.map((c) => ({
      value: c.id,
      label: `${c.nom} - ${c.prenom}`,
      client: c
  }));

  

  return (
    <div className="product-page">
      <h1>Nouvelle vente</h1>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>Référence</label>
        <input name="reference" value={form.reference} onChange={handleFormChange} />

          {/*
          <div className="grid" style={{ marginBottom: "20px", gap: "10px" }}>
            <div>
              <label>Client</label>
              <Select className="list_select"
                    
                    options={clientsOptions}

                    placeholder="Choisir un client..."

                    isSearchable

                    name="client_id"

                    key={form.client_id}

                    styles={selectStyle}

                    value={
                        clientsOptions.find(
                            option => option.value === form.client_id
                        ) || null
                    }

                    onChange={handleClientChange}
                />
                </div>
            </div>
            */}

        <select name="client_id" value={form.client_id} onChange={handleFormChange} required isSearchable>
          <option value="">Choisir un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.nom} {client.prenom}</option>
          ))}
        </select>

        <label>Date vente</label>
        <input type="date" name="date_vente" value={form.date_vente} onChange={handleFormChange} />

        <label>Mode de paiement</label>
        <input name="mode_paiement" value={form.mode_paiement} onChange={handleFormChange} />

        <label>Description</label>
        <input name="description" value={form.description} onChange={handleFormChange} />
        

        <h3>Produits</h3>

        {productLines.map((line, index) => (
          <div className="grid" key={index} style={{ marginBottom: "20px", gap: "10px" }}>
            <div>
                <label>Produit</label>

                <Select className="list_select"
                    options={productOptions}

                    placeholder="Choisir un produit..."

                    isSearchable

                    styles={selectStyle}

                    value={
                        productOptions.find(
                            option => option.value === line.produit_id
                        ) || null
                    }

                    onChange={(selected) => {

                        updateProductLine(
                            index,
                            "produit_id",
                            selected.value
                        );

                    }}
                />
            </div>
            <div>
              <label>Site de production</label>
              <select name="site_id" value={form.site_id} 
                value={line.site_id || ""}
                onChange={(e) => updateProductLine(index, "site_id", e.target.value)}
                required>
                <option value="">Choisir le site de production</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>{site.nom}</option>
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
                {new Intl.NumberFormat("fr-FR").format(Number(line.quantite || 0) * Number(line.prix_unitaire || 0))} FG
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

        <div>
          <button className="profile" type="button" onClick={addProductLine}>
            + Ajouter produit
          </button>
        </div>

        <h3>Marchandises</h3>

        {marchandiseLines.map((line, index) => (
          <div className="grid" key={index} style={{ marginBottom: "20px", gap: "10px" }}>
            <div>
                <label>Marchandise</label>

                <Select className="list_select"
                    options={marchandiseOptions}

                    placeholder="Choisir une marchandise..."

                    isSearchable

                    styles={selectStyle}

                    value={
                        marchandiseOptions.find(
                            option => option.value === line.marchandise_id
                        ) || null
                    }

                    onChange={(selected) => {

                        updateMarchandiseLine(
                            index,
                            "marchandise_id",
                            selected.value
                        );

                    }}
                />
            </div> 
            
            
            <div>
              <label>Fournisseur</label>
              <select name="fournisseur_id" value={form.fournisseur_id} 
                value={line.fournisseur_id || ""}
                onChange={(e) => updateMarchandiseLine(index, "fournisseur_id", e.target.value)}
                required>
                <option value="">Choisir le fournisseur</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur.id} value={fournisseur.id}>{fournisseur.nom} {fournisseur.nom} - {fournisseur.societe}</option>
                ))}
              </select>
            </div>  
                     

            <div>
              <label>Quantité</label>
              <input
                type="number"
                value={line.quantite || ""}
                onChange={(e) => updateMarchandiseLine(index, "quantite", e.target.value)}
              />
            </div>

            <div>
              <label>Prix unitaire</label>
              <input
                type="number"
                onChange={(e) => updateMarchandiseLine(index, "prix_unitaire", e.target.value)}
              />
            </div>

            <div>
              <label>Total ligne</label>
              <output>
                {new Intl.NumberFormat("fr-FR").format(Number(line.quantite || 0) * Number(line.prix_unitaire || 0))} FG
              </output>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                className="profileSupp"
                type="button"
                onClick={() => removeMarchandiseLine(index)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        <div>
          <button className="profile" type="button" onClick={addMarchandiseLine}>
            + Ajouter marchandise
          </button>
        </div>

        <div className="profile" style={{ backgroundColor: "#a8415b"}}>
          <label><strong>Montant total :</strong></label>
          <output style={{ fontSize: "18px", fontWeight: "bold" }}>{new Intl.NumberFormat("fr-FR").format(totalAmount)} FG</output>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className="profile" type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

export default VenteCreate;

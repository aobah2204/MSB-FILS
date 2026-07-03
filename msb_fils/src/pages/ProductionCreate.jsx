import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

function ProductionCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [production, setProduction] = useState({
    site_id: "",
    produit_id: "",
    typeproduction: "Fabrication",
    description: "",
    quantite: "",
    cout_composants: 0,
    cout_production: 0,
    cout_stockage: 0,
    cout_total: 0,
    dateproduction: "",
    user_creation_id: "",
    user_modification_id: "",
  });

  const [produits, setProduits] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [sites, setSites] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isAddedMateriel, setIsAddedMateriel] = useState(false);
  const [coutTotalMateriels, setCoutTotalMateriels] = useState(0);
  const [coutTotalProduction, setCoutTotalProduction] = useState(0);

  async function getMateriels() {
    const { data } = await supabase.from("matierespremieres").select("*");

    if (!data) {
      alert("Aucun materiel");
      return;
    }

    setMatieres(data);
  }

  async function getProduits() {
    const { data } = await supabase.from("products").select("*");

    if (!data) {
      alert("Aucun produit");
      return;
    }

    setProduits(data);
  }

  async function getSites() {
    const { data } = await supabase.from("siteproduction").select("*");

    if (!data) {
      setSites([]);
      return;
    }

    setSites(data);
  }

  function handleProductionChange(e) {
    const { name, value } = e.target;
    setProduction((prev) => ({ ...prev, [name]: value }));
  }

  function addMaterial() {
    const nextMaterials = [
      ...materials,
      {
        matiere_id: "",
        quantite: "",
      },
    ];

    setMaterials(nextMaterials);
    setIsAddedMateriel(true);
    updateCosts(nextMaterials, production);
  }

  function updateMaterial(index, field, value) {
    const copy = [...materials];
    copy[index][field] = value;
    setMaterials(copy);
    updateCosts(copy, production);
  }

  function updateCosts(nextMaterials = materials, nextProduction = production) {
    const totalMaterialsCost = nextMaterials.reduce((sum, item) => {
      if (!item.matiere_id || !item.quantite) return sum;

      const selectedMaterial = matieres.find(
        (m) => String(m.id) === String(item.matiere_id)
      );
      const quantity = Number(item.quantite) || 0;
      const unitCost = Number(selectedMaterial?.prixAchat || 0);

      return sum + quantity * unitCost;
    }, 0);

    const stockageCost = Number(nextProduction.cout_stockage || 0);
    const productionCost = Number(nextProduction.cout_production || 0);
    const quantityProduced = Number(nextProduction.quantite || 0);
    //const unitCost = quantityProduced > 0 ? productionCost / quantityProduced : productionCost;
    const totalCost = productionCost + stockageCost + totalMaterialsCost;

    setProduction((prev) => ({
      ...prev,
      cout_composants: totalMaterialsCost,
      cout_production: productionCost,
      cout_total: totalCost,
    }));
    setCoutTotalMateriels(totalMaterialsCost);
    setCoutTotalProduction(totalCost);
  }

  async function addMaterielProduction(materielProduction) {
    const { error } = await supabase.from("materielproduction").insert(materielProduction);

    if (error) {
      alert(error.message);
      return false;
    }

    return true;
  }

  async function save(e) {
    e.preventDefault();

    const payload = {
      ...production,
      site_id: production.site_id || "",
      cout_composants: Number(production.cout_composants || 0),
      cout_production: Number(production.cout_production || 0),
      cout_stockage: Number(production.cout_stockage || 0),
      cout_total: Number(production.cout_total || 0),
      typeproduction: production.typeproduction || "Fabrication",
      quantite: Number(production.quantite || 0),
      dateproduction: production.dateproduction || new Date().toISOString(),
      user_creation_id: user?.id || 0,
      user_modification_id: user?.id || 0,
    };

    console.log("Payload:", payload);

    const { data: insertedProduction, error: insertError } = await supabase
      .from("productions")
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      alert("Production non enregistrée : " + insertError.message);
      return;
    }

    for (const item of materials) {
      if (!item.matiere_id || !item.quantite) continue;

      const selectedMaterial = matieres.find(
        (m) => String(m.id) === String(item.matiere_id)
      );
      const quantity = Number(item.quantite) || 0;
      const unitCost = Number(selectedMaterial?.prixAchat || 0);

      const materialPayload = {
        production_id: insertedProduction.id,
        matiere_id: item.matiere_id,
        quantite: quantity,
        //cout_unitaire: unitCost,
        //cout_total: quantity * unitCost,
      };

      const ok = await addMaterielProduction(materialPayload);
      if (!ok) return;
    }

    alert("Production enregistrée");
    navigate("/productions");
  }

  useEffect(() => {
    getMateriels();
    getProduits();
    getSites();
  }, []);

  useEffect(() => {
    updateCosts(materials, production);
  }, [materials, production.quantite, production.cout_stockage]);

  return (
    <div className="product-page">
      <h1>Nouvelle production</h1>

      <form className="product-form" onSubmit={save}>
        <label>Type production</label>

        <select
          name="typeproduction"
          value={production.typeproduction || "Fabrication"}
          onChange={handleProductionChange}
        >
          <option value="Fabrication">Fabrication</option>
          <option value="Transformation">Transformation</option>
          <option value="Assemblage">Assemblage</option>
        </select>

        <label>Site de production</label>

        <select
          name="site_id"
          value={production.site_id || ""}
          onChange={handleProductionChange}
        >
          <option value="">Choisir un site</option>

          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.nom}
            </option>
          ))}
        </select>

        <label>Produit réalisé</label>

        <select
          name="produit_id"
          value={production.produit_id || ""}
          onChange={handleProductionChange}
        >
          <option value="">Choisir</option>

          {produits.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>

        <label>Quantité produite</label>

        <input
          type="number"
          name="quantite"
          value={production.quantite || ""}
          onChange={handleProductionChange}
        />

        <label>Date de production</label>
        <input
          type="date"
          name="dateproduction"
          value={production.dateproduction || ""}
          onChange={handleProductionChange}
        />

        <label>Coût de stockage</label>
        <input
          type="float"
          name="cout_stockage"
          value={production.cout_stockage || ""}
          onChange={handleProductionChange}
        />

        <label>Coût de production (main d'œuvre)</label>
        <input
          type="float"
          name="cout_production"
          value={production.cout_production || ""}
          onChange={handleProductionChange}
        />
        

        <h3>Matériaux utilisés</h3>

        {materials.map((m, index) => (
          <div className="grid" key={index}>
            <select
              value={m.matiere_id || ""}
              onChange={(e) => updateMaterial(index, "matiere_id", e.target.value)}
            >
              <option value="">Choisir matière</option>
              {matieres.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.nom}
                </option>
              ))}
            </select>

            <input
              type="float"
              placeholder="Quantité"
              value={m.quantite || ""}
              onChange={(e) => updateMaterial(index, "quantite", e.target.value)}
            />
          </div>
        ))}

        <div>
          <button className="profile" type="button" onClick={addMaterial}>
            + Ajouter matière
          </button>
        </div>

        {isAddedMateriel && (
          <div className="grid">
            <label>Coût total matière</label>
            <output>{coutTotalMateriels}</output>

            <label>Coût production</label>
            <output>{coutTotalProduction}</output>
          </div>
        )}

        <br />

        <div>
          <button className="profile" type="submit">
            Enregistrer production
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductionCreate;

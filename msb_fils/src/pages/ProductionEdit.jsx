import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";

function ProductionEdit() {
  const { id } = useParams();
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
  });

  const [produits, setProduits] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [sites, setSites] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [coutTotalMateriels, setCoutTotalMateriels] = useState(0);
  const [coutTotalProduction, setCoutTotalProduction] = useState(0);

  async function getProduction() {
    const { data, error } = await supabase
      .from("productions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      alert("Erreur lors du chargement de la production : " + error.message);
      return;
    }

    if (!data) {
      alert("Aucune production trouvée");
      navigate("/productions");
      return;
    }

    setProduction({
      ...data,
      quantite: data.quantite ?? "",
      cout_stockage: data.cout_stockage ?? 0,
      cout_composants: data.cout_composants ?? 0,
      cout_production: data.cout_production ?? 0,
      cout_total: data.cout_total ?? 0,
    });
  }

  async function getExistingMaterials() {
    const { data, error } = await supabase
      .from("materielproduction")
      .select("*")
      .eq("production_id", id);

    if (error) {
      alert("Erreur lors du chargement des matériaux : " + error.message);
      return;
    }

    setMaterials(
      (data || []).map((item) => ({
        id: item.id,
        matiere_id: item.matiere_id,
        quantite: item.quantite,
      }))
    );
  }

  async function getProduits() {
    const { data } = await supabase.from("products").select("*");
    if (data) setProduits(data);
  }

  async function getMatieres() {
    const { data } = await supabase.from("matierespremieres").select("*");
    if (data) setMatieres(data);
  }

  async function getSites() {
    const { data } = await supabase.from("siteproduction").select("*");
    if (data) setSites(data);
  }

  function handleProductionChange(e) {
    const { name, value } = e.target;
    setProduction((prev) => ({ ...prev, [name]: value }));
  }

  function addMaterial() {
    setMaterials((prev) => [...prev, { id: null, matiere_id: "", quantite: "" }]);
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
    const productionCost = totalMaterialsCost + stockageCost;
    setProduction((prev) => ({
      ...prev,
      cout_composants: totalMaterialsCost,
      cout_production: productionCost,
      cout_total: productionCost,
    }));
    setCoutTotalMateriels(totalMaterialsCost);
    setCoutTotalProduction(productionCost);
  }

  async function deleteMaterialLines() {
    const { error } = await supabase
      .from("materielproduction")
      .delete()
      .eq("production_id", id);

    if (error) {
      alert("Erreur lors de la mise à jour des matériaux : " + error.message);
      return false;
    }

    return true;
  }

  async function save(e) {
    e.preventDefault();

    const payload = {
      ...production,
      site_id: production.site_id || null,
      produit_id: production.produit_id || null,
      quantite: Number(production.quantite || 0),
      cout_composants: Number(production.cout_composants || 0),
      cout_production: Number(production.cout_production || 0),
      cout_stockage: Number(production.cout_stockage || 0),
      cout_total: Number(production.cout_total || 0),
      dateproduction: production.dateproduction || new Date().toISOString(),
      user_modification_id: user?.id || 0,
    };

    const { error: updateError } = await supabase
      .from("productions")
      .update(payload)
      .eq("id", id);

    if (updateError) {
      alert("Production non modifiée : " + updateError.message);
      return;
    }

    const canDelete = await deleteMaterialLines();
    if (!canDelete) return;

    for (const item of materials) {
      if (!item.matiere_id || !item.quantite) continue;

      const { error: insertError } = await supabase.from("materielproduction").insert({
        production_id: id,
        matiere_id: item.matiere_id,
        quantite: item.quantite,
      });

      if (insertError) {
        alert("Erreur lors de la sauvegarde des matériaux : " + insertError.message);
        return;
      }
    }

    alert("Production modifiée");
    navigate("/productions");
  }

  useEffect(() => {
    getProduction();
    getExistingMaterials();
    getProduits();
    getMatieres();
    getSites();
  }, [id]);

  useEffect(() => {
    updateCosts(materials, production);
  }, [materials, production.quantite, production.cout_stockage, matieres]);

  return (
    <div className="product-page">
      <h1>Modifier la production</h1>

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
          type="number"
          name="cout_stockage"
          value={production.cout_stockage || 0}
          onChange={handleProductionChange}
        />


        {/*
        <label>Description</label>
        <textarea
          name="description"
          value={production.description || ""}
          onChange={handleProductionChange}
        />*/}

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
              type="number"
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

        <div className="grid">
          <label>Coût total matière</label>
          <output>{coutTotalMateriels}</output>

          <label>Coût production</label>
          <output>{coutTotalProduction}</output>
        </div>

        <br />

        <button className="profile" type="submit">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default ProductionEdit;

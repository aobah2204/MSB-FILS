import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function ProductionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [production, setProduction] = useState(null);
  const [site, setSite] = useState(null);
  const [product, setProduct] = useState(null);
  const [materials, setMaterials] = useState([]);

  async function getProductionDetails() {
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

    setProduction(data);

    if (data.site_id) {
      const { data: siteData } = await supabase
        .from("siteproduction")
        .select("nom")
        .eq("id", data.site_id)
        .maybeSingle();
      setSite(siteData);
    }

    if (data.produit_id) {
      const { data: productData } = await supabase
        .from("products")
        .select("nom")
        .eq("id", data.produit_id)
        .maybeSingle();
      setProduct(productData);
    }

    const { data: materialsData } = await supabase
      .from("materielproduction")
      .select("*, matierespremieres(nom)")
      .eq("production_id", data.id);

    setMaterials(materialsData || []);
  }

  useEffect(() => {
    getProductionDetails();
  }, [id]);

  if (!production) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Détails de la production</h1>

      <div className="card">
        <p><strong>Site :</strong> {site?.nom || "—"}</p>
        <p><strong>Produit :</strong> {product?.nom || "—"}</p>
        <p><strong>Type :</strong> {production.typeproduction || "—"}</p>
        <p><strong>Quantité :</strong> {production.quantite || 0}</p>
        <p><strong>Date :</strong> {production.dateproduction || "—"}</p>
        <p><strong>Coût total :</strong> {production.cout_total || 0}</p>
        <p><strong>Coût de stockage :</strong> {production.cout_stockage || 0}</p>
        <p><strong>Description :</strong> {production.description || "—"}</p>
      </div>

      <h3>Matériaux utilisés</h3>
      {materials.length === 0 ? (
        <p>Aucun matériau associé.</p>
      ) : (
        <ul>
          {materials.map((item) => (
            <li key={item.id}>
              {item.matierespremieres?.nom || "—"} — quantité : {item.quantite}
            </li>
          ))}
        </ul>
      )}

      <button className="profile" type="button" onClick={() => navigate("/productions")}>
        Retour à la liste
      </button>
    </div>
  );
}

export default ProductionDetails;

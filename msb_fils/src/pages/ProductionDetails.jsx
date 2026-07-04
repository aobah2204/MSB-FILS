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
        .select("*")
        .eq("id", data.produit_id)
        .maybeSingle();
      setProduct(productData);
    }

    const { data: materialsData } = await supabase
      .from("materielproduction")
      .select("*, matierespremieres(nom, unite, prixAchat)")
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

      <div className="card" style={{textAlign: "left"}}>
        <p><strong>Site :</strong> {site?.nom || "—"}</p>
        <p><strong>Produit :</strong> {product?.nom || "—"}</p>
        <p><strong>Type :</strong> {production.typeproduction || "—"}</p>
        <p><strong>Quantité :</strong> {new Intl.NumberFormat("fr-FR").format(production.quantite) || 0} {product?.unite}</p>
        <p><strong>Date :</strong> {production.dateproduction || "—"}</p>
        <p><strong>Description :</strong> {production.description || "—"}</p>
        
        
        <p><strong>Coût de stockage :</strong> {new Intl.NumberFormat("fr-FR").format(production.cout_stockage) || 0} FG</p>
        <p><strong>Coût de production (main d'œuvre) :</strong> {new Intl.NumberFormat("fr-FR").format(production.cout_production) || 0} FG</p>


        <p><strong>Coût total :</strong> {new Intl.NumberFormat("fr-FR").format(production.cout_total) || 0} FG</p>
        
      </div>

      <h3>Matériaux utilisés</h3>
      {materials.length === 0 ? (
        <p>Aucun matériau associé.</p>
      ) : (
        <ul style={{textAlign: "left"}}>
          {materials.map((item) => (
            <li key={item.id}>
              {item.matierespremieres?.nom || "—"} ———————————" 
              quantité : {item.quantite} {item.matierespremieres?.unite} - 
              prix unitaire : {new Intl.NumberFormat("fr-FR").format(item.matierespremieres?.prixAchat)} fg ————————————— 
              coût : { new Intl.NumberFormat("fr-FR").format(item.quantite * item.matierespremieres?.prixAchat) } fg "              
            </li>
            
          ))}
          
          <li>coût total matériaux : { new Intl.NumberFormat("fr-FR").format(materials.reduce((total, item) => {
                                      return total + (item.quantite * item.matierespremieres?.prixAchat);
                                      }, 0))} FG
          </li>
        </ul>
      )}

      <button className="profile" type="button" onClick={() => navigate("/productions")}>
        Retour à la liste
      </button>
    </div>
  );
}

export default ProductionDetails;

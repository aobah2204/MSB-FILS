import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function IssaAchatEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [marchandises, setMarchandises] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [marchandiseLines, setMarchandiseLines] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    reference: "",
    fournisseur_id: "",
    date_achat: "",
    statut: "En cours",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      // Fetch fournisseurs and matieres
      const { data: fournisseursData } = await supabase.from("fournisseurs").select("id, nom");
      const { data: produitsData } = await supabase.from("products").select("*");
      const { data: marchandisesData } = await supabase.from("marchandises").select("*");

      setFournisseurs(fournisseursData || []);
      setProduits(produitsData || []);
      setMarchandises(marchandisesData || []);

      // Fetch achat
      const { data: achatData, error: achatError } = await supabase
        .from("issaachats")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (achatError || !achatData) {
        alert("Achat introuvable");
        navigate("/issaachats");
        return;
      }

      setFormData(achatData);

      // Fetch product lines
      const { data: linesData } = await supabase
        .from("issaachatsproduits")
        .select("*")
        .eq("achat_id", id);

      setProductLines(linesData || []);

      // Fetch marchandise lines
      const { data: linesMData } = await supabase
        .from("issaachatsmarchandises")
        .select("*")
        .eq("achat_id", id);

      setMarchandiseLines(linesMData || []);

    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  }

  useEffect(() => {
    const total = productLines.reduce((sum, line) => sum + (line.montant_ligne || 0), 0);
    const totalM = marchandiseLines.reduce((sum, line) => sum + (line.montant_ligne || 0), 0);
    setTotalAmount(total+totalM);
  }, [productLines, marchandiseLines]);

  function addProductLine() {
    setProductLines([
      ...productLines,
      { produit_id: "", quantite: 0, prix_unitaire: 0, montant_ligne: 0 },
    ]);
  }

  function addMarchandiseLine() {
    setMarchandiseLines([
      ...marchandiseLines,
      { marchandise_id: "", quantite: 0, prix_unitaire: 0, montant_ligne: 0 },
    ]);
  }

  function removeProductLine(index) {
    setProductLines(productLines.filter((_, i) => i !== index));
  }

  function removeMarchandiseLine(index) {
    setMarchandiseLines(marchandiseLines.filter((_, i) => i !== index));
  }

  function updateProductLine(index, field, value) {
    const newLines = [...productLines];
    newLines[index][field] = value;

    // Auto-fill unit price when product is selected
    if (field === "produit_id") {
      const selected = produits.find((m) => m.id === value);
      if (selected) {
        newLines[index].prix_unitaire = selected.prixAchat || 0;
      }
    }

    // Calculate line amount
    const quantite = parseFloat(newLines[index].quantite) || 0;
    const prix = parseFloat(newLines[index].prix_unitaire) || 0;
    newLines[index].montant_ligne = quantite * prix;

    setProductLines(newLines);
  }

  function updateMarchandiseLine(index, field, value) {
    const newLines = [...marchandiseLines];
    newLines[index][field] = value;

    // Auto-fill unit price when marchandise is selected
    if (field === "marchandise_id") {
      const selected = marchandises.find((m) => m.id === value);
      if (selected) {
        newLines[index].prix_unitaire = selected.prixAchat || 0;
      }
    }

    // Calculate line amount
    const quantite = parseFloat(newLines[index].quantite) || 0;
    const prix = parseFloat(newLines[index].prix_unitaire) || 0;
    newLines[index].montant_ligne = quantite * prix;

    setMarchandiseLines(newLines);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.fournisseur_id || productLines.length === 0) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      // Update achat
      const { error: achatError } = await supabase
        .from("issaachats")
        .update({
          reference: formData.reference,
          fournisseur_id: formData.fournisseur_id,
          date_achat: formData.date_achat,
          statut: formData.statut,
          description: formData.description,
          montant_total: totalAmount,
        })
        .eq("id", id);

      if (achatError) {
        alert("Erreur lors de la mise à jour");
        return;
      }

      // Delete old lines and insert new ones
      await supabase.from("issaachatsproduits").delete().eq("achat_id", id);

      const lines = productLines.map((line) => ({
        achat_id: id,
        produit_id: line.produit_id,
        quantite: line.quantite,
        prix_unitaire: line.prix_unitaire,
        montant_ligne: line.montant_ligne,
      }));

      const { error: linesError } = await supabase.from("issaachatsproduits").insert(lines);

      if (linesError) {
        alert("Erreur lors de la mise à jour des produits");
        return;
      }

      // Delete old lines and insert new ones
      await supabase.from("issaachatsmarchandises").delete().eq("achat_id", id);

      const linesM = marchandiseLines.map((line) => ({
        achat_id: id,
        marchandise_id: line.marchandise_id,
        quantite: line.quantite,
        prix_unitaire: line.prix_unitaire,
        montant_ligne: line.montant_ligne,
      }));

      const { error: linesMError } = await supabase.from("issaachatsmarchandises").insert(linesM);

      if (linesMError) {
        alert("Erreur lors de la mise à jour des marchandises");
        return;
      }

      navigate("/achats");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la mise à jour");
    }
  }

  return (
    <div className="product-page">
      <h1>Modifier Achat #{id}</h1>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div>
            <label>Référence</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          <div>
            <label>Fournisseur *</label>
            <select
              value={formData.fournisseur_id}
              onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })}
              required
            >
              <option value="">Sélectionner un fournisseur</option>
              {fournisseurs.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              value={formData.date_achat.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date_achat: e.target.value })}
            />
          </div>

          <div>
            <label>Statut</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            >
              <option>En cours</option>
              <option>Reçu</option>
              <option>Facturé</option>
            </select>
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <h3>Produits</h3>
        {productLines.length === 0 ? (
          <p>Aucune matière. Cliquez sur "Ajouter matière".</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Quantité</th>
                  <th>unité</th>
                  <th>Prix unitaire</th>                  
                  <th>Total ligne</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productLines.map((line, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        value={line.produit_id}
                        onChange={(e) => updateProductLine(index, "produit_id", e.target.value)}
                        required
                      >
                        <option value="">Sélectionner</option>
                        {produits.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nom} {m.description}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={line.quantite}
                        onChange={(e) => updateProductLine(index, "quantite", parseFloat(e.target.value))}
                      />
                    </td>
                    <td>
                        <select
                            name="unite"
                            value={line.unite}
                            onChange={(e) => updateProductLine(index, "unite", e.target.value)}
                        >                   

                            <option>
                                Kg
                            </option>

                            <option>
                                Litre
                            </option>

                            <option>
                                Mètre
                            </option>

                            <option>
                                Mètre cube
                            </option>

                            <option>
                                Tonne
                            </option>

                            <option>
                                Pièce
                            </option>

                            <option>
                                Sac
                            </option>

                            <option>
                                Carton
                            </option>

                            <option>
                                Fût
                            </option>
                            
                            <option>
                                Conteneur
                            </option>

                        </select>

                    </td>
                    <td>
                      <input
                        type="number"
                        value={line.prix_unitaire}
                        onChange={(e) => updateProductLine(index, "prix_unitaire", parseFloat(e.target.value))}
                      />
                    </td>
                    <td>{line.montant_ligne.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeProductLine(index)}
                        className="profileSupp"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="button" className="profile" onClick={addProductLine}>
          + Ajouter produit
        </button>

        <h3>Marchandises</h3>
        {marchandiseLines.length === 0 ? (
          <p>Aucune Marchandise. Cliquez sur "Ajouter Marchandise".</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Marchandise</th>
                  <th>Quantité</th>
                  <th>unité</th>
                  <th>Prix unitaire</th>                  
                  <th>Total ligne</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {marchandiseLines.map((line, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        value={line.marchandise_id}
                        onChange={(e) => updateMarchandiseLine(index, "marchandise_id", e.target.value)}
                        required
                      >
                        <option value="">Sélectionner</option>
                        {marchandises.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nom} {m.description}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={line.quantite}
                        onChange={(e) => updateMarchandiseLine(index, "quantite", parseFloat(e.target.value))}
                      />
                    </td>
                    <td>
                        <select
                            name="unite"
                            value={line.unite}
                            onChange={(e) => updateMarchandiseLine(index, "unite", e.target.value)}
                        >                   

                            <option>
                                Kg
                            </option>

                            <option>
                                Litre
                            </option>

                            <option>
                                Mètre
                            </option>

                            <option>
                                Mètre cube
                            </option>

                            <option>
                                Tonne
                            </option>

                            <option>
                                Pièce
                            </option>

                            <option>
                                Sac
                            </option>

                            <option>
                                Carton
                            </option>

                            <option>
                                Fût
                            </option>
                            
                            <option>
                                Conteneur
                            </option>

                        </select>

                    </td>
                    <td>
                      <input
                        type="number"
                        value={line.prix_unitaire}
                        onChange={(e) => updateMarchandiseLine(index, "prix_unitaire", parseFloat(e.target.value))}
                      />
                    </td>
                    <td>{line.montant_ligne.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeMarchandiseLine(index)}
                        className="profileSupp"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button type="button" className="profile" onClick={addMarchandiseLine}>
          + Ajouter marchandise
        </button>

        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
          <p>
            <strong>Montant total :</strong> {totalAmount.toFixed(2)} DA
          </p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button type="submit" className="profile">
            Enregistrer
          </button>
          <button
            type="button"
            className="profile"
            onClick={() => navigate("/issaachats")}
            style={{ marginLeft: "10px" }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default IssaAchatEdit;

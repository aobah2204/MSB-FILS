import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AchatEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [productLines, setProductLines] = useState([]);
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
      const { data: matieresData } = await supabase.from("matierespremieres").select("id, nom, prixAchat");

      setFournisseurs(fournisseursData || []);
      setMatieres(matieresData || []);

      // Fetch achat
      const { data: achatData, error: achatError } = await supabase
        .from("achats")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (achatError || !achatData) {
        alert("Achat introuvable");
        navigate("/achats");
        return;
      }

      setFormData(achatData);

      // Fetch product lines
      const { data: linesData } = await supabase
        .from("achatmatierepremieres")
        .select("*")
        .eq("achat_id", id);

      setProductLines(linesData || []);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  }

  useEffect(() => {
    const total = productLines.reduce((sum, line) => sum + (line.montant_ligne || 0), 0);
    setTotalAmount(total);
  }, [productLines]);

  function addProductLine() {
    setProductLines([
      ...productLines,
      { matiere_id: "", quantite: 0, prix_unitaire: 0, montant_ligne: 0 },
    ]);
  }

  function removeProductLine(index) {
    setProductLines(productLines.filter((_, i) => i !== index));
  }

  function updateProductLine(index, field, value) {
    const newLines = [...productLines];
    newLines[index][field] = value;

    // Auto-fill unit price when product is selected
    if (field === "matiere_id") {
      const selected = matieres.find((m) => m.id === value);
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.fournisseur_id || productLines.length === 0) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      // Update achat
      const { error: achatError } = await supabase
        .from("achats")
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
      await supabase.from("achatmatierepremieres").delete().eq("achat_id", id);

      const lines = productLines.map((line) => ({
        achat_id: id,
        matiere_id: line.matiere_id,
        quantite: line.quantite,
        prix_unitaire: line.prix_unitaire,
        montant_ligne: line.montant_ligne,
      }));

      const { error: linesError } = await supabase.from("achatmatierepremieres").insert(lines);

      if (linesError) {
        alert("Erreur lors de la mise à jour des matières");
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
              value={formData.date_achat}
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

        <h3>Matières premières</h3>
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
                        value={line.matiere_id}
                        onChange={(e) => updateProductLine(index, "matiere_id", e.target.value)}
                        required
                      >
                        <option value="">Sélectionner</option>
                        {matieres.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nom}
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
          + Ajouter matière
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
            onClick={() => navigate("/achats")}
            style={{ marginLeft: "10px" }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default AchatEdit;

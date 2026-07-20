import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function IssaAchatCreate() {
  const navigate = useNavigate();
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
    date_achat: new Date().toISOString().split("T")[0],
    statut: "En cours",
    description: "",
    user_create_id: user?.id,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: fournisseursData } = await supabase.from("fournisseurs").select("*");
      const { data: produitsData } = await supabase.from("products").select("*");
      const { data: marchandisesData } = await supabase.from("marchandises").select("*");

      setFournisseurs(fournisseursData || []);
      setProduits(produitsData || []);
      setMarchandises(marchandisesData || []);

    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  }

  useEffect(() => {
    const totalP = productLines.reduce((sum, line) => sum + (line.montant_ligne || 0), 0);
    const totalM = marchandiseLines.reduce((sum, line) => sum + (line.montant_ligne || 0), 0);
    setTotalAmount(totalP + totalM);
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

    // Auto-fill unit price when product is selected
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
      const { data: achatData, error: achatError } = await supabase
        .from("issaachats")
        .insert([
          {
            reference: formData.reference,
            fournisseur_id: formData.fournisseur_id,
            date_achat: formData.date_achat,
            statut: formData.statut,
            description: formData.description,
            montant_total: totalAmount,
            user_create_id: user?.id,
          },
        ])
        .select();

      if (achatError || !achatData) {
        alert("Erreur lors de la création de l'achat "+ (achatError ? achatError.message : ""));
        return;
      }

      const achatId = achatData[0].id;

      // Insert product lines
      const linesP = productLines.map((line) => ({
        achat_id: achatId,
        produit_id: line.produit_id,
        description: line.description,
        quantite: line.quantite,
        unite: line.unite,
        prix_unitaire: line.prix_unitaire,
        montant_ligne: line.montant_ligne,
      }));

      const { error: linesErrorP } = await supabase.from("issaachatsproduits").insert(linesP);

      // Insert marchandise lines
      const linesM = marchandiseLines.map((line) => ({
        achat_id: achatId,
        marchandise_id: line.marchandise_id,
        description: line.description,
        quantite: line.quantite,
        unite: line.unite,
        prix_unitaire: line.prix_unitaire,
        montant_ligne: line.montant_ligne,
      }));

      const { error: linesErrorM } = await supabase.from("issaachatsmarchandises").insert(linesM);

      if (linesErrorP || linesErrorM) {
        alert("Erreur lors de l'ajout des produits/marchandises");
        return;
      }

      navigate("/issaachats");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création");
    }
  }

  return (
    <div className="product-page">
      <h1>Nouvel Achat</h1>

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
                  {f.nom} {f.prenom}
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

        <h3>Produits</h3>
        {productLines.length === 0 ? (
          <p>Aucun produit. Cliquez sur "Ajouter produit".</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Description</th>
                  <th>Unité</th>
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
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateProductLine(index, "description", e.target.value)}
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
          <p>Aucune marchandise. Cliquez sur "Ajouter marchandise".</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Marchandise</th>
                  <th>Quantité</th>
                  <th>Description</th>
                  <th>Unité</th>
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
                            {m.nom}
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
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateMarchandiseLine(index, "description", e.target.value)}
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
          + Ajouter Marchandise
        </button>

        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#a8415b", borderRadius: "5px" }}>
          <p>
            <strong>Montant total :</strong> {new Intl.NumberFormat("fr-FR").format(totalAmount.toFixed(2))} FG
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

export default IssaAchatCreate;

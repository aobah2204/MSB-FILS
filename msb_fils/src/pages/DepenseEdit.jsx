import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/notifications";

function dataUrlToFile(dataUrl, fileName) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}

function sanitizeFileName(fileName) {
  const lastDot = fileName.lastIndexOf(".");
  const extension = lastDot > -1 ? fileName.slice(lastDot) : "";
  const baseName = lastDot > -1 ? fileName.slice(0, lastDot) : fileName;

  const normalizedBase = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${normalizedBase || "file"}${extension}`;
}

async function compressAndPrepareFile(file) {
  if (!file) return null;

  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxWidth = 1200;
  const maxHeight = 1200;
  let { width, height } = imageBitmap;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const quality = file.type.includes("image/png") ? 0.85 : 0.75;
  const dataUrl = canvas.toDataURL(file.type, quality);
  return dataUrlToFile(dataUrl, file.name);
}

function DepenseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fournisseurs, setFournisseurs] = useState([]);
  const [sites, setSites] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    reference: "",
    libelle: "",
    categorie: "",
    fournisseur_id: "",
    site_id: "",
    vehicule_id: "",
    utilisateur_id: "",
    date_depense: "",
    statut: "Payé",
    mode_paiement: "",
    montant: "",
    montant_paye: "",
    justificatif: "",
    type_liaison: "GENERAL",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [{ data: fournisseursData }, { data: sitesData }, { data: vehiculesData }, { data: salariesData }, { data: depenseData, error }] = await Promise.all([
        supabase.from("fournisseurs").select("id, nom, prenom"),
        supabase.from("siteproduction").select("id, nom"),
        supabase.from("vehicules").select("id, immatriculation, marque"),
        supabase.from("utilisateurs").select("id, fullname"),
        supabase.from("depenses").select("*").eq("id", id).maybeSingle(),
      ]);

      if (error || !depenseData) {
        alert("Dépense introuvable");
        navigate("/depenses");
        return;
      }

      setFournisseurs(fournisseursData || []);
      setSites(sitesData || []);
      setVehicules(vehiculesData || []);
      setSalaries(salariesData || []);

      setFormData({
        reference: depenseData.reference || "",
        libelle: depenseData.libelle || "",
        categorie: depenseData.categorie || "",
        fournisseur_id: depenseData.fournisseur_id ?? "",
        site_id: depenseData.site_id ?? "",
        vehicule_id: depenseData.vehicule_id ?? "",
        utilisateur_id: depenseData.utilisateur_id ?? "",
        date_depense: depenseData.date_depense ? depenseData.date_depense.split("T")[0] : "",
        statut: depenseData.statut || "Payé",
        mode_paiement: depenseData.mode_paiement || "",
        montant: depenseData.montant ?? "",
        montant_paye: depenseData.montant_paye ?? "",
        justificatif: depenseData.justificatif || "",
        type_liaison: depenseData.type_liaison || "GENERAL",
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la dépense :", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.categorie || !formData.libelle) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      setUploading(true);
      let justificatifValue = formData.justificatif;

      if (formData.justificatifFile) {
        try {
          const fileToUpload = (await compressAndPrepareFile(formData.justificatifFile)) || formData.justificatifFile;
          const safeFileName = sanitizeFileName(fileToUpload.name);
          const fileName = `public/depenses/${formData.reference}/${Date.now()}_${safeFileName}`;
          const { error: uploadError } = await supabase.storage
            .from("justificatifsdocuments")
            .upload(fileName, fileToUpload);

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from("justificatifsdocuments").getPublicUrl(fileName);
            justificatifValue = publicUrlData.publicUrl;
          } else {
            console.error("Impossible d'envoyer le justificatif vers le stockage :", uploadError.message || uploadError);
            notify.error("Le justificatif n'a pas pu être envoyé, mais la modification a été enregistrée sans pièce jointe.");
          }
        } catch (storageError) {
          console.error("Erreur lors de l'upload du justificatif :", storageError.message || storageError);
          notify.error("Le justificatif n'a pas pu être envoyé, mais la modification a été enregistrée sans pièce jointe.");
        }
      }

      const { error } = await supabase
        .from("depenses")
        .update({
          reference: formData.reference,
          libelle: formData.libelle,
          categorie: formData.categorie,
          fournisseur_id: formData.fournisseur_id || 0,
          site_id: formData.site_id || 0,
          vehicule_id: formData.vehicule_id || 0,
          utilisateur_id: formData.utilisateur_id || 0,
          date_depense: formData.date_depense,
          statut: formData.statut,
          mode_paiement: formData.mode_paiement,
          montant: formData.montant,
          montant_paye: formData.montant_paye,
          justificatif: justificatifValue,
          //type_liaison: formData.type_liaison,
          updated_user_id: user?.id,
        })
        .eq("id", id);

      if (error) {
        alert("Erreur lors de la modification : " + error.message);
        return;
      }

      notify.success("Dépense modifiée avec succès");
      navigate("/depenses");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la modification : " + error.message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="product-page">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <h1>Modifier une dépense</h1>

      <form onSubmit={handleSubmit} className="card">
        <div>
          <label>Référence</label>
          <input type="text" name="reference" value={formData.reference} onChange={handleChange} />
        </div>

        <div>
          <label>Libellé</label>
          <input type="text" name="libelle" value={formData.libelle} onChange={handleChange} required />
        </div>

        <div>
          <label>Catégorie</label>
          <select name="categorie" value={formData.categorie} onChange={handleChange} required>
            <option value="">---Choisir---</option>
            <option value="Carburant">Carburant</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Réparation">Réparation</option>
            <option value="Pièce">Pièce</option>
            <option value="Salaire">Salaire</option>
            <option value="Electricité">Electricité</option>
            <option value="Eau">Eau</option>
            <option value="Loyer">Loyer</option>
            <option value="Transport">Transport</option>
            <option value="Matières premières">Matières premières</option>
            <option value="Consommables">Consommables</option>
            <option value="Impôts">Impôts</option>
            <option value="Assurance">Assurance</option>
            <option value="Fournisseur">Fournisseur</option>
            <option value="Prime de voyage">Prime de voyage</option>
            <option value="Frais de route">Frais de route</option>
            <option value="Manutention">Manutention</option>
            <option value="Divers">Divers</option>
          </select>
        </div>

        <div>
          <label>Fournisseur</label>
          <select name="fournisseur_id" value={formData.fournisseur_id} onChange={handleChange}>
            <option value="">Aucun</option>
            {fournisseurs.map((f) => (
              <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Site</label>
          <select name="site_id" value={formData.site_id} onChange={handleChange}>
            <option value="">Aucun</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.nom}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Véhicule</label>
          <select name="vehicule_id" value={formData.vehicule_id} onChange={handleChange}>
            <option value="">Aucun</option>
            {vehicules.map((vehicule) => (
              <option key={vehicule.id} value={vehicule.id}>{vehicule.immatriculation} - {vehicule.marque}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Salarié</label>
          <select name="utilisateur_id" value={formData.utilisateur_id} onChange={handleChange}>
            <option value="">Aucun</option>
            {salaries.map((salarie) => (
              <option key={salarie.id} value={salarie.id}>{salarie.fullname}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Date de la dépense</label>
          <input type="date" name="date_depense" value={formData.date_depense} onChange={handleChange} required />
        </div>

        <div>
          <label>Statut</label>
          <select name="statut" value={formData.statut} onChange={handleChange}>
            <option value="Payé">Payé</option>
            <option value="Non payé">Non payé</option>
          </select>
        </div>

        <div>
          <label>Mode de paiement</label>
          <select name="mode_paiement" value={formData.mode_paiement} onChange={handleChange}>
            <option value="">Choisir</option>
            <option value="Cash">Cash</option>
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
            <option value="Orange Money">Orange Money</option>
            <option value="Carte bancaire">Carte bancaire</option>
          </select>
        </div>

        <div>
          <label>Montant total</label>
          <input type="number" name="montant" value={formData.montant} onChange={handleChange} required />
        </div>

        <div>
          <label>Montant payé</label>
          <input type="number" name="montant_paye" value={formData.montant_paye} onChange={handleChange} />
        </div>

        <div>
          <label>Justificatif (photo ou fichier)</label>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={(e) => setFormData((prev) => ({ ...prev, justificatifFile: e.target.files?.[0] || null }))}
          />
          {uploading && <p>Compression et envoi en cours...</p>}
        </div>

        <div>
          <button className="profile" type="submit" disabled={uploading}>
            {uploading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button className="profile" type="button" onClick={() => navigate("/depenses")}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default DepenseEdit;

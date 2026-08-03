const WA_API_URL = import.meta.env.VITE_WHATSAPP_API_URL || "https://graph.facebook.com/v17.0";
const WA_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const WA_ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

const buildWhatsAppText = ({ title, message, link }) => {
  const lines = [];
  if (title) lines.push(`*${title}*`);
  if (message) lines.push(message);
  if (link) lines.push(link);
  return lines.join("\n\n");
};

const sendWhatsAppMessage = async (phone, text) => {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    throw new Error("WhatsApp Business API config is manquante. Vérifie VITE_WHATSAPP_PHONE_NUMBER_ID et VITE_WHATSAPP_ACCESS_TOKEN.");
  }

  const response = await fetch(`${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "text",
      text: {
        body: text,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.error?.message || "Erreur inconnue WhatsApp";
    throw new Error(errorMessage);
  }

  return data;
};

export const sendWhatsAppGroupMessage = async ({ members = [], title, message, link }) => {
  if (!Array.isArray(members) || members.length === 0) {
    throw new Error("Aucun membre WhatsApp fourni pour l'envoi.");
  }

  const text = buildWhatsAppText({ title, message, link });
  const results = [];

  for (const member of members) {
    const phone = typeof member === "string" ? member : member?.phone || member?.telephone || member?.numero;
    if (!phone) {
      results.push({ member, success: false, error: "Aucun numéro de téléphone valide" });
      continue;
    }

    try {
      const result = await sendWhatsAppMessage(phone.replace(/[^0-9]/g, ""), text);
      results.push({ member, success: true, result });
    } catch (error) {
      results.push({ member, success: false, error: error.message });
    }
  }

  return results;
};

export const openWhatsAppChat = ({ phone, text }) => {
  const encoded = encodeURIComponent(text || "");
  const normalized = String(phone).replace(/[^0-9]/g, "");
  const url = `https://api.whatsapp.com/send?phone=${normalized}&text=${encoded}`;
  window.open(url, "_blank");
};

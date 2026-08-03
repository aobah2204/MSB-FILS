import { useState } from "react";
import { notify } from "../utils/notifications";

const members = [
  { name: "Koto Mounir", telephone: "+224 622 21 88 97" },
  { name: "Alhassane", telephone: "+224 620 60 23 24" },
  { name: "Mamadou Dardaye", telephone: "224 621 13 42 80" },
  { name: "Amadou Oury", telephone: "+33 6 12 18 22 45" },
];

function WhatsappGroupExample() {
  const [status, setStatus] = useState(null);

  const handleSend = async () => {
    try {
      setStatus("Envoi en cours...");
      const results = await notify.whatsappGroup({
        members,
        title: "Notification de groupe",
        message: "Une nouvelle alerte est disponible.",
        link: "https://ton-site.com/notifications"
      });
      setStatus(JSON.stringify(results, null, 2));
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div>
      <h1>WhatsApp groupe</h1>
      <button onClick={handleSend}>Envoyer au groupe</button>
      {status && <pre>{status}</pre>}
    </div>
  );
}

export default WhatsappGroupExample;

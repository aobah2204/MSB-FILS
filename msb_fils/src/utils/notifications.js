import toast from "react-hot-toast";
import { sendWhatsAppGroupMessage } from "./whatsapp";

export const notify = {

    success: (message) => toast.success(message),

    error: (message) => toast.error(message),

    loading: (message) => toast.loading(message),

    dismiss: (id) => toast.dismiss(id),

    async whatsappGroup({ members = [], title, message, link }) {
        try {
            const results = await sendWhatsAppGroupMessage({ members, title, message, link });
            toast.success("Messages WhatsApp envoyés");
            return results;
        } catch (err) {
            toast.error("Échec de l'envoi WhatsApp");
            throw err;
        }
    }

};


import type { TranslateResponse } from "../../interfaces";

export const translateUseCase = async (prompt: string, lang: string) => {
  try {
    const apiKey = localStorage.getItem("token") || "";
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) throw new Error("Error en la petición");

    const data = (await resp.json()) as TranslateResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "No se pudo procesar la solicitud. Inténtelo de nuevo más tarde.",
    };
  }
};

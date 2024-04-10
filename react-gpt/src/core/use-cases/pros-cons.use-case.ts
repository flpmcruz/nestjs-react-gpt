import type { ProsConsResponse } from "../../interfaces";

export const ProsConsUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) throw new Error("Error en la petición");

    const data = (await resp.json()) as ProsConsResponse;

    return {
      ok: true,
      content: data.content,
    };
  } catch (error) {
    return {
      ok: false,
      content:
        "No se pudo procesar la solicitud. Inténtelo de nuevo más tarde.",
    };
  }
};

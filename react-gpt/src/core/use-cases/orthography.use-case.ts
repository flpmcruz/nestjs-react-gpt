import type { OrthographyResponse } from "../../interfaces";

export const orthographyUseCase = async (prompt: string) => {
  try {
    const apiKey = localStorage.getItem("token") || "";
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/orthography-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!resp.ok) throw new Error("Error en la petición");

    const data = (await resp.json()) as OrthographyResponse;

    return {
      ok: true,
      ...data,
    };

  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message:
        "No se pudo procesar la solicitud. Inténtelo de nuevo más tarde.",
    };
  }
};

export const ProsConsStreamUseCase = async (prompt: string) => {
  try {
    const apiKey = localStorage.getItem("token") || "";
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
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

    const reader = resp.body?.getReader();
    if (!reader) return null;
    return reader;

  } catch (error) {
    return null;
  }
};

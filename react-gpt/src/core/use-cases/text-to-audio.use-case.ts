
export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const apiKey = localStorage.getItem("token") || "";
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) throw new Error("Error en la petición");

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "No se pudo procesar la solicitud. Inténtelo de nuevo más tarde.",
    };
  }
};

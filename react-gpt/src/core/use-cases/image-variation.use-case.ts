type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageVariationUseCase = async (
  originalImage: string,
): Promise<GeneratedImage> => {
  try {
    const apiKey = localStorage.getItem("token") || "";
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-variation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          baseImage: originalImage,
        }),
      }
    );

    const { url, revised_prompt: alt } = await resp.json();

    return { url, alt };
  } catch (error) {
    console.log(error);
    return null;
  }
};

import "dotenv/config";
import express, { Request, Response } from "express";
import { Mistral } from "@mistralai/mistralai";

const app = express();
app.use(express.json({ limit: "50mb" }));

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const OCR_MODEL = "mistral-ocr-latest";

app.post("/ocr/document", async (req: Request, res: Response) => {
  const { document_url } = req.body;

  if (!document_url || typeof document_url !== "string") {
    res.status(400).json({ error: "Se requiere el campo 'document_url' (string)" });
    return;
  }

  try {
    const result = await mistral.ocr.process({
      model: OCR_MODEL,
      document: {
        type: "document_url",
        documentUrl: document_url,
      },
    });

    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(500).json({ error: "Error al procesar el documento", detail: message });
  }
});

app.post("/ocr/image", async (req: Request, res: Response) => {
  const { image_base64 } = req.body;

  if (!image_base64 || typeof image_base64 !== "string") {
    res.status(400).json({ error: "Se requiere el campo 'image_base64' (string en base64)" });
    return;
  }

  const dataUri = image_base64.startsWith("data:")
    ? image_base64
    : `data:image/png;base64,${image_base64}`;

  try {
    const result = await mistral.ocr.process({
      model: OCR_MODEL,
      document: {
        type: "image_url",
        imageUrl: dataUri,
      },
    });

    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(500).json({ error: "Error al procesar la imagen", detail: message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor OCR corriendo en http://localhost:${PORT}`);
});

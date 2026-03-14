import "dotenv/config";
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

async function run() {
  const result = await mistral.ocr.process({
    model: "mistral-ocr-latest",
    document: {
      documentUrl: "https://constanciadesituacionfiscal.mx/wp-content/uploads/2025/11/8.-ConstanciaDeSituacionFiscal.pdf",
      type: "document_url",
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

run();

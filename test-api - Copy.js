const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

async function test() {
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // List models
        console.log("Listing models...");
        // Note: listModels is not on genAI directly in some versions, but let's check.
        // If not, we might need to use a different way.
        // In @google/generative-ai, there's no listModels on the class.
        // But we can try common names.
        const models = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro"];
        for (const m of models) {
            try {
                console.log(`Trying ${m}...`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("hi");
                console.log(`Model ${m} WORKS:`, await result.response.text());
                break;
            } catch (e) {
                console.log(`Model ${m} FAILED:`, e.message);
            }
        }

    } catch (e) {
        console.log("Overall error:", e);
    }
}

test();


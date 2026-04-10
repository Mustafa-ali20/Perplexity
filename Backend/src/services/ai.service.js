import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(message) {
  const resposne = await geminiModel.invoke(
    message.map((msg) => {
      if (msg.role == "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role == "ai") {
        return new AIMessage(msg.content);
      }
    }),
  );
  return resposne.text;
}

export async function generateChatTitle(message) {
  const title = await mistralModel.invoke([
    new SystemMessage(
      ` User will provide you with the first message of the chat, and you will generate a short title for the chat that summarizes the topic of the chat in a few 2-4 words. The title should be concise and should not exceed 4 words.`,
    ),
    new HumanMessage(
      `Generate a short title for the following message: "${message}".`,
    ),
  ]);
  return title.text;
}

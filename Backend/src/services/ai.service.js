import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  AIMessage,
  createAgent,
  HumanMessage,
  SystemMessage,
  tool,
} from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "search_internet",
  description:
    "A tool to search the internet for information. It takes a query as input and returns the search results.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

export async function generateResponse(message) {
  const stream = await agent.stream(
    {
      messages: [
        new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
        ...message.map((msg) => {
          if (msg.role == "user") {
            return new HumanMessage(msg.content);
          } else if (msg.role == "ai") {
            return new AIMessage(msg.content);
          }
        }),
      ],
    },
    { streamMode: "values" },
  );

  let finalContent = "";

  for await (const chunk of stream) {
    const latestMessage = chunk.messages.at(-1);

    if (latestMessage?.tool_calls?.length) {
      const toolNames = latestMessage.tool_calls.map((tc) => tc.name);
      console.log(`Calling tools: ${toolNames.join(", ")}`);
    } else if (latestMessage?.content) {
      finalContent = latestMessage.content; // ✅ keep updating until stream ends
    }
  }

  return finalContent; 
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

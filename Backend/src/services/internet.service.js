import { tavily as Tavily } from "@tavily/core";
import { query } from "express-validator";

const tavily = Tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchInternet = async ({ query }) => {
  return await tavily.search(query, {
    maxResults: 5,
    searchDepth: "advanced",
  });
};

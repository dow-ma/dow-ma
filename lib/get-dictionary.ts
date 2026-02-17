import "server-only";
import { Dictionary } from "./types";

const dictionaries = {
    en: () => import("../dictionaries/en.json").then((module) => module.default as Dictionary),
    zh: () => import("../dictionaries/zh.json").then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: "en" | "zh"): Promise<Dictionary> =>
    dictionaries[locale]?.() ?? dictionaries.en();

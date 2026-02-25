import { clarity } from "react-microsoft-clarity";

export const initClarity = () => {
  if (typeof window !== "undefined") {
    clarity.init("vmup45mael");
  }
};
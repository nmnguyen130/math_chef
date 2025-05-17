import { useState } from "react";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_MODEL_API || "";
const SOLVE_URL = `${API_URL}/solve`;

export const useEquationSolver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const cleanText = (text: string) => {
    return text.replace(/<\/?NUM>/g, "").trim();
  };

  const parseResultText = (raw: string) => {
    const stepRegex = /<STEP>(.*?)<\/STEP>/gs;
    const answerRegex = /<ANSWER>(.*?)<\/ANSWER>/s;

    const steps: string[] = [];
    let match;

    while ((match = stepRegex.exec(raw)) !== null) {
      steps.push(cleanText(match[1]));
    }

    const answerMatch = raw.match(answerRegex);
    const answer = answerMatch ? cleanText(answerMatch[1]) : "";

    return { steps, answer };
  };

  /**
   * @param equation Chuỗi biểu thức toán học (vd: "x^2 + 2x + 1")
   * @param query Chuỗi truy vấn yêu cầu (vd: "solve for x")
   */
  const solveEquation = async (equation: string, query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams();
      params.append("equation", equation);
      params.append("query", query);

      const response = await axios.post(SOLVE_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const rawResult = response.data.result || "";
      const { steps, answer } = parseResultText(rawResult);
      setResult({ steps, answer });
    } catch (err: any) {
      console.error("Error solving equation:", err);
      setError(err.message || "Failed to solve equation.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    solveEquation,
  };
};

import { useState } from "react";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_MODEL_API || "";
const PREDICT_URL = `${API_URL}/predict`;

export const useMathCapture = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const fetchLatexFromImage = async (imageUri: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const response = await axios.post(PREDICT_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error("Error solving image:", err);
      setError(err.message || "Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    fetchLatexFromImage,
  };
};

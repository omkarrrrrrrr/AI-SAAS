"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(undefined); // undefined = loading
  const [product, setProduct] = useState("");
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user]);

  const generate = async () => {
    if (!product || !features) {
      setResult("⚠️ Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, features }),
      });

      const data = await res.json();
      setResult(data.text || "No result");
    } catch {
      setResult("Server error");
    }

    setLoading(false);
  };

  // ✅ SHOW LOADING (NO BLANK SCREEN)
  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // still redirecting
  if (user === null) return null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-900 p-6 rounded-xl">

        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 ConvertAI
        </h1>

        <p className="text-green-400 text-sm mb-4 text-center">
          {user.email}
        </p>

        <input
          placeholder="Product name"
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <textarea
          placeholder="Features"
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />

        <button
          onClick={generate}
          className="w-full bg-green-600 p-3 rounded"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {result && (
          <div className="mt-4 bg-black p-3 rounded border border-gray-700">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}

      </div>
    </div>
  );
}
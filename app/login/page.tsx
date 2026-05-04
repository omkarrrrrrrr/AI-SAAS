"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState("");
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 🔥 SESSION FIX
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user]);

  const generate = async () => {
    if (!user) return;

    if (count >= 3) {
      setResult("⚠️ Free limit reached. Upgrade to Pro.");
      return;
    }

    setLoading(true);
    setCount(count + 1);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product, features }),
    });

    const data = await res.json();
    setResult(data.text);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-zinc-900 p-6 rounded-xl">

        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 ConvertAI – Shopify Description Generator
        </h1>

        <p className="text-green-400 text-sm mb-4 text-center">
          Logged in as {user.email}
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
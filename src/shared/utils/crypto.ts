export function generateCodeVerifier(length = 128): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  if (!window.crypto?.getRandomValues) {
    return Array.from(
      { length },
      () => possible[Math.floor(Math.random() * possible.length)],
    ).join("");
  }

  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(randomValues)
    .map((x) => possible[x % possible.length])
    .join("");
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  try {
    if (!window.crypto?.subtle) {
      return generateFallbackCodeChallenge(verifier);
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return generateFallbackCodeChallenge(verifier);
  }
}

function generateFallbackCodeChallenge(verifier: string): string {
  const encoded = btoa(verifier);
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

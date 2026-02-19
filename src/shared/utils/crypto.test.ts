import { it, expect, describe, vi, beforeEach } from "vitest";

import { generateCodeVerifier, generateCodeChallenge } from "./crypto";

describe("generateCodeVerifier", () => {
  it("should generate string with default length of 128", () => {
    const verifier = generateCodeVerifier();
    expect(verifier).toHaveLength(128);
  });

  it("should generate string with custom length", () => {
    const verifier = generateCodeVerifier(64);
    expect(verifier).toHaveLength(64);
  });

  it("should use only allowed characters", () => {
    const allowed =
      /^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\-._~]+$/;
    const verifier = generateCodeVerifier();
    expect(verifier).toMatch(allowed);
  });

  it("should generate different values on each call", () => {
    const v1 = generateCodeVerifier();
    const v2 = generateCodeVerifier();
    expect(v1).not.toBe(v2);
  });

  it("should use fallback when crypto.getRandomValues is not available", () => {
    const original = window.crypto.getRandomValues;
    Object.defineProperty(window.crypto, "getRandomValues", {
      value: undefined,
      configurable: true,
    });

    const verifier = generateCodeVerifier(32);
    expect(verifier).toHaveLength(32);

    Object.defineProperty(window.crypto, "getRandomValues", {
      value: original,
      configurable: true,
    });
  });
});

describe("generateCodeChallenge", () => {
  it("should return valid base64url string", async () => {
    const challenge = await generateCodeChallenge("test-verifier");
    expect(challenge).not.toContain("+");
    expect(challenge).not.toContain("/");
    expect(challenge).not.toContain("=");
    expect(challenge.length).toBeGreaterThan(0);
  });

  it("should generate different challenge for different verifiers", async () => {
    const c1 = await generateCodeChallenge("verifier-1");
    const c2 = await generateCodeChallenge("verifier-2");
    expect(c1).not.toBe(c2);
  });

  it("should generate identical challenge for same verifier", async () => {
    const c1 = await generateCodeChallenge("same-verifier");
    const c2 = await generateCodeChallenge("same-verifier");
    expect(c1).toBe(c2);
  });

  it("should use fallback when crypto.subtle is not available", async () => {
    const original = window.crypto.subtle;
    Object.defineProperty(window.crypto, "subtle", {
      value: undefined,
      configurable: true,
    });

    const challenge = await generateCodeChallenge("test-verifier");
    expect(challenge).not.toContain("+");
    expect(challenge).not.toContain("/");
    expect(challenge).not.toContain("=");
    expect(challenge.length).toBeGreaterThan(0);

    Object.defineProperty(window.crypto, "subtle", {
      value: original,
      configurable: true,
    });
  });

  it("should use fallback when digest throws error", async () => {
    const original = window.crypto.subtle.digest;
    vi.spyOn(window.crypto.subtle, "digest").mockRejectedValueOnce(
      new Error("digest error"),
    );

    const challenge = await generateCodeChallenge("test-verifier");
    expect(challenge.length).toBeGreaterThan(0);

    window.crypto.subtle.digest = original;
  });
});

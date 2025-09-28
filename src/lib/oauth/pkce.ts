import crypto from "crypto";

export function base64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function generateCodeVerifier() {
  return base64url(crypto.randomBytes(32));
}

export function generateCodeChallenge(verifier: string) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64url(hash);
}

export function randomState() {
  return crypto.randomUUID();
}

export function randomNonce() {
  return crypto.randomUUID();
}

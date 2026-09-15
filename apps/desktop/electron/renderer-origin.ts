const PACKAGED_RENDERER_URL = "veyra://app/index.html";
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "[::1]", "localhost"]);

export function selectRendererUrl(developmentUrl: string | undefined): string {
  if (!developmentUrl) return PACKAGED_RENDERER_URL;

  const url = new URL(developmentUrl);
  if (url.protocol !== "http:" || !LOOPBACK_HOSTS.has(url.hostname)) {
    throw new Error("Renderer development URL must use loopback HTTP");
  }
  return url.toString();
}

export function isTrustedRendererSender(
  rendererUrl: string,
  candidateUrl: string,
): boolean {
  try {
    const trusted = new URL(rendererUrl);
    const candidate = new URL(candidateUrl);
    return (
      candidate.protocol === trusted.protocol &&
      candidate.hostname === trusted.hostname &&
      candidate.port === trusted.port
    );
  } catch {
    return false;
  }
}

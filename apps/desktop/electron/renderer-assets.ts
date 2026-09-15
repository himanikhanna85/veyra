import { isAbsolute, relative, resolve } from "node:path";

export function resolveRendererAsset(assetRoot: string, requestUrl: string): string {
  const url = new URL(requestUrl);
  if (url.protocol !== "veyra:" || url.host !== "app") {
    throw new Error("Untrusted renderer origin");
  }

  const decodedPath = decodeURIComponent(url.pathname);
  if (decodedPath.includes("\0")) {
    throw new Error("Renderer path escapes asset root");
  }
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const normalizedRoot = resolve(assetRoot);
  const resolvedPath = resolve(normalizedRoot, `.${requestedPath}`);
  const relativePath = relative(normalizedRoot, resolvedPath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error("Renderer path escapes asset root");
  }
  return resolvedPath;
}

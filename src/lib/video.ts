/**
 * Plays a muted clip inline, the way iOS Safari / in-app browsers require:
 * React sets `muted` only as a property, but iOS checks the attribute before
 * it allows playback without a tap. Resolves false when playback is blocked
 * (e.g. iPhone Low Power Mode) – callers then simply keep the photo.
 */
export async function playInline(v: HTMLVideoElement | null | undefined): Promise<boolean> {
  if (!v) return false;
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  try {
    await v.play();
    return true;
  } catch {
    return false;
  }
}

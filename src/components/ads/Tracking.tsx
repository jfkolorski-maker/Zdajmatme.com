"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/ads/attribution";

/** Stores gclid / fbclid / UTM tags from the landing URL so they travel with the lead. */
export function Tracking() {
  useEffect(() => captureAttribution(), []);
  return null;
}

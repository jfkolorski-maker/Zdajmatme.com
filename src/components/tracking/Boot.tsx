"use client";
import { useEffect } from "react";
import { captureAttribution, persistIfAllowed } from "@/lib/attribution";
import { useConsent } from "@/lib/consent";
import { track } from "@/lib/tracking";

/** Captures UTM / click IDs and sends the initial page_view. Renders nothing. */
export function Boot() {
  const consent = useConsent();
  useEffect(() => {
    captureAttribution();
    track("page_view", { page_path: window.location.pathname });
  }, []);
  useEffect(() => {
    if (consent?.ads) persistIfAllowed();
  }, [consent?.ads]);
  return null;
}

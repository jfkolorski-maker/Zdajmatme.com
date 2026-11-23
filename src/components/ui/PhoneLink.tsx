"use client";

import type { ReactNode } from "react";
import { BRAND, telHref } from "@/config/brand";
import { track } from "@/lib/ads/track";

/** Every tel: link goes through here so each call click is measured. Visible text = accessible name. */
export function PhoneLink({ placement, className = "", children }: { placement: string; className?: string; children?: ReactNode }) {
  return (
    <a href={telHref()} className={className} onClick={() => track({ name: "phone_click", placement })}>
      {children ?? BRAND.phone}
    </a>
  );
}

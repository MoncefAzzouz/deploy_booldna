import React from "react";
import Avatar from "@mui/material/Avatar";

export default function DonorAvatar({ name }: { name?: string }) {
  const initial = (name ?? "?").charAt(0).toUpperCase();
  return <Avatar aria-label={`Avatar ${name}`}>{initial || "?"}</Avatar>;
}

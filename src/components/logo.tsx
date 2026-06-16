import Image from "next/image";
import { brand } from "@/lib/brand";

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      {brand.logoSrc ? (
        <Image
          src={brand.logoSrc}
          alt={`${brand.name} ${brand.nameAccent}`}
          width={28}
          height={28}
          priority
          className="h-7 w-7 object-contain"
        />
      ) : (
        <span className="accent-gradient flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-white">
          {brand.name.charAt(0)}
        </span>
      )}
      <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
        {brand.name}
        <span className="accent-text"> {brand.nameAccent}</span>
      </span>
    </span>
  );
}

import type { ComponentProps } from "react";

// Single source of truth for body type. Each size bundles font-size, kerning,
// and leading. Define new styles here rather than setting
// text-[…]/tracking-[…]/leading-[…] inline anywhere else.
//
// Font sizes step at the custom breakpoints defined in globals.css (mobile-first;
// each range overrides the previous):
//   ≤640 (mobile, base)  regular 16  large 32
//   sm 641–880 (tablet)  regular 18  large 36
//   md 881–1200          regular 14  large 28
//   lg 1201–1727         regular 16  large 32
//   xl 1728+             regular 20  large 40
export const SIZE_STYLES = {
  bodyLarge:
    "text-[32px] sm:text-[36px] md:text-[28px] lg:text-[32px] xl:text-[40px] tracking-[-.02em] leading-[0.92]",
  bodyRegular:
    "text-[16px] sm:text-[18px] md:text-[14px] lg:text-[16px] xl:text-[20px] tracking-[-.01em] leading-[0.92]",
} as const;

export type TextSize = keyof typeof SIZE_STYLES;

type TextProps = ComponentProps<"p"> & {
  size?: TextSize;
};

export function Text({
  size = "bodyRegular",
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <p
      className={[SIZE_STYLES[size], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </p>
  );
}

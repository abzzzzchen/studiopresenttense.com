import type { ComponentProps } from "react";

// Single source of truth for body type. Each size bundles font-size, kerning,
// and leading. Define new styles here rather than setting
// text-[…]/tracking-[…]/leading-[…] inline anywhere else.
const SIZE_STYLES = {
  bodyLarge: "text-[32px] tracking-[-.02em] leading-[0.92]",
  bodyRegular: "text-[16px] tracking-[-.01em] leading-[0.92]",
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

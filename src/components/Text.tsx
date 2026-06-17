import type { ComponentProps } from "react";

// Single source of truth for body type. Each size bundles font-size, kerning,
// and leading. Define new styles here rather than setting
// text-[…]/tracking-[…]/leading-[…] inline anywhere else.
//
// Sizes are expressed in vw so type relationships scale with the viewport. The
// base value is the mobile reference (402px viewport); the `sm:` value is the
// desktop reference (1512px viewport):
//   bodyLarge   mobile 44px / 402  = 10.9453vw   desktop 40px / 1512 = 2.6455vw
//   bodyRegular mobile 20px / 402  =  4.9751vw   desktop 20px / 1512 = 1.3228vw
const SIZE_STYLES = {
  bodyLarge:
    "text-[10.9453vw] sm:text-[2.6455vw] tracking-[-.02em] leading-[0.92]",
  bodyRegular:
    "text-[4.9751vw] sm:text-[1.3228vw] tracking-[-.01em] leading-[0.92]",
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

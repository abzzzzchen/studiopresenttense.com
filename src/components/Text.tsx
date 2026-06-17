import type { ComponentProps } from "react";

// Single source of truth for body type. Each size bundles font-size, kerning,
// and leading. Define new styles here rather than setting
// text-[…]/tracking-[…]/leading-[…] inline anywhere else.
//
// Sizes are expressed in vw so type relationships scale with the viewport. The
// base value is the mobile reference (402px viewport); the `sm:` value is the
// desktop reference (1512px viewport), capped via min() so the type locks at a
// fixed px on large screens (50px / 25px, the size at the 1920px reference) and
// stops growing beyond it:
//   bodyLarge   mobile 44px / 402  = 10.9453vw   desktop 40px / 1512 = 2.6455vw   cap 50px
//   bodyRegular mobile 20px / 402  =  4.9751vw   desktop 20px / 1512 = 1.3228vw   cap 25px
const SIZE_STYLES = {
  bodyLarge:
    "text-[10.9453vw] sm:text-[min(2.6455vw,50px)] tracking-[-.02em] leading-[0.92]",
  bodyRegular:
    "text-[4.9751vw] sm:text-[min(1.3228vw,25px)] tracking-[-.01em] leading-[0.92]",
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

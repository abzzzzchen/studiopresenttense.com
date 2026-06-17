import type { ComponentProps } from "react";
import type { PortableText } from "next-sanity";

import { Text } from "@/components/Text";

// Render Studio block content as paragraphs with the same type styles as the
// rest of the body copy.
export const studioComponents: ComponentProps<typeof PortableText>["components"] =
  {
    block: {
      normal: ({ children }) => <Text>{children}</Text>,
    },
  };

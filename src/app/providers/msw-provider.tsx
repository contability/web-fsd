"use client";

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps): ReactElement {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsReady(true);
      return;
    }

    import("@/shared/mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setIsReady(true)),
    );
  }, []);

  if (!isReady) {
    return <></>;
  }

  return <>{children}</>;
}

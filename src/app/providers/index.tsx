"use client";

import { type ReactElement, type ReactNode } from "react";
import { MswProvider } from "./msw-provider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): ReactElement {
  return (
    <MswProvider>
      {children}
    </MswProvider>
  );
}

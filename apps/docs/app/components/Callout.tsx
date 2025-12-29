import type { ReactNode } from 'react';
import { Callout as FumaCallout } from 'fumadocs-ui/components/callout';

interface CalloutProps {
  type?: 'info' | 'warn' | 'error';
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  return (
    <FumaCallout type={type} title={title}>
      {children}
    </FumaCallout>
  );
}

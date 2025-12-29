'use client';

import { Tabs as FumaTabs, Tab } from 'fumadocs-ui/components/tabs';
import type { ReactNode } from 'react';

interface TabsProps {
  items: string[];
  children: ReactNode;
}

export { Tab };
export function Tabs({ items, children }: TabsProps) {
  return <FumaTabs items={items}>{children}</FumaTabs>;
}

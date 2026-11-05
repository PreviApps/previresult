// src/components/custom_card/CustomCard.types.ts
import { type ReactNode } from 'react';

export interface CustomCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  onClick?: () => void;
  /** Marca para el tour guiado (data-tour) */
  dataTour?: string;
}
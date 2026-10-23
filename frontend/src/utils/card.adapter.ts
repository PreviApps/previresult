// src/utils/card.adapter.ts

import type { CustomCardProps } from "../components/custom_card/custom-card.types";

/**
 * Función genérica para transformar cualquier entidad de la BD/API 
 * en las props de la CustomCard.
 * 
 * @template T - El tipo de tu objeto de origen (ej. ImagenMedica, Laboratorios, etc.)
 */
export interface CardAdapterConfig<T> {
  item: T;
  getTitle: (item: T) => string;
  getDescription: (item: T) => string;
  onClick?: (item: T) => void;
}

export function adaptToCard<T>({
  item,
  getTitle,
  getDescription,
  onClick,
}: CardAdapterConfig<T>): Omit<CustomCardProps, 'children'> {
  return {
    title: getTitle(item),
    description: getDescription(item),
    onClick: onClick ? () => onClick(item) : undefined,
  };
}
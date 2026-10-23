import type { DateValue } from "@heroui/react";

type DateRange = {
  start: DateValue;
  end: DateValue;
};

export interface CustomDateRangeProps {
  onSearch: (range: DateRange | null) => void;
}
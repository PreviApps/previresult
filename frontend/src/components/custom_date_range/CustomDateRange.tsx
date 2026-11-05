"use client";

import { useState } from "react";
import {
  DateField,
  DateRangePicker,
  Label,
  RangeCalendar,
  type DateRange,
} from "@heroui/react";
import type { CustomDateRangeProps } from "./custom-date-range.types";

export function CustomDateRange({ onSearch }: CustomDateRangeProps) {

  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const isRangeValid = Boolean(dateRange && dateRange.start && dateRange.end);

  const handleSearchClick = () => {
    if (!isRangeValid || !dateRange) {
      return;
    }
    onSearch(dateRange);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      <div className="w-full sm:w-80" data-tour="date-range">
      <DateRangePicker
        className="w-full"
        value={dateRange}
        onChange={setDateRange}
        endName="endDate"
        startName="startDate"
      >
        <Label className="sr-only">Rango de fechas</Label>
        <DateField.Group fullWidth className="bg-white">
          <DateField.Input slot="start">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateField.Suffix>
            <DateRangePicker.Trigger>
              <DateRangePicker.TriggerIndicator />
            </DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>

        <DateRangePicker.Popover>
          <RangeCalendar aria-label="Rango de fechas de consulta">
            <RangeCalendar.Header>
              <RangeCalendar.YearPickerTrigger>
                <RangeCalendar.YearPickerTriggerHeading />
                <RangeCalendar.YearPickerTriggerIndicator />
              </RangeCalendar.YearPickerTrigger>
              <RangeCalendar.NavButton slot="previous" />
              <RangeCalendar.NavButton slot="next" />
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar>
        </DateRangePicker.Popover>
      </DateRangePicker>
      </div>

      <button
        data-tour="search-btn"
        onClick={handleSearchClick}
        disabled={!isRangeValid}
        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow transition-colors flex items-center gap-2 h-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Consultar
      </button>
    </div>
  );
}
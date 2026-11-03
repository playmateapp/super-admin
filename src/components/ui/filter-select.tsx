'use client';

import { NativeSelect } from './native-select';

/**
 * Packed toolbar filter ("Select Location"). The first option is the placeholder and means
 * "no filter" (empty string).
 */
export interface FilterOption {
  value: string;
  label: string;
}

export function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: FilterOption[];
  className?: string;
}) {
  return (
    <NativeSelect
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
      containerClassName={className}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </NativeSelect>
  );
}

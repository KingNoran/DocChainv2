"use client";

import { nationalities } from "@/app/constants/nationalities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NationalitySelectProps {
  onChange?: (value: string) => void;
  value?: string;
}

export default function NationalitySelect({ onChange, value }: NationalitySelectProps) {
  return (
    <Select value={value || ""} onValueChange={(val) => onChange?.(val)}>
      <SelectTrigger>
        <SelectValue placeholder="Select Nationality" />
      </SelectTrigger>
      <SelectContent>
        {nationalities.map((nation) => (
          <SelectItem key={nation} value={nation}>
            {nation}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

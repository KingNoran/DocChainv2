"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseSelectProps {
  onChange?: (value: string) => void;
  value?: string;
}

export const courses = [
  { code: "BSIT", label: "BS Information Technology" },
  { code: "BSCS", label: "BS Computer Science" },
  { code: "BSCRIM", label: "BS Criminology" },
  { code: "BSHM", label: "BS Hospitality Management" },
  { code: "BSP", label: "BS Psychology" },
  { code: "BSED_M", label: "BSED Mathematics" },
  { code: "BSED_E", label: "BSED English" },
  { code: "BSBM_MM", label: "BS Business Management (Marketing Management)" },
];

export default function CourseSelect({ onChange, value }: CourseSelectProps) {
  return (
    <Select value={value || ""} onValueChange={(val) => onChange?.(val)}>
      <SelectTrigger>
        <SelectValue placeholder="Select Course" />
      </SelectTrigger>
      <SelectContent>
        {courses.map((course) => (
          <SelectItem key={course.code} value={course.code}>
            {course.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressSelectProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export default function AddressSelect({ onChange, defaultValue }: AddressSelectProps) {
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");

  // Fetch regions on mount
  useEffect(() => {
    fetch("/api/addresses/regions")
      .then((res) => res.json())
      .then(setRegions);
  }, []);

  // Fetch provinces when region changes
  useEffect(() => {
    if (!selectedRegion) return;
    fetch(`/api/addresses/provinces?regionCode=${selectedRegion}`)
      .then((res) => res.json())
      .then(setProvinces);
    setCities([]);
    setBarangays([]);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
  }, [selectedRegion]);

  // Fetch cities when province changes
  useEffect(() => {
    if (!selectedProvince) return;
    fetch(`/api/addresses/cities?provinceCode=${selectedProvince}`)
      .then((res) => res.json())
      .then(setCities);
    setBarangays([]);
    setSelectedCity("");
    setSelectedBarangay("");
  }, [selectedProvince]);

  // Fetch barangays when city changes
  useEffect(() => {
    if (!selectedCity) return;
    fetch(`/api/addresses/barangays?cityCode=${selectedCity}`)
      .then((res) => res.json())
      .then(setBarangays);
    setSelectedBarangay("");
  }, [selectedCity]);

  // Emit the full address string when selections change
  useEffect(() => {
    if (onChange) {
      const regionName = regions.find(r => r.region_code === selectedRegion)?.region_name || "";
      const provinceName = provinces.find(p => p.province_code === selectedProvince)?.province_name || "";
      const cityName = cities.find(c => c.city_code === selectedCity)?.city_name || "";
      const barangayName = barangays.find(b => b.brgy_code === selectedBarangay)?.brgy_name || "";

      const fullAddress = [barangayName, cityName, provinceName, regionName]
        .filter(Boolean)
        .join(", ");
      onChange(fullAddress);
    }
  }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
      {/* REGION */}
      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
        <SelectTrigger>
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.region_code} value={region.region_code}>
              {region.region_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* PROVINCE */}
      <Select
        value={selectedProvince}
        onValueChange={setSelectedProvince}
        disabled={!provinces.length}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Province" />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((province) => (
            <SelectItem
              key={province.province_code}
              value={province.province_code}
            >
              {province.province_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* CITY */}
      <Select
        value={selectedCity}
        onValueChange={setSelectedCity}
        disabled={!cities.length}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select City / Municipality" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.city_code} value={city.city_code}>
              {city.city_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* BARANGAY */}
      <Select
        value={selectedBarangay}
        onValueChange={setSelectedBarangay}
        disabled={!barangays.length}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Barangay" />
        </SelectTrigger>
        <SelectContent>
          {barangays.map((brgy) => (
            <SelectItem key={brgy.brgy_code} value={brgy.brgy_code}>
              {brgy.brgy_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

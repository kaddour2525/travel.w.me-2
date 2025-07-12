"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { countries } from "@/lib/countries"
import { Search } from "lucide-react"

interface CountrySelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function CountrySelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un pays",
  disabled,
}: CountrySelectProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedCountry = countries.find((c) => c.name === value)

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedCountry && (
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <SelectItem key={country.code} value={country.name} className="cursor-pointer">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <span>Aucun pays trouvé</span>
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}

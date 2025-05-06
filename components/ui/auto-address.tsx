"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Mock address data for South Africa
const southAfricaAddresses = [
  {
    id: "sa1",
    street: "123 Nelson Mandela Drive",
    suburb: "Sandton",
    city: "Johannesburg",
    province: "Gauteng",
    postalCode: "2196",
  },
  {
    id: "sa2",
    street: "45 Long Street",
    suburb: "City Centre",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8001",
  },
  {
    id: "sa3",
    street: "78 Florida Road",
    suburb: "Morningside",
    city: "Durban",
    province: "KwaZulu-Natal",
    postalCode: "4001",
  },
  {
    id: "sa4",
    street: "12 Church Street",
    suburb: "Central",
    city: "Pretoria",
    province: "Gauteng",
    postalCode: "0002",
  },
  {
    id: "sa5",
    street: "56 Dorp Street",
    suburb: "Stellenbosch Central",
    city: "Stellenbosch",
    province: "Western Cape",
    postalCode: "7600",
  },
]

// Mock address data for Namibia
const namibiaAddresses = [
  {
    id: "na1",
    street: "123 Independence Avenue",
    suburb: "Central",
    city: "Windhoek",
    province: "Khomas",
    postalCode: "9000",
  },
  {
    id: "na2",
    street: "45 Sam Nujoma Drive",
    suburb: "Swakopmund Central",
    city: "Swakopmund",
    province: "Erongo",
    postalCode: "9000",
  },
  {
    id: "na3",
    street: "78 Hage Geingob Street",
    suburb: "Oshakati Main",
    city: "Oshakati",
    province: "Oshana",
    postalCode: "9000",
  },
  {
    id: "na4",
    street: "12 Mandume Ndemufayo Avenue",
    suburb: "Walvis Bay Central",
    city: "Walvis Bay",
    province: "Erongo",
    postalCode: "9000",
  },
  {
    id: "na5",
    street: "56 Bahnhof Street",
    suburb: "Central",
    city: "Lüderitz",
    province: "Karas",
    postalCode: "9000",
  },
]

interface Address {
  id: string
  street: string
  suburb: string
  city: string
  province: string
  postalCode: string
}

interface AutoAddressProps {
  country: string
  onAddressSelect: (address: {
    street: string
    suburb: string
    city: string
    province: string
    postalCode: string
  }) => void
}

export function AutoAddress({ country, onAddressSelect }: AutoAddressProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  // Get addresses based on selected country
  const addresses = React.useMemo(() => {
    if (country === "South Africa") return southAfricaAddresses
    if (country === "Namibia") return namibiaAddresses
    return []
  }, [country])

  return (
    <div className="space-y-2">
      <Label htmlFor="address-lookup">Find Address</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-white">
            {value ? addresses.find((address) => address.id === value)?.street : "Search for an address..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder={`Search for an address in ${country}...`} />
            <CommandList>
              <CommandEmpty>No address found.</CommandEmpty>
              <CommandGroup>
                {addresses.map((address) => (
                  <CommandItem
                    key={address.id}
                    value={address.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      onAddressSelect({
                        street: address.street,
                        suburb: address.suburb,
                        city: address.city,
                        province: address.province,
                        postalCode: address.postalCode,
                      })
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === address.id ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col">
                      <span className="font-medium">{address.street}</span>
                      <span className="text-xs text-gray-500">
                        {address.suburb}, {address.city}, {address.province}, {address.postalCode}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500 mt-1">
        <MapPin className="inline-block h-3 w-3 mr-1" />
        Search for your address to auto-fill the address fields below
      </p>
    </div>
  )
}

'use client'

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useMemo, useState } from 'react'
import { debounce } from 'remeda'
import { Location } from './use-current-location'

type Props = {
  marker: { lat: number; lng: number; address: string } | null
  onSelectLocation: (location: Location & { address: string }) => void
}

export const GoogleMapPlacesAutocomplete = ({
  marker,
  onSelectLocation
}: Props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const places = useMapsLibrary('places')
  const geocoder = useMapsLibrary('geocoding')

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.AutocompleteService | null>(null)
  const [place, setPlace] = useState<google.maps.places.PlacesService | null>(
    null
  )
  const [geocode, setGeocode] = useState<google.maps.Geocoder | null>()

  // Suggestions after search
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])

  useEffect(() => {
    if (marker && geocode) {
      geocode.geocode(
        { location: { lat: marker.lat, lng: marker.lng } },
        (results) => {
          if (results && results[0]) {
            const { place_id, formatted_address } = results[0]

            setValue(place_id)
            setSuggestions([
              {
                structured_formatting: {
                  main_text: formatted_address,
                  secondary_text: '',
                  main_text_matched_substrings: []
                },
                place_id,
                matched_substrings: [],
                types: [],
                terms: [],
                description: ''
              }
            ])
          }
        }
      )
    }
  }, [marker, geocode])

  useEffect(() => {
    if (places && geocoder) {
      setPlace(new places.PlacesService(document.createElement('div')))
      setAutocomplete(new places.AutocompleteService())

      // Find current marker placeId, label
      setGeocode(new geocoder.Geocoder())
    }
  }, [places])

  const selected = suggestions.find(
    (suggestion) => suggestion.place_id === value
  )

  const fetch = useMemo(
    () =>
      debounce(
        (input: string, callback: (predictions: any) => void) => {
          autocomplete?.getPlacePredictions(
            {
              input,
              language: 'ka',
              componentRestrictions: {
                country: ['ge']
              }
            },
            callback
          )
        },
        { waitMs: 500 }
      ),
    [autocomplete]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between rounded-3xl"
        >
          {selected
            ? `${selected?.structured_formatting.main_text}, ${selected?.structured_formatting.secondary_text}`
            : 'Choose your business location'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Input
          placeholder="Search for places"
          onChange={({ target: { value } }) => {
            fetch.call(
              value,
              (
                predictions: Array<google.maps.places.AutocompletePrediction>
              ) => {
                setSuggestions((prev) => [...prev, ...(predictions ?? [])])
              }
            )
          }}
        />
        <div className="bg-red-300 h-[400px] text-black">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => {
                if (suggestion.place_id === value) {
                  setValue('')
                  setOpen(false)
                  return
                }

                setValue(suggestion.place_id)
                setOpen(false)
                place?.getDetails(
                  { placeId: suggestion.place_id },
                  (prediction) => {
                    if (prediction?.geometry?.location) {
                      onSelectLocation({
                        latitude: prediction?.geometry?.location?.lat(),
                        longitude: prediction?.geometry?.location?.lng(),
                        address: `${suggestion.structured_formatting.main_text}, ${suggestion.structured_formatting.secondary_text}`
                      })
                    }
                  }
                )
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  value === suggestion.place_id ? 'opacity-100' : 'opacity-0'
                )}
              />
              {`${suggestion.structured_formatting.main_text}, ${suggestion.structured_formatting.secondary_text}`}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

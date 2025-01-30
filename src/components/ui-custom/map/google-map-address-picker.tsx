'use client'

import {
  AdvancedMarker,
  ControlPosition,
  Map,
  MapControl,
  MapMouseEvent,
  useMap
} from '@vis.gl/react-google-maps'
import { MapIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ControlIconButton } from './components/control-icon-button'
import { GoogleMapPlacesAutocomplete } from './google-map-places-autocomplete'
import { styles } from './styles'
import { useCurrentLocation } from './use-current-location'
import { zoomToMarker } from './utils'

const markers = [
  { lat: 41.822438, lng: 41.778414 }, // ~1.2 km northeast
  { lat: 41.824038, lng: 41.770014 }, // ~1.6 km northwest
  { lat: 41.816038, lng: 41.768414 }, // ~2.1 km southwest
  { lat: 41.818038, lng: 41.781914 }, // ~1.5 km east
  { lat: 41.826438, lng: 41.772414 }, // ~3.1 km north
  { lat: 41.814038, lng: 41.776414 }, // ~2.5 km south
  { lat: 41.823438, lng: 41.784414 }, // ~3.2 km northeast
  { lat: 41.817038, lng: 41.769414 }, // ~2.3 km southwest
  { lat: 41.819038, lng: 41.780914 }, // ~1.9 km east
  { lat: 41.824838, lng: 41.773014 } // ~3.5 km northwest
]

export const GoogleMapAddressPicker = ({
  onAdressPick
}: {
  onAdressPick: ({
    address,
    latitude,
    longitude
  }: {
    address: string
    latitude: number
    longitude: number
  }) => void
}) => {
  const map = useMap()

  const { location: currentLocation, getCurrentLocation } = useCurrentLocation()

  const center = useMemo(
    () => ({
      lat: currentLocation.latitude,
      lng: currentLocation.longitude
    }),
    [currentLocation]
  )

  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)

  const onSelectMarker = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const lat = event.detail.latLng.lat
      const lng = event.detail.latLng.lng

      // Reverse geocode the coordinates to get the address in Georgian
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode(
        {
          location: { lat, lng },
          language: 'ka' // Set the language to Georgian
        },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const formattedAddress = results[0].formatted_address

            setSelectedMarker({ lat, lng, address: formattedAddress })
            zoomToMarker(lat, lng, map)

            // Save address into form
            onAdressPick({
              latitude: lat,
              longitude: lng,
              address: formattedAddress
            })
          } else {
            console.error('Geocoder failed due to: ', status)
          }
        }
      )
    }
  }

  console.log('SELECTED MARKER', { selectedMarker })

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-md">
      <Map
        mapId="silver"
        defaultZoom={14}
        defaultCenter={center}
        mapTypeId="roadmap"
        gestureHandling="greedy"
        fullscreenControl={false}
        mapTypeControl={false}
        zoomControl={false}
        streetViewControl={false}
        styles={styles}
        onClick={onSelectMarker}
      >
        {markers.map((position) => (
          <AdvancedMarker key={position.lat} position={position} />
        ))}
        {selectedMarker && <AdvancedMarker position={{ ...selectedMarker }} />}
        <MapControl position={ControlPosition.TOP_CENTER}>
          <div className="mt-5">
            <GoogleMapPlacesAutocomplete
              marker={selectedMarker}
              onSelectLocation={(location) => {
                const { latitude: lat, longitude: lng, address } = location

                setSelectedMarker({ lat, lng, address })
                zoomToMarker(lat, lng, map)

                // Save address into form
                onAdressPick({ latitude: lat, longitude: lng, address })
              }}
            />
          </div>
        </MapControl>
        <MapControl position={ControlPosition.RIGHT_CENTER}>
          <div className="absolute z-10 flex flex-col gap-2 right-5 top-1/2 -translate-y-1/2">
            <ControlIconButton
              icon={<MapIcon />}
              onClick={() => {
                const { latitude, longitude } = getCurrentLocation()
                map?.setCenter({
                  lat: latitude,
                  lng: longitude
                })
                map?.setZoom(14)
              }}
            />
            <ControlIconButton
              icon={<ZoomInIcon />}
              onClick={() => {
                const currZoom = map?.getZoom() ?? 0
                map?.setZoom(currZoom + 1)
              }}
            />
            <ControlIconButton
              icon={<ZoomOutIcon />}
              onClick={() => {
                const currZoom = map?.getZoom() ?? 0
                map?.setZoom(currZoom - 1)
              }}
            />
          </div>
        </MapControl>
      </Map>
    </div>
  )
}

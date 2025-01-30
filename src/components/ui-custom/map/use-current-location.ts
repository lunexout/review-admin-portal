import { useCallback, useEffect, useState } from 'react'

const DEFAULT_COORDINATES = {
  latitude: 41.7151,
  longitude: 44.8271
}

export type Location = { latitude: number; longitude: number }

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location>(DEFAULT_COORDINATES)

  const getCurrentLocation = useCallback(() => {
    let currentLocation = DEFAULT_COORDINATES

    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        setLocation(currentLocation)
      },
      () => {
        setLocation(currentLocation)
        console.log('Geolocation not available, using default location.')
      }
    )

    return currentLocation
  }, [])

  useEffect(() => {
    // Attempt to get user's current location
    getCurrentLocation()
  }, [])

  return { location, getCurrentLocation }
}

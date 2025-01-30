'use client'

import {
  AdvancedMarker,
  ControlPosition,
  Map,
  MapControl,
  useMap
} from '@vis.gl/react-google-maps'
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import { ControlIconButton } from './components/control-icon-button'

export const GoogleMapViewer = ({
  markers,
  defaultCenter
}: {
  markers: Array<{ lat: number; lng: number }>
  defaultCenter: { lat: number; lng: number }
}) => {
  const map = useMap()

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl">
      <Map
        mapId="3e61d3a05795150"
        defaultZoom={14}
        defaultCenter={defaultCenter}
        mapTypeId="roadmap"
        gestureHandling="greedy"
        fullscreenControl={false}
        mapTypeControl={false}
        zoomControl={false}
        streetViewControl={false}
        // styles={styles}
      >
        {markers.map((position) => (
          <AdvancedMarker key={position.lat} position={position} />
        ))}
        <MapControl position={ControlPosition.RIGHT_CENTER}>
          <div className="absolute z-10 flex flex-col gap-2 right-5 top-1/2 -translate-y-1/2">
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

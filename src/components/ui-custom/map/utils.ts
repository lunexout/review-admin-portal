export const zoomSmoothly = (
  map: google.maps.Map,
  zoomFinalPoint: number,
  zoomStartPoint: number,
  center: { lat: number; lng: number } // Keep marker in view
) => {
  if (zoomStartPoint >= zoomFinalPoint) {
    return
  } else {
    const z = google.maps.event.addListener(map, 'zoom_changed', () => {
      google.maps.event.removeListener(z)

      // Keep the marker centered during each zoom level
      map.setCenter(center)

      zoomSmoothly(map, zoomFinalPoint, zoomStartPoint + 1, center)
    })

    setTimeout(() => {
      map.setZoom(zoomStartPoint)
    }, 80) // Adjust timing if necessary
  }
}

export const zoomToMarker = (
  lat: number,
  lng: number,
  map: google.maps.Map | null
) => {
  if (!map) {
    return
  }

  map.panTo({ lat, lng })

  // After pan, smoothly zoom in while keeping the marker centered
  const currentZoom = map.getZoom() ?? 0
  const targetZoom = 20 // Adjust target zoom level as needed

  zoomSmoothly(map, targetZoom, currentZoom, { lat, lng })
}

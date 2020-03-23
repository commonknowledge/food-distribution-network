import * as React from 'react'
import { IMapHelpers, EnhancedMouseEventFunc, MapEvent, Viewport } from './core';
import { MapContext } from 'react-mapbox-gl';
import { useState } from 'react';

export const GlobalMapContext = React.createContext<{
  map: mapboxgl.Map | null,
  mapHelper: IMapHelpers | null,
  viewport: Viewport | null
  setMap: (next: mapboxgl.Map | null) => void
  setMapHelpers: (next: IMapHelpers | null) => void
  setViewport: (next: Viewport | null) => void
}>({
  map: null,
  mapHelper: null,
  viewport: null,
  setMap: (next) => { return },
  setMapHelpers: (next) => { return },
  setViewport: (next) => { return }
})

export const GlobalMapContextProvider: React.FC = ({ children }) => {
  const map = React.useRef<mapboxgl.Map>(null)
  const mapHelpers = React.useRef<IMapHelpers>(null)
  const viewport = React.useRef<Viewport>(null)
  const [hash, setHash] = useState(0)

  const setMap = React.useCallback((next: mapboxgl.Map | null) => {
    if (map.current == next || !!map.current || !next) return
    map.current = next
    setHash(h => h + 1)
  }, [map, setHash])

  const setMapHelpers = React.useCallback((next: IMapHelpers | null) => {
    if (mapHelpers.current == next || !!mapHelpers.current || !next) return
    mapHelpers.current = next
    setHash(h => h + 1)
  }, [mapHelpers, setHash])

  const setViewport = React.useCallback((next: Viewport | null) => {
    if (!next || JSON.stringify(viewport.current) === JSON.stringify(next)) return
    viewport.current = next
    setHash(h => h + 1)
  }, [viewport, setHash])

  const context = React.useMemo(() => ({
    map: map.current,
    mapHelper: mapHelpers.current,
    viewport: viewport.current,
    setMap,
    setMapHelpers,
    setViewport
  }), [viewport.current, map.current, mapHelpers.current, hash])

  return (
    <GlobalMapContext.Provider key={map.current?.toString()} value={context}>
      <MapContext.Provider key={mapHelpers.current?.toString()} value={context.map || undefined}>
        {children}
      </MapContext.Provider>
    </GlobalMapContext.Provider>
  )
}

export const GlobalMapContextConsumer = GlobalMapContext.Consumer

export const useMapEventHandlers = (listeners: {
  onClick?: EnhancedMouseEventFunc
  onMouseDown?: EnhancedMouseEventFunc
  onHover?: EnhancedMouseEventFunc
}) => {
  const { mapHelper } = React.useContext(GlobalMapContext)

  // Handle events as an extension of the base map
  React.useEffect(() => {
    if (!mapHelper) return

    Object.entries(listeners).forEach(([on, cb]) => {
      !!cb && mapHelper.addListener(on as MapEvent, cb)
    })

    return () => {
      Object.entries(listeners).forEach(([on, cb]) => {
        !!cb && mapHelper.removeListener(on as MapEvent, cb)
      })
    }
  }, [listeners, mapHelper])
}
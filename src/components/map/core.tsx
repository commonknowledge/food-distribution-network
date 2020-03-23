/** @jsx jsx */
import { jsx } from 'theme-ui'
import * as React from 'react'
import MapGL, {
  FlyToInterpolator,
  InteractiveMapProps,
  ViewState,
  PointerEvent,
} from 'react-map-gl'
import { BBox } from '@turf/helpers'
import { Padding } from 'viewport-mercator-project'
import { GlobalMapContext } from './context';
import { GATSBY_MAPBOX_USERNAME, GATSBY_MAPBOX_STYLE_ID, GATSBY_MAPBOX_ACCESS_TOKEN } from '../../data/constants';
import { useEffect } from 'react';

export type Viewport = ViewState & Partial<InteractiveMapProps>
type FitFeaturesOverrides = (
  prevViewport: Viewport,
  nextViewport: Viewport
) => Partial<Viewport>
type MouseEventFunc = (event: PointerEvent) => void
export type EnhancedMouseEventFunc = (
  event: PointerEvent,
  lngLat: number[],
  features: mapboxgl.MapboxGeoJSONFeature[]
) => void
export type MapEvent = 'onClick' | 'onMouseDown' | 'onHover'

export interface IMapHelpers {
  /**
   * Access the MapBoxGl object.
   */
  getMapObject: () => mapboxgl.Map | false
  /**
   * Provide the relative scale of an object.
   * Use to render markers on 3D maps with depth.
   */
  scaleFromDepth: (coordinates: [number, number]) => number
  getMapEventFeature: (e: PointerEvent) => any | null
  addListener: (on: MapEvent, cb: EnhancedMouseEventFunc) => void
  removeListener: (on: MapEvent, cb: EnhancedMouseEventFunc) => void
}

export interface MapProps extends Partial<Omit<InteractiveMapProps, MapEvent>> {
  mapboxStyleUrl?: string
  mapboxToken?: string
  width: number
  height: number
  bounds?: BBox
  initialViewport?: Partial<ViewState>
  minSize?: [number, number]
  children: React.ReactNode
  // collectMapHelpers: (helpers: IMapHelpers) => void // use ref instead
  fitFeatures?: GeoJSONFeature[]
  /**
   * Rules to abide by when fitting the camera to bounds or features.
   *
   * @type {FitBoundsOptions}
   * @memberof IProps
   */
  fitBoundsOptions?: FitBoundsOptions
  /**
   * Override viewport property updates before committing them to state.
   *
   * @type {FitFeaturesOverrides}
   * @memberof IProps
   */
  fitBoundsOverrides?: FitFeaturesOverrides
  getMapObject?: (map: mapboxgl.Map | undefined) => void
  onMapLoad?: (map: mapboxgl.Map, mapHelpers: IMapHelpers) => void
  /**
   * Recycle the map object to save memory.
   * NB: Beware of style persistence across map objects!
   * @type {boolean}
   * @memberof IProps
   */
  reuseMaps?: boolean
  controls?: boolean
  onClick?: EnhancedMouseEventFunc
  onMouseDown?: EnhancedMouseEventFunc
  onHover?: EnhancedMouseEventFunc
}

// http://uber-common.github.io/viewport-mercator-project/#/documentation/api-reference/webmercatorviewport
interface FitBoundsOptions {
  padding?: Padding
  offset?: [number, number]
  pitch?: number
}

export const defaultViewport = {
  latitude: 54.72814098390994,
  longitude: -3.578428221023512,
  zoom: 5.35,
  bearing: 0,
  pitch: 0,
  transitionDuration: 350,
  transitionInterpolator: new FlyToInterpolator()
}

const Map: React.FC<MapProps> = React.memo(props => {
  const [loaded, setLoaded] = React.useState<boolean>()
  const mapContext = React.useContext(GlobalMapContext)
  const { initialViewport, width, height } = props

  const [state, setState] = React.useState({
    width: width || 500,
    height: height || 500
  })

  const [viewport, setViewport] = React.useState<Viewport>({
    ...defaultViewport,
    ...initialViewport
  })

  const getMapObject = React.useCallback(() => {
    if (!mapContext.map || !(mapContext.map as any)._loaded) return false
    return mapContext.map
  }, [mapContext.map])

  // Event camera controls

  React.useEffect(() => {
    updateViewportDimensions()
  }, [props.width, props.height])

  const updateViewportDimensions = React.useCallback(() => {
    if (width > 100 && height > 100) {
      setState({ width, height })
    }
  }, [setState, width, height])

  const scaleFromDepth = ([longitude, latFeature]: [number, number]) => {
    const map = getMapObject()
    const pitch = viewport.pitch || 0
    //
    const max = 90
    const min = 0
    //
    if (!latFeature || !map || pitch < 5) return 1
    try {
      const mapBounds = map.getBounds()
      // Gives total coordinate height
      const latNorth = mapBounds.getNorth()
      const latSouth = mapBounds.getSouth()
      const latCenter = mapBounds.getCenter().lat
      // Get the range from the center to the edge
      const rangeLat = latNorth - latCenter
      // Subset height of the distance
      const offsetLat = latCenter - latFeature
      const relativeDepth = offsetLat / rangeLat
      // Apply depth to pitch.
      // For instance, at pitch 0 (flat map), the map has no actual depth so scale should be constant 1
      const perspective = Math.min(1, Math.max(0, (pitch || 0) / max))
      const relativeScale = relativeDepth * perspective * 0.66
      return Math.min(2, Math.max(0, relativeScale + 1))
    } catch (e) {
      console.warn(e)
      return 1
    }
  }

  const getMapEventFeature = (e: PointerEvent) => {
    const map = getMapObject()
    if (!map) return []
    try {
      return map.queryRenderedFeatures(e.point) || []
    } catch (e) {
      return []
    }
  }

  const onViewportChange = (viewport: ViewState) => {
    setViewport(viewport)
  }

  const listeners = React.useRef<Array<[MapEvent, EnhancedMouseEventFunc]>>([])

  const addListener: IMapHelpers['addListener'] = (on, cb) => {
    listeners.current.push([on, cb])
  }

  const removeListener: IMapHelpers['removeListener'] = (on, cb) => {
    listeners.current = listeners.current.filter(
      ([_n, _cb]) => on !== _n && cb !== _cb
    )
  }

  // TODO: Make this DRY
  const getListenersForProp = (hook: string) =>
    listeners.current.filter(([on, _]) => on === hook).map(([_, cb]) => cb)

  const onMouseDown: MouseEventFunc = (e): undefined => {
    const l = getListenersForProp('onMouseDown')
    if (!props.onMouseDown && !l.length) return
    const features = getMapEventFeature(e)
    props.onMouseDown && props.onMouseDown(e, e.lngLat, features)
    l.forEach(cb => cb(e, e.lngLat, features))
  }

  const onClick: MouseEventFunc = (e): undefined => {
    const l = getListenersForProp('onClick')
    if (!props.onClick && !l.length) return
    const features = getMapEventFeature(e)
    props.onClick && props.onClick(e, e.lngLat, features)
    l.forEach(cb => cb(e, e.lngLat, features))
  }

  const onHover: MouseEventFunc = (e): undefined => {
    const l = getListenersForProp('onHover')
    if (!props.onHover && !l.length) return
    const features = getMapEventFeature(e)
    props.onHover && props.onHover(e, e.lngLat, features)
    l.forEach(cb => cb(e, e.lngLat, features))
  }

  const { children } = props

  const mapHelper = {
    state,
    viewport,
    getMapObject: getMapObject,
    scaleFromDepth: scaleFromDepth,
    getMapEventFeature: getMapEventFeature,
    addListener,
    removeListener
  }

  mapContext.setMapHelpers(mapHelper)

  mapContext.setViewport({ ...viewport, ...state })

  // Pass on the mapbox instance to react-mapbox-gl children
  const getMap = (_map: MapGL | null) => {
    const map = _map?.getMap()
    if (!map || !_map?.getMap()) return
    mapContext.setMap(map)
    map.on('load', () => {
      if (map) {
        setLoaded(true)
      }
    })
  }

  return (
    <React.Fragment>
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css' rel='stylesheet' />
      <MapGL
        {...state}
        {...props}
        {...viewport}
        mapStyle={props.mapboxStyleUrl}
        mapboxApiAccessToken={props.mapboxToken}
        width={width}
        height={height}
        ref={getMap}
        onViewportChange={onViewportChange}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onHover={onHover}
        reuseMaps={true}
      >
        {loaded && children}
      </MapGL>
    </React.Fragment>
  )
})

export const MapViewportContext = React.createContext<
  Viewport & { width: number; height: number }
>({} as any)

export const useMapViewport = () => React.useContext(MapViewportContext)

Map.defaultProps = {
  controls: true,
  reuseMaps: true,
  mapboxStyleUrl: `mapbox://styles/${GATSBY_MAPBOX_USERNAME}/${
    GATSBY_MAPBOX_STYLE_ID
    }${process.env.NODE_ENV === 'development' ? '/draft' : ''}`,
  mapboxToken: GATSBY_MAPBOX_ACCESS_TOKEN
}

export default Map

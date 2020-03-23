/** @jsx jsx */
import { jsx } from "theme-ui"
import useWindowSize from '@react-hook/window-size'
import { ParentSize } from '@vx/responsive'
import Map from './core';
import { Fragment } from "react";
import { MapProps } from './core';

export const BackgroundMap: React.FC<Partial<MapProps>> = (props) => {
  const [, innerHeight] = useWindowSize()

  return (
    <ParentSize>
      {parent => (
        <Map
          width={parent.width}
          height={innerHeight}
          {...props}
        >
          <Fragment />
        </Map>
      )}
    </ParentSize>
  )
}

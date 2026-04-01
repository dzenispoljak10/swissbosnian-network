'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'

interface EuropeMapProps {
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

const ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'

const getCountryStyle = (id: number | string) => {
  const numId = Number(id)
  if (numId === 756) return { fill: '#F5C800', fillOpacity: 1, stroke: '#C9960A', strokeWidth: 1.5 }
  if (numId === 70)  return { fill: '#F5C800', fillOpacity: 1, stroke: '#C9960A', strokeWidth: 1.5 }
  return { fill: '#EEF2FF', fillOpacity: 1, stroke: '#C7D2FE', strokeWidth: 0.3 }
}

export default function EuropeMap({ width = 700, height = 600, className, style }: EuropeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function draw() {
      const world = (await d3.json(ATLAS_URL)) as Topology
      if (cancelled || !svgRef.current) return

      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const projection = d3
        .geoMercator()
        .center([14, 50])
        .scale(820)
        .translate([width / 2, height / 2])

      const path = d3.geoPath().projection(projection)

      const countries = topojson.feature(
        world,
        world.objects.countries as GeometryCollection,
      )

      svg
        .append('g')
        .selectAll('path')
        .data((countries as GeoJSON.FeatureCollection).features)
        .join('path')
        .attr('d', path as never)
        .attr('fill', (d) => getCountryStyle((d as GeoJSON.Feature).id ?? '').fill)
        .attr('fill-opacity', (d) => getCountryStyle((d as GeoJSON.Feature).id ?? '').fillOpacity)
        .attr('stroke', (d) => getCountryStyle((d as GeoJSON.Feature).id ?? '').stroke)
        .attr('stroke-width', (d) => getCountryStyle((d as GeoJSON.Feature).id ?? '').strokeWidth)

      if (!cancelled) setReady(true)
    }

    draw()
    return () => { cancelled = true }
  }, [width, height])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      style={{ overflow: 'visible', opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease', ...style }}
    />
  )
}

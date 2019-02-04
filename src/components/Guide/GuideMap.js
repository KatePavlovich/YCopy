import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import marker from './marker.svg'
import styles from './GuideMap.module.scss'
import Leaflet from 'leaflet'
import { MAP_SERVER, MAP_ATTRIBUTION } from '../../../config'
import 'leaflet/dist/leaflet.css'

if (typeof window !== 'undefined') {
  require('intersection-observer')
}

const offset = 730 / 2

class GuideMap extends Component {
  map = null
  markers = []

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.activePoint !== nextProps.activePoint
  }

  offsetCenter(center) {
    const { zoom } = this.props
    if (!this.map) return center
    const targetPoint = this.map.project(center, zoom).subtract([offset, 0])
    return this.map.unproject(targetPoint, zoom)
  }

  componentDidUpdate(prevProps) {
    if (this.map && this.props.activePoint && this.props.activePoint !== prevProps.activePoint) {
      const {
        zoom,
        activePoint: { latitude, longitude, slug },
      } = this.props
      this.markers.forEach((marker) => {
        marker.setIcon(marker.slug === slug ? this.activeMarkerIcon : this.markerIcon)
      })
      const center = this.offsetCenter([latitude, longitude])
      this.map.setView(center, zoom)
    }
  }

  componentDidMount() {
    const { points, longitude, latitude, zoom, onChangeActivePoint } = this.props

    this.markerIcon = Leaflet.icon({
      iconUrl: marker,
      iconSize: [40, 40],
    })
    this.activeMarkerIcon = Leaflet.icon({
      iconUrl: marker,
      iconSize: [60, 60],
    })

    this.map = Leaflet.map('map', {
      center: [latitude, longitude],
      zoom,
      zoomControl: false,
      layers: [
        Leaflet.tileLayer(MAP_SERVER, {
          attribution: MAP_ATTRIBUTION,
        }),
      ],
    })

    points.forEach(({ // title,
      longitude, latitude, slug }) => {
      const marker = Leaflet.marker([latitude, longitude], { icon: this.markerIcon, slug })
      marker
        .on('click', () => {
          window.location.hash = '#' + slug
          onChangeActivePoint({ longitude, latitude })
        })
        .addTo(this.map)
      marker.slug = slug
      this.markers.push(marker)
    })

    this.map.panBy([-offset, 0])
  }
  render() {
    const { className } = this.props
    return (
      <div className={classNames(className, styles.root)}>
        <div
          id="map"
          className={styles.map}
          ref={(mapContainer) => {
            this.mapContainer = mapContainer
          }}
        />
      </div>
    )
  }
}

GuideMap.propTypes = {
  className: PropTypes.string,
  points: PropTypes.array,
  zoom: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
}

export default GuideMap

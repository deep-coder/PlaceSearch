import React from "react";
import PropTypes from "prop-types";
import Styles from "./Map.module.scss";
import { getCurrentLocation } from "../../utils/location";
const google = window.google;
class MapRenderer extends React.Component {
  constructor() {
    super();
    this.mapRef = React.createRef();
    this.searchInputRef = React.createRef();
    this.map = null;
    this.searchBox = null;
    this.input = null;
    this.c = null;
  }
  componentDidMount() {
    const { initialZoom } = this.props;
    this.infoWindow = new google.maps.InfoWindow();
    let input = this.searchInputRef.current;
    this.searchBox = new google.maps.places.SearchBox(input);
    getCurrentLocation().then(response => {
      this.map = new google.maps.Map(this.mapRef.current, {
        center: { lat: response.latitude, lng: response.longitude },
        zoom: initialZoom,
        type: ["restaurant"],
        mapTypeId: "roadmap"
      });
      this.searchBox.bindTo("bounds", this.map);
      this.registerMapBoundListener();
      this.registerPlaceChangeListener();
    });
  }

  componentWillUnmount() {}

  createMarker = (markers, place, bounds, infoWindow) => {
    const { markerZoom } = this.props;
    const { renderInfoContent, map } = this;
    let icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(20, 20)
    };
    let marker = new google.maps.Marker({
      map: map,
      //icon: icon,
      title: place.name,
      position: place.geometry.location
    });
    markers.push(marker);
    marker.addListener("click", function() {
      map.setZoom(markerZoom);
      map.setCenter(marker.getPosition());
      infoWindow.setContent(renderInfoContent(place));
      infoWindow.open(map, this);
    });

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  };

  renderInfoContent = place => {
    return (
      "<strong>" +
      place.name +
      "</strong>" +
      "<div><strong>" +
      place.formatted_address +
      "</strong></div>"
    );
  };

  registerMapBoundListener = () => {
    const { map, searchBox } = this;
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  };

  registerPlaceChangeListener = () => {
    const { createMarker, map, searchBox, infoWindow } = this;
    let markers = [];
    searchBox.addListener("places_changed", () => {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      markers.forEach(marker => {
        marker.setMap(null);
      });
      markers = [];

      var bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        createMarker(markers, place, bounds, infoWindow);
      });
      map.fitBounds(bounds);
    });
  };
  render() {
    return (
      <div className={Styles.group}>
        <input
          id="search-input"
          ref={this.searchInputRef}
          className={Styles.search}
          type="text"
          placeholder="Search for your favourite Restaurant/Cuisine"
        />
        <div
          id="mapContainer"
          className={Styles.mapContainer}
          ref={this.mapRef}
        />
      </div>
    );
  }
}

MapRenderer.defaultProps = {
  initialZoom: 13,
  markerZoom: 20
};

MapRenderer.propTypes = {
  initialZoom: PropTypes.number,
  markerZoom: PropTypes.number
};

export default MapRenderer;

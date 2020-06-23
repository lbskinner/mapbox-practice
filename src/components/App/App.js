import React from "react";
import "./App.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

class App extends React.Component {
  state = {
    neighborhoodsLayerHide: "",
    tractsLayerHide: "",
    viewpoint: {
      lng: -94.578331,
      lat: 39.099724,
      zoom: 9,
    },
  };

  map = null;

  componentDidMount() {
    if (this.map === null) {
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [this.state.viewpoint.lng, this.state.viewpoint.lat],
        zoom: this.state.viewpoint.zoom,
      });
    }
    // when the map is load
    this.map.on("load", () => {
      // get/fetch GeoJSON raw file for kc-neighborhoods
      this.map.addSource("kc-neighborhoods", {
        type: "geojson",
        data:
          "https://raw.githubusercontent.com/mysidewalk/interview/master/frontend-engineer/kc-neighborhoods.json",
      });
      // add layer to the map
      this.map.addLayer({
        id: "kc-neighborhoods",
        type: "fill",
        source: "kc-neighborhoods",
        layout: {
          // make layer visible by default
          visibility: "visible",
        },
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.5,
        },
      });

      this.map.on("click", "kc-neighborhoods", (event) => {
        console.log(event.features[0].properties);
        new mapboxgl.Popup()
          .setLngLat(event.lngLat)
          .setHTML(event.features[0].properties.id)
          .addTo(this.map);
      });

      // Change the cursor to a pointer when the mouse is over the kc-neighborhoods layer
      this.map.on("mouseenter", "kc-neighborhoods", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves the kc-neighborhoods layer
      this.map.on("mouseleave", "kc-neighborhoods", () => {
        this.map.getCanvas().style.cursor = "";
      });

      // get/fetch GeoJSON raw file for kc-tracts
      this.map.addSource("kc-tracts", {
        type: "geojson",
        data:
          "https://raw.githubusercontent.com/mysidewalk/interview/master/frontend-engineer/kc-tracts.json",
      });
      // add layer to the map
      this.map.addLayer({
        id: "kc-tracts",
        type: "fill",
        source: "kc-tracts",
        layout: {
          // make layer visible by default
          visibility: "visible",
        },
        paint: {
          "fill-color": "#f03b20",
          "fill-opacity": 0.5,
        },
      });
      // Change the cursor to a pointer when the mouse is over the kc-tracts layer
      this.map.on("mouseenter", "kc-tracts", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves the kc-tracts layer
      this.map.on("mouseleave", "kc-tracts", () => {
        this.map.getCanvas().style.cursor = "";
      });
    });
  }

  toggleNeighborhoodsLayer = () => {
    let visibility = this.map.getLayoutProperty(
      "kc-neighborhoods",
      "visibility"
    );
    if (visibility === "visible") {
      this.map.setLayoutProperty("kc-neighborhoods", "visibility", "none");
      this.setState({
        ...this.state,
        neighborhoodsLayerHide: "hide",
      });
    }
    if (visibility === "none") {
      this.map.setLayoutProperty("kc-neighborhoods", "visibility", "visible");
      this.setState({
        ...this.state,
        neighborhoodsLayerHide: "",
      });
    }
  };

  toggleTractsLayer = () => {
    let visibility = this.map.getLayoutProperty("kc-tracts", "visibility");
    if (visibility === "visible") {
      this.map.setLayoutProperty("kc-tracts", "visibility", "none");
      this.setState({
        ...this.state,
        tractsLayerHide: "hide",
      });
    }
    if (visibility === "none") {
      this.map.setLayoutProperty("kc-tracts", "visibility", "visible");
      this.setState({
        ...this.state,
        tractsLayerHide: "",
      });
    }
  };
  render() {
    // let neighborhoodsLayerHide = "";
    // if (
    //   this.map &&
    //   this.map.getLayoutProperty("kc-neighborhoods", "visibility") === "none"
    // ) {
    //   neighborhoodsLayerHide = "hide";
    // }

    // let tractsLayerHide = "";
    // if (
    //   this.map &&
    //   this.map.getLayoutProperty("kc-tracts", "visibility") === "none"
    // ) {
    //   tractsLayerHide = "hide";
    // }
    return (
      <div id="map">
        <nav className="menu">
          <button
            onClick={this.toggleNeighborhoodsLayer}
            className={this.state.neighborhoodsLayerHide}
          >
            Neighborhoods
          </button>
          <button
            onClick={this.toggleTractsLayer}
            className={this.state.tractsLayerHide}
          >
            Tracts
          </button>
        </nav>
        <div
          ref={(el) => (this.mapContainer = el)}
          className="mapContainer"
        ></div>
      </div>
    );
  }
}

export default App;

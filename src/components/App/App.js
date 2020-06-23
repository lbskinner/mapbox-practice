import React from "react";
import "./App.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

class App extends React.Component {
  state = {
    lng: -94.578331,
    lat: 39.099724,
    zoom: 6,
  };

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });
  }
  render() {
    return (
      <div>
        <header>
          <p>Header</p>
        </header>
        <div
          ref={(el) => (this.mapContainer = el)}
          className="mapContainer"
        ></div>
      </div>
    );
  }
}

export default App;

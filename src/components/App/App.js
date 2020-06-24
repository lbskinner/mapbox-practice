import React from "react";
import "./App.css";
import mapboxgl from "mapbox-gl";
import Chart from "chart.js";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

class App extends React.Component {
  state = {
    neighborhoodsLayerClass: "",
    tractsLayerClass: "",
  };

  map = null;
  popup = null;

  removePopup = () => {
    if (this.popup !== null) {
      this.popup.remove();
    }
  };

  componentDidMount() {
    if (this.map === null) {
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-94.578331, 39.099724],
        zoom: 9,
      });
    }
    this.map.on("load", this.loadNeighborhoodsLayer);
    this.map.on("load", this.loadTractsLayer);
  }

  loadNeighborhoodsLayer = () => {
    this.map.addSource("kc-neighborhoods", {
      type: "geojson",
      data:
        "https://raw.githubusercontent.com/mysidewalk/interview/master/frontend-engineer/kc-neighborhoods.json",
    });
    this.map.addLayer({
      id: "kc-neighborhoods",
      type: "fill",
      source: "kc-neighborhoods",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.5,
      },
    });

    this.map.on("click", "kc-neighborhoods", (event) => {
      this.removePopup();
      const mapData = event.features[0].properties;
      this.popup = new mapboxgl.Popup()
        .setLngLat(event.lngLat)
        .setHTML('<canvas id="myChart" width="300px" height="250px"></canvas>')
        .setMaxWidth("300px")
        .addTo(this.map);
      const ctx = document.getElementById("myChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Drive Alone", "Carpool", "Public Transit", "Walk"],
          datasets: [
            {
              label: "Commuter Population",
              data: [
                mapData["pop-commute-drive_alone"],
                mapData["pop-commute-drive_carpool"],
                mapData["pop-commute-public_transit"],
                mapData["pop-commute-walk"],
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
            },
          ],
        },
        options: {
          title: {
            display: true,
            position: "top",
            text: `${mapData.shid}`,
          },
        },
      });
    });

    this.map.on("mouseenter", "kc-neighborhoods", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    this.map.on("mouseleave", "kc-neighborhoods", () => {
      this.map.getCanvas().style.cursor = "";
    });
  };

  loadTractsLayer = () => {
    this.map.addSource("kc-tracts", {
      type: "geojson",
      data:
        "https://raw.githubusercontent.com/mysidewalk/interview/master/frontend-engineer/kc-tracts.json",
    });
    this.map.addLayer({
      id: "kc-tracts",
      type: "fill",
      source: "kc-tracts",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "#f03b20",
        "fill-opacity": 0.5,
      },
    });

    this.map.on("click", "kc-tracts", (event) => {
      this.removePopup();
      const mapData = event.features[0].properties;
      this.popup = new mapboxgl.Popup()
        .setLngLat(event.lngLat)
        .setHTML('<canvas id="myChart" width="300px" height="250px"></canvas>')
        .setMaxWidth("300px")
        .addTo(this.map);
      const ctx = document.getElementById("myChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Drive Alone", "Carpool", "Public Transit", "Walk"],
          datasets: [
            {
              label: "Commuter Population",
              data: [
                mapData["pop-commute-drive_alone"],
                mapData["pop-commute-drive_carpool"],
                mapData["pop-commute-public_transit"],
                mapData["pop-commute-walk"],
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
            },
          ],
        },
        options: {
          title: {
            display: true,
            position: "top",
            text: `${mapData.shid}`,
          },
        },
      });
    });

    this.map.on("mouseenter", "kc-tracts", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    this.map.on("mouseleave", "kc-tracts", () => {
      this.map.getCanvas().style.cursor = "";
    });
  };

  toggleLayers = (event, layerId) => {
    this.removePopup();
    let statePropertyKey = "neighborhoodsLayerClass";
    if (layerId === "kc-tracts") {
      statePropertyKey = "tractsLayerClass";
    }
    const visibility = this.map.getLayoutProperty(layerId, "visibility");
    if (visibility === "visible") {
      this.map.setLayoutProperty(layerId, "visibility", "none");
      this.setState({
        ...this.state,
        [statePropertyKey]: "hide",
      });
    }
    if (visibility === "none") {
      this.map.setLayoutProperty(layerId, "visibility", "visible");
      this.setState({
        ...this.state,
        [statePropertyKey]: "",
      });
    }
  };

  render() {
    return (
      <div id="map">
        <nav className="menu">
          <button
            onClick={(event) => this.toggleLayers(event, "kc-neighborhoods")}
            className={this.state.neighborhoodsLayerClass}
          >
            Neighborhoods
          </button>
          <button
            onClick={(event) => this.toggleLayers(event, "kc-tracts")}
            className={this.state.tractsLayerClass}
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

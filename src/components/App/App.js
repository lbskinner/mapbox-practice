import React from "react";
import "./App.css";
import mapboxgl from "mapbox-gl";
import Chart from "chart.js";

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
  popup = null;

  componentDidMount() {
    if (this.map === null) {
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [this.state.viewpoint.lng, this.state.viewpoint.lat],
        zoom: this.state.viewpoint.zoom,
      });
    }
    // when the map is loaded, add the neighborhood layer to map
    this.map.on("load", this.loadNeighborhoodsLayer);
    // when the map is loaded, add the tracts layer to map
    this.map.on("load", this.loadTractsLayer);
  }

  loadNeighborhoodsLayer = () => {
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

    // when click on the neighborhoods layer, shown a popup with bar chart to display commuter data for the area
    this.map.on("click", "kc-neighborhoods", (event) => {
      if (this.popup !== null) {
        this.popup.remove();
      }
      console.log(event.features[0].properties);
      const mapData = event.features[0].properties;
      this.popup = new mapboxgl.Popup()
        .setLngLat(event.lngLat)
        .setHTML('<canvas id="myChart" width="400" height="400"></canvas>')
        .setMaxWidth("300px")
        .addTo(this.map);
      const ctx = document.getElementById("myChart");
      const myChart = new Chart(ctx, {
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
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
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

    // Change the cursor to a pointer when the mouse is over the kc-neighborhoods layer
    this.map.on("mouseenter", "kc-neighborhoods", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves the kc-neighborhoods layer
    this.map.on("mouseleave", "kc-neighborhoods", () => {
      this.map.getCanvas().style.cursor = "";
    });
  };

  loadTractsLayer = () => {
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

    // // when click on the tracts layer, shown a popup with bar chart to display commuter data for the area
    // this.map.on("click", "kc-tracts", (event) => {
    //   console.log(event.features[0].properties);
    //   const mapData = event.features[0].properties;
    //   new mapboxgl.Popup()
    //     .setLngLat(event.lngLat)
    //     .setHTML('<canvas id="myChart" width="400" height="400"></canvas>')
    //     .setMaxWidth("300px")
    //     .addTo(this.map);
    //   const ctx = document.getElementById("myChart");
    //   const myChart = new Chart(ctx, {
    //     type: "bar",
    //     data: {
    //       labels: ["Drive Alone", "Carpool", "Public Transit", "Walk"],
    //       datasets: [
    //         {
    //           label: `${mapData.shid}`,
    //           data: [
    //             mapData["pop-commute-drive_alone"],
    //             mapData["pop-commute-drive_carpool"],
    //             mapData["pop-commute-public_transit"],
    //             mapData["pop-commute-walk"],
    //           ],
    //           backgroundColor: [
    //             "rgba(255, 99, 132, 0.2)",
    //             "rgba(54, 162, 235, 0.2)",
    //             "rgba(255, 206, 86, 0.2)",
    //             "rgba(75, 192, 192, 0.2)",
    //             "rgba(153, 102, 255, 0.2)",
    //             "rgba(255, 159, 64, 0.2)",
    //           ],
    //         },
    //       ],
    //     },
    //   });
    // });

    // Change the cursor to a pointer when the mouse is over the kc-tracts layer
    this.map.on("mouseenter", "kc-tracts", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves the kc-tracts layer
    this.map.on("mouseleave", "kc-tracts", () => {
      this.map.getCanvas().style.cursor = "";
    });
  };

  toggleNeighborhoodsLayer = () => {
    if (this.popup !== null) {
      this.popup.remove();
    }
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

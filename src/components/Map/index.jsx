import { createEffect, onMount } from "solid-js";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useSearchParams } from "@solidjs/router";
import { createUpdateMarkers } from "./createUpdateMarkers.js";
import { usePerformance } from "../../context/performances.jsx";
import styles from "./Map.module.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlsYXJhYiIsImEiOiJjbGFzM2FpNjAxa2ViM25udnZpcDB0YXIwIn0.cEZIJO9PP-jh0jb0diCdXw";

function OSMMap(props) {
  const [params] = useSearchParams();
  const { lng = -2.585805, lat = 51.151755 } = params;
  const performances = usePerformance();
  let selectedPerformance = () => props.selectedPerformance;

  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map", // container ID
      style: "mapbox://styles/dilarab/clyed2jrx00qb01nw43sodf7q", // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 14, // starting zoom
      minZoom: 12.5,
    });

    // Fake location coordinates
    const fakeLocation = [lng, lat];

    // Create a custom marker element
    const el = document.createElement("div");
    el.className = "custom-marker";

    // Add the blinking circle to the marker
    const blinkingCircle = document.createElement("div");
    blinkingCircle.className = "blinking-circle";
    el.appendChild(blinkingCircle);

    // Add direction arrow to the marker
    const arrow = document.createElement("div");
    arrow.className = "direction-arrow";
    el.appendChild(arrow);

    // Add marker to the fake location
    new mapboxgl.Marker(el).setLngLat(fakeLocation).addTo(map);

    const compass = new mapboxgl.NavigationControl({
      showCompass: true,
      visualizePitch: true,
      showZoom: false,
    });
    map.addControl(compass, "bottom-left");

    // Trigger fake geolocation
    map.on("load", () => {
      // Optionally, fly to the fake location on load
      map.flyTo({
        center: fakeLocation,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });

      map.addSource("performances", {
        type: "geojson",
        data: { type: "FeatureCollection", performances },
      });

      const updateMarkers = createUpdateMarkers(map, performances);
      createEffect(() => {
        const time = props.selectedTime;
        if (map.isSourceLoaded("performances")) {
          const markers = updateMarkers(time, selectedPerformance());

          setTimeout(() => {
            map.on("zoom", () => {
              const scale = 1 + (map.getZoom() - 14) * 0.2;

              Object.values(markers).forEach((marker) => {
                new Promise((resolve) => {
                  const el = marker.getElement();
                  el.children[0].style.transform = `scale(${scale})`;
                  resolve();
                });
              });
            });
          }, 1000);
        }
      });

      createEffect(() => {
        const coords = props.selectedStage?.geometry.coordinates;
        if (coords) {
          map.flyTo({
            center: coords,
            zoom: 18,
            essential: true,
          });
        }
      });
    });
  });

  return <div id="map" tabindex="0" class={styles.map}></div>;
}

export default OSMMap;

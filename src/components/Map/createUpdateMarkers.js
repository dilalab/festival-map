import mapboxgl from "mapbox-gl";

const colors = ["#FDF1D4", "#F8AD34"];
const colorsTwo = ["#feb24c", "#1ba347"];

export function createUpdateMarkers(map, performances) {
  const markers = {};
  let markersOnScreen = {};

  function updateMarkers(selectedTime, selectedPerformance) {
    const newMarkers = {};
    const features = performances;

    for (const id in markersOnScreen) {
      markersOnScreen[id].remove();
    }

    for (const feature of features) {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;
      if (selectedTime < props.Time_From || selectedTime > props.Time_To) {
        continue;
      }
      const id = feature.id;
      let shouldHighlight = selectedPerformance?.id === id;

      if (shouldHighlight) {
        map.flyTo({
          center: coords,
          zoom: 18,
          essential: true,
        });
      }

      let marker = markers[id];
      const el = createDonutChart(props, selectedTime, {
        shouldHighlight,
      });
      marker = markers[id] = new mapboxgl.Marker({
        element: el,
      }).setLngLat(coords);
      newMarkers[id] = marker;

      new Promise((resolve) => {
        marker.addTo(map);
        resolve();
      });
    }

    markersOnScreen = newMarkers;
    return newMarkers
  }

  return updateMarkers;
}

function createDonutChart(
  props,
  selectedTime = 0,
  { shouldHighlight = false },
) {
  const fontSize = 12;
  const r = 19;
  const r0 = Math.round(r * 0.733);
  const w = r * 2;

  let html = `<div>
          <div>
            <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block; overflow: visible; opacity: 0.85;">`;

  let calc =
    (selectedTime - props.Time_From) / (props.Time_To - props.Time_From);

  html += donutSegment(
    0,
    calc,
    r,
    r0,
    shouldHighlight ? colorsTwo[0] : colors[0],
  );
  html += donutSegment(
    calc,
    1,
    r,
    r0,
    shouldHighlight ? colorsTwo[1] : colors[1],
  );

  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
            <text dominant-baseline="central" transform="translate(${r}, ${r})">
                ${props.Artist}
            </text>
          </svg>
        </div>
      </div>`;

  const el = document.createElement("div");
  el.innerHTML = html;
  return el.firstChild;
}

function donutSegment(start, end, r, r0, color) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  // draw an SVG path
  return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
    r + r * y0
  } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1} ${
    r + r0 * y1
  } A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
    r + r0 * y0
  }" fill="${color}" />`;
}

export const getTime = (day, time) => {
  let DAYS = ["Thursday", "Friday", "Saturday", "Sunday"];
  let dayIndex = DAYS.indexOf(day);
  let parsedTime = parseInt(time.split(":").join(""));
  let baseTime = dayIndex * 2400;
  return parsedTime < 800
    ? baseTime + 2400 + parsedTime
    : baseTime + parsedTime;
};

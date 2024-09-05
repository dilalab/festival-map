import { createSignal } from "solid-js";
import Map from "../components/Map";
import Navigation from "../components/NavigationV2/index.jsx";
import { Select } from "../components/Select.jsx";
import { usePerformance } from "../context/performances.jsx";

import { css } from "../../styled-system/css";

function Secondary() {
  const [selectedTime, setSelectedTime] = createSignal(0);
  const [selectedPerformance, setSelectedPerformance] = createSignal();
  const [selectedStage, setSelectedStage] = createSignal();
  const performances = usePerformance();

  let handleChange = (time) => {
    setSelectedTime(time);
  };

  let handleSelectChange = (item) => {
    const isItemStage = item.stage;
    if (isItemStage) {
      setSelectedStage(item);
    } else {
      setSelectedTime(item.properties.Time_From);
      setSelectedPerformance(item);
    }
  };

  return (
    <>
      <div
        class={css({
          width: "70%",
          position: "absolute",
          zIndex: 9999,
          background: "white",
          left: "50%",
          transform: "translateX(-50%)",
          top: 4,
        })}
      >
        <Select options={performances} onChange={handleSelectChange} />
      </div>

      <Map
        selectedTime={selectedTime()}
        selectedPerformance={selectedPerformance()}
        selectedStage={selectedStage()}
      />
      <Navigation
        selectedTime={selectedPerformance()?.properties.Time_From ?? 0}
        onChange={handleChange}
      />
    </>
  );
}

export default Secondary;

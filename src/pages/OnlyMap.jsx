import { createSignal } from "solid-js";
import Map from "../components/Map/index.jsx";

function OnlyMap() {
  const [selectedTime, setSelectedTime] = createSignal(0);
  const [selectedPerformance, setSelectedPerformance] = createSignal();
  const [selectedStage, setSelectedStage] = createSignal();

  return (
    <div className="version-3">
      <Map
        selectedTime={selectedTime()}
        selectedPerformance={selectedPerformance()}
        selectedStage={selectedStage()}
      />
    </div>
  );
}

export default OnlyMap;

import { createContext, useContext } from "solid-js";
import { getTime } from "../utils";
import performances from "../data/performances_mainstages.json";

const PerformanceContext = createContext();

export function PerformanceProvider(props) {
  let value = performances.features.map((d) => {
    let timeFrom = getTime(d.properties.Day, d.properties.Time_From);
    let timeTo = getTime(d.properties.Day, d.properties.Time_To);
    timeTo = timeFrom > timeTo ? timeTo + 2400 : timeTo;

    return {
      ...d,
      properties: {
        ...d.properties,
        Time_From: timeFrom,
        Time_To: timeTo,
      },
    };
  });

  return (
    <PerformanceContext.Provider value={value}>
      {props.children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  return useContext(PerformanceContext);
}

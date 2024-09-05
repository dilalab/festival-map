import { DAYS } from "./constants.js";

export const numberToTime = (time) => {
  if (time === 0) return "00:00";
  else if (time >= 1000) {
    return time.toString().replace(/(\d{2})(\d{2})/, "$1:$2");
  } else if (time >= 100) {
    return time.toString().replace(/(\d{1})(\d{2})/, "0$1:$2");
  }
  return time.toString().replace(/((\d{2}))/, "00:$1");
};

export const getTime = (day, time) => {
  let dayIndex = DAYS.indexOf(day);
  let parsedTime = parseInt(time.split(":").join(""));
  let baseTime = dayIndex * 2400;
  return parsedTime < 800
    ? baseTime + 2400 + parsedTime
    : baseTime + parsedTime;
};

export const roundTo = (n, divider = 15) => {
  return n % divider >= Math.ceil(divider / 2)
    ? n + divider - (n % divider)
    : n - (n % divider);
};

export const calculateTime = (scrollPosition, barSize = 131) => {
  let time = (24 * 60 * (barSize - (barSize - scrollPosition))) / barSize / 60;
  let hours = Math.floor(time).toString().padStart(2, "0");

  let minutes = roundTo(Math.round((time - hours) * 60), 15); // Round to nearest 15 minutes
  minutes = minutes === 60 ? 45 : minutes; // Handle edge case where minutes could be rounded to 60
  minutes = minutes.toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

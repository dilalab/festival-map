import { For, createEffect, createSignal } from "solid-js";
import styles from "./Navigation.module.scss";
import { DAYS } from "../../constants.js";
import { numberToTime } from "../../utils.js";
import { Slider } from "../Slider";

let formatValue = (value) => {
  // Total number of 15-minute intervals in a day
  const totalIntervals = 24 * 4; // 24 hours * 4 intervals per hour

  // Calculate the interval index based on the inverted slider value
  const intervalIndex = Math.round((value / 100) * (totalIntervals - 1));

  // Calculate hours and minutes from the interval index
  const hours = Math.floor(intervalIndex / 4);
  const minutes = (intervalIndex % 4) * 15;

  // Combine hours and minutes into a single number in HHMM format
  const timeNumber = hours * 100 + minutes;

  return timeNumber;
};

function Navigation(props) {
  const [selectedTime, setSelectedTime] = createSignal(0);
  const [selectedDay, setSelectedDay] = createSignal(0);
  const [sliderVal, setSliderVal] = createSignal(0);

  let handleDayClick = (day) => {
    setSelectedDay(DAYS.indexOf(day));
    let newValue = DAYS.indexOf(day) * 2400 + selectedTime();
    props.onChange(newValue);
  };


  let handleTimeChange = (time, shouldUpdateParent) => {
    const invertedTime = 100 - time; // Invert the slider value
    let newValue = selectedDay() * 2400 + formatValue(invertedTime);

    setSliderVal(time); // Set the actual slider value (not inverted) for display
    setSelectedTime(newValue); // Set the calculated time

    if (shouldUpdateParent) {
      props.onChange(newValue);
    }
  };

  createEffect(() => {
    if (props.selectedTime) {
      let time = props.selectedTime % 2400;
      let day = Math.floor(props.selectedTime / 2400);
      setSelectedDay(day);
      setSelectedTime(time);

      setSliderVal(100 - Math.floor(time / (2400 / 100))); // Set the inverted initial slider value
    }
  });

  return (
    <div>
      <Slider
        value={sliderVal()}
        valueFormatted={numberToTime(selectedTime() % 2400)}
        onChange={handleTimeChange}
        onChangeEnd={(time) => handleTimeChange(time, true)}
      />

      <div class={styles.navigation}>
        <div class={styles.mobileDaysWrapper}>
          <For each={DAYS}>
            {(day) => (
              <button
                type="button"
                class={`${styles.day} ${selectedDay() === DAYS.indexOf(day) ? styles.active : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

export default Navigation;

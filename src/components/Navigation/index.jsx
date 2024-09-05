import { debounce } from "lodash-es";
import { For, createEffect, createSignal, on } from "solid-js";
import styles from "./Navigation.module.scss";
import { DAYS, TIME } from "../../constants.js";
import { calculateTime } from "../../utils.js";

function calculateScrollLeft(selectedTime) {
  return (selectedTime / 2400) * 131;
}

function Navigation(props) {
  const [scrollLeft, setScrollLeft] = createSignal(0);
  const [scrolled, setScrolled] = createSignal(false);
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [selectedTime, setSelectedTime] = createSignal("00:00");
  let rootElement;

  let handleScroll = (e) => {
    if (isScrolling()) return;
    let _scrollLeft = e.target.scrollLeft;

    setScrollLeft(_scrollLeft);
    setScrolled(true);

    let mutiplier = Math.floor(_scrollLeft / 131);
    let calculatedTime = calculateTime(_scrollLeft % 131);
    let calculatedTimeFinal =
      mutiplier * 2400 + parseInt(calculatedTime.split(":").join(""));
    props.onChange(calculatedTimeFinal);

    setSelectedTime(calculatedTime);
  };

  createEffect(() => {
    setIsScrolling(true);
    let scrollLeft = calculateScrollLeft(props.selectedTime);
    rootElement.scrollLeft = scrollLeft;

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  });

  createEffect(() => {
    if (props.selectedTime) {
      let time = props.selectedTime % 2400;
      setSelectedTime(time.toString().replace(/(\d{2})(\d{2})/, "$1:$2"));
    }
  });

  createEffect(
    on(
      scrollLeft,
      debounce(() => {
        setScrolled(false);
      }, 3000),
      { defer: true },
    ),
  );

  return (
    <div class={styles.navigation} onScroll={handleScroll} ref={rootElement}>
      <div style={{ position: "relative" }}>
        <div class={styles.timecode}>{selectedTime()}</div>
      </div>
      <div
        class={styles.mobileDaysWrapper}
        classList={{
          [styles.scrolled]: scrolled(),
        }}
      >
        <div
          style={{
            width: "50%",
            "min-width": "50%",
            "box-sizing": "border-box",
          }}
        ></div>
        <For each={DAYS}>
          {(day) => (
            <div>
              <div class={styles.day}>{day}</div>
              <ul>
                <For each={TIME}>{(time) => <li>{time}</li>}</For>
              </ul>
            </div>
          )}
        </For>
        <div
          style={{
            width: "50%",
            "min-width": "50%",
            "box-sizing": "border-box",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Navigation;

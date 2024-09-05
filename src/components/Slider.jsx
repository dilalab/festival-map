import { Slider as ArkSlider } from "./ui/slider";
import "./Slider.scss";

export const Slider = (props) => {
  let handleChange = (details) => {
    let [newValue] = details.value;

    props.onChange(newValue);
  };

  let handleChangeEnd = (details) => {
    let [newValue] = details.value;

    props.onChangeEnd(newValue);
  };

  return (
    <div class="slider">
      <ArkSlider
        orientation="vertical"
        step={1}
        value={[props.value]}
        onValueChange={handleChange}
        onValueChangeEnd={handleChangeEnd}
      >
        {props.valueFormatted}
      </ArkSlider>
    </div>
  );
};

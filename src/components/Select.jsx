import { For, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-solid";
import * as Combobox from "./ui/combobox";
import { IconButton } from "./ui/icon-button";
import { Input } from "./ui/input";

export const Select = (props) => {
  const [items, setItems] = createSignal(props.options);
  const [inputValue, setInputValue] = createSignal("");
  const stages = createMemo(() =>
    props.options
      .reduce((acc, item) => {
        if (acc.some((i) => i.properties.Stage === item.properties.Stage)) {
          return acc;
        }
        return [
          ...acc,
          {
            ...item,
            id: `stage_${item.id}`,
            stage: true,
          },
        ];
      }, [])
      .filter((item) =>
        inputValue()
          ? item.properties.Stage.toLowerCase().includes(
              inputValue()?.toLowerCase(),
            )
          : true,
      ),
  );

  const handleInputValueChange = (e) => {
    setInputValue(e.inputValue);
    const filtered = e.inputValue
      ? props.options.filter((item) =>
          item.properties.Artist.toLowerCase().includes(
            e.inputValue.toLowerCase(),
          ),
        )
      : props.options;

    setItems(filtered);
  };

  const handleChange = (e) => {
    const [item] = e.items;
    props.onChange(item);
  };

  return (
    <Combobox.Root
      items={[...items(), ...stages()]}
      onInputValueChange={handleInputValueChange}
      onValueChange={handleChange}
      itemToValue={(item) => item.id}
      itemToString={(item) =>
        item.stage ? item.properties.Stage : item.properties.Artist
      }
    >
      <Combobox.Control>
        <Combobox.Input asChild={Input} placeholder="Type the name of the band or stage">
          <Input />
        </Combobox.Input>
        <Combobox.Trigger>
          <IconButton variant="link" aria-label="open" size="xs">
            <ChevronsUpDownIcon />
          </IconButton>
        </Combobox.Trigger>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Bands</Combobox.ItemGroupLabel>
              <For each={items()}>
                {(item) => (
                  <Combobox.Item item={item}>
                    <Combobox.ItemText>
                      {item.properties.Artist}
                    </Combobox.ItemText>
                    <Combobox.ItemIndicator>
                      <CheckIcon />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </For>
            </Combobox.ItemGroup>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Stages</Combobox.ItemGroupLabel>
              <For each={stages()}>
                {(item) => (
                  <Combobox.Item item={item}>
                    <Combobox.ItemText>
                      {item.properties.Stage}
                    </Combobox.ItemText>
                    <Combobox.ItemIndicator>
                      <CheckIcon />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </For>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

import type { Meta, StoryObj } from "@storybook/react";
import MultiSelect from "../Components/MultiSelect"; // Adjust the import path as necessary

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    options: { control: [] },
    label: { control: "text" },
    mode: {
      control: {
        type: "select",
        options: ["primary", "light"]
      }
    },
    value: { control: [] },
    handleSelect: { action: "selected" },
    placeholder: { control: "text" },
    noDefault: { control: "boolean" },
    name: { control: "text" },
    loading: { control: "boolean" },
    disable: { control: "boolean" },
    maxWidth: { control: "number" },
    id: { control: "text" }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" }
    ],
    label: "Select Options",
    mode: "primary",
    value: [],
    placeholder: "Select...",
    name: "multiSelect",
    loading: false,
    disable: false,
    maxWidth: 300,
    id: "multi-select"
  }
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true
  }
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disable: true
  }
};

export const LightMode: Story = {
  args: {
    ...Default.args,
    mode: "light"
  }
};

export const WithDefaultValue: Story = {
  args: {
    ...Default.args,
    value: ["Option 1"]
  }
};

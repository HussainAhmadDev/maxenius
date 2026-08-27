// src/components/SelectField/SelectField.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import SelectField from "../Components/SelectField"; // Correct the import path

const meta: Meta<typeof SelectField> = {
  title: "Components/SelectField",
  component: SelectField,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    options: { control: "object" },
    label: { control: "text" },
    mode: { control: { type: "select", options: ["primary", "light"] } },
    value: { control: "text" },
    handleSelect: { action: "selected" },
    placeholder: { control: "text" },
    name: { control: "text" },
    loading: { control: "boolean" },
    disable: { control: "boolean" },
    maxWidth: { control: "number" },
    subValue: { control: "text" }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select an Option",
    mode: "primary",
    value: "",
    placeholder: "Select...",
    loading: false,
    disable: false,
    maxWidth: 300,
    subValue: ""
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

export const WithSubValue: Story = {
  args: {
    ...Default.args,
    subValue: "(sub value)"
  }
};

export const LightMode: Story = {
  args: {
    ...Default.args,
    mode: "light"
  }
};

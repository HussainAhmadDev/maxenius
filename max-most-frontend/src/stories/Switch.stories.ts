// src/components/Switch/Switch.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import Switch from "../Components/Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" }
  }
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Default Switch",
    checked: false,
    disabled: false
  }
};

export const Checked: Story = {
  args: {
    label: "Checked Switch",
    checked: true,
    disabled: false
  }
};

export const Disabled: Story = {
  args: {
    label: "Disabled Switch",
    checked: false,
    disabled: true
  }
};

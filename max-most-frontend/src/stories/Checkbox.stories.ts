import type { Meta, StoryObj } from "@storybook/react";
import Checkbox from "../Components/Checkbox"; // Adjust the import path as necessary

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    handleChange: { action: "changed" } // Use action for handleChange
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Default Checkbox",
    mode: "primary",
    handleChange: (val: { label: string; value: boolean }) => console.log(val)
  }
};

export const Loading: Story = {
  args: {
    label: "Loading Checkbox",
    loading: true
  }
};

export const Disabled: Story = {
  args: {
    label: "Disabled Checkbox",
    disabled: true,
    handleChange: (val: { label: string; value: boolean }) => console.log(val)
  }
};

export const Radio: Story = {
  args: {
    label: "Radio Button",
    child: "radio",
    handleChange: (val: { label: string; value: boolean }) => console.log(val)
  }
};

import type { Meta, StoryObj } from "@storybook/react";
import Chip from "../Components/Chip"; // Adjust the import path as necessary

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    // onClick: { action: "clicked" } // Use action for onClick
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Default Chip",
    color: "default",
    variant: "outlined"
    // onClick: () => console.log("Chip clicked")
  }
};

export const Filled: Story = {
  args: {
    label: "Filled Chip",
    color: "primary",
    variant: "filled"
    // onClick: () => console.log("Chip clicked")
  }
};

export const Info: Story = {
  args: {
    label: "Info Chip",
    color: "info",
    variant: "outlined"
    // onClick: () => console.log("Chip clicked")
  }
};

export const CustomColor: Story = {
  args: {
    label: "Custom Color Chip",
    color: "primary", // Example of a custom color
    variant: "filled"
    // onClick: () => console.log("Chip clicked")
  }
};

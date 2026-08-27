import type { Meta, StoryObj } from "@storybook/react";
import LoadingIconButton from "../Components/LoadingIconButton"; // Adjust the import path as necessary

const meta: Meta<typeof LoadingIconButton> = {
  title: "Components/LoadingIconButton",
  component: LoadingIconButton,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    color: {
      control: {
        type: "select",
        options: [
          "default",
          "inherit",
          "primary",
          "secondary",
          "error",
          "info",
          "success",
          "warning"
        ]
      }
    },
    size: {
      control: {
        type: "select",
        options: ["small", "medium", "large"]
      }
    },
    edge: {
      control: {
        type: "select",
        options: ["start", "end", false]
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    disabled: false,
    loading: false,
    color: "primary",
    size: "medium",
    edge: false
  }
};

export const Loading: Story = {
  args: {
    children: "Loading Button",
    disabled: false,
    loading: true,
    color: "primary",
    size: "medium",
    edge: false
  }
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
    loading: false,
    color: "primary",
    size: "medium",
    edge: false
  }
};

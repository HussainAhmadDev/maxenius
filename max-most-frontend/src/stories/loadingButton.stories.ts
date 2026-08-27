// LoadingButton.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import LoadingButton from "../Components/LoadingButton"; // Adjust the import path as necessary

const meta: Meta<typeof LoadingButton> = {
  title: "Components/LoadingButton",
  component: LoadingButton,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    startIcon: { control: "text" }, // Use 'text' to input JSX string for icons
    endIcon: { control: "text" }, // Use 'text' to input JSX string for icons
    variant: {
      control: {
        type: "select",
        options: ["text", "outlined", "contained"] // Ensure these match your Button variants
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Button",
    loading: false,
    disabled: false,
    variant: "text"
  }
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    loading: true,
    disabled: false,
    variant: "text"
  }
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    loading: false,
    disabled: true,
    variant: "text"
  }
};

export const LoadingWithStartIcon: Story = {
  args: {
    children: "With Start Icon",
    loading: true,
    startIcon: "<CircularProgress size={16} />", // Use string representation for JSX elements
    disabled: false,
    variant: "text"
  }
};

export const LoadingWithEndIcon: Story = {
  args: {
    children: "With End Icon",
    loading: true,
    endIcon: "<CircularProgress size={16} />", // Use string representation for JSX elements
    disabled: false,
    variant: "text"
  }
};

export const LoadingWithBothIcons: Story = {
  args: {
    children: "With Both Icons",
    loading: true,
    startIcon: "<CircularProgress size={16} />",
    endIcon: "<CircularProgress size={16} />",
    disabled: false,
    variant: "text"
  }
};

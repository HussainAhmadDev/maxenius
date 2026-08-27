import type { Meta, StoryObj } from "@storybook/react";
import DatePicker from "../Components/DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered" // Center the component in the Storybook preview
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    loading: { control: "boolean" },
    maxWidth: { control: "number" },
    id: { control: "text" }
    // Add more controls if needed
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select Date",
    loading: false,
    maxWidth: 300,
    id: "datepicker-1"
  }
};

export const Loading: Story = {
  args: {
    label: "Loading DatePicker",
    loading: true,
    maxWidth: 300,
    id: "datepicker-2"
  }
};

export const CustomWidth: Story = {
  args: {
    label: "Custom Width DatePicker",
    loading: false,
    maxWidth: 500,
    id: "datepicker-3"
  }
};

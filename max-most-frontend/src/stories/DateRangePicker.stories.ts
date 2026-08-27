import type { Meta, StoryObj } from "@storybook/react";
import DateRangePicker from "../Components/DateRangePicker"; // Adjust the import path as necessary

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered" // Center the component in the Storybook preview
  },
  tags: ["autodocs"], // Tag the stories for documentation purposes
  argTypes: {
    label: { control: "text" }, // Control type for the label
    loading: { control: "boolean" }, // Control type for the loading state
    maxWidth: { control: "number" }, // Control type for the maxWidth
    id: { control: "text" } // Control type for the id
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select Date Range",
    loading: false,
    maxWidth: 300,
    id: "daterangepicker-1"
  }
};

export const Loading: Story = {
  args: {
    label: "Loading Date Range Picker",
    loading: true,
    maxWidth: 300,
    id: "daterangepicker-2"
  }
};

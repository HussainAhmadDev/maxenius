import { forwardRef, ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormControl, FormControlProps } from '@mui/material';

import { StyledSelect } from './style';

type ReactHookFormSelectProps = FormControlProps & {
  name: string;
  control: Control;
  defaultValue?: unknown;
  children: ReactNode;
  isTable?: boolean;
};

const ReactHookFormSelect = forwardRef<HTMLDivElement, ReactHookFormSelectProps>(
  ({ name, control, defaultValue, children, isTable = false, ...props }, ref) => {
    return (
      <FormControl {...props} fullWidth ref={ref}>
        <Controller
          render={({ field }) => (
            <StyledSelect
              sx={{
                '.MuiOutlinedInput-notchedOutline': {
                  border: isTable ? 'none' : undefined,
                  '&:hover': {
                    border: isTable ? 'none' : undefined,
                  },
                },
              }}
              fullWidth
              {...field}
            >
              {children}
            </StyledSelect>
          )}
          name={name}
          control={control}
          defaultValue={defaultValue}
        />
      </FormControl>
    );
  },
);
ReactHookFormSelect.displayName = 'ReactHookFormSelect';
export default ReactHookFormSelect;

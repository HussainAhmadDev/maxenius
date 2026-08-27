import { Theme, ThemeOptions } from '@mui/material';

import AppBar from './AppBar';
import Button from './Button';
import Checkbox from './Checkbox';
import Dialog from './Dialog';
import Input from './Input';
import List from './List';
import Menu from './Menu';
import Stepper from './Stepper';
import Table from './Table';
import Tabs from './Tabs';

export default function ComponentsOverrides(theme: Theme): any {
  return Object.assign(
    AppBar(theme),
    Button(theme),
    List(theme),
    Input(theme),
    Table(theme),
    Menu(theme),
    Checkbox(theme),
    Stepper(theme),
    Dialog(theme),
    Tabs(theme),
  ) as ThemeOptions['components'];
}

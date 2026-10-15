import React from 'react';
import { CommandInput } from './CommandInput';

export interface UserInputProps {
  onSendCommand: (cmd: string) => void;
  disabled?: boolean;
}

export const UserInput: React.FC<UserInputProps> = (props) => {
  return <CommandInput {...props} />;
};

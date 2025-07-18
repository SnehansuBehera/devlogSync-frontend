import { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

export const Label = ({ children, htmlFor }: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

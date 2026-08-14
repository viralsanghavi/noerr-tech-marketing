import type {ReactNode} from "react";
import {cn} from "~/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container = ({children, className}: ContainerProps) => (
  <div className={cn("shell", className)}>{children}</div>
);

export default Container;

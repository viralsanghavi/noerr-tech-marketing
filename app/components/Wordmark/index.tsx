import {cn} from "~/lib/utils";

type WordmarkProps = {
  className?: string;
};

const Wordmark = ({className}: WordmarkProps) => (
  <span className={cn("font-display leading-none tracking-[-0.01em]", className)}>
    no<span className="text-accent">.</span>err
  </span>
);

export default Wordmark;

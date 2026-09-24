import {cn} from "~/lib/utils";

type WordmarkProps = {
  className?: string;
};

const Wordmark = ({className}: WordmarkProps) => (
  <img 
    src="/logo.png" 
    alt="no.err logo" 
    className={cn("object-contain", className)} 
  />
);

export default Wordmark;

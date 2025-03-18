import {NavLink} from "@remix-run/react";
import {NAVIGATION} from "~/utils/constants";

const Navigation = () => {
  return (
    <div className="flex gap-4 justify-between items-center">
      {NAVIGATION.map(({link, name, type}) => (
        <NavLink
          to={link}
          className={`text-black hover:text-secondary px-4 py-2 text-sm ${
            type === "button" ? "bg-noerr-red rounded-md hover:text-black " : ""
          }`}
        >
          {name}
        </NavLink>
      ))}
    </div>
  );
};

export default Navigation;

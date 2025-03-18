import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navigation from "../Navigation";

const Header = () => {
  const [top, setTop] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`bg-primary transition duration-700 ease-in-out px-8 md:px-0 sticky left-0 top-0 right-0 z-20 ${
        !top && `shadow-2xl`
      }`}
    >
      <div className="container mx-auto w-full flex items-center justify-between">
        <img
          onClick={() => navigate("/")}
          src="/logo.svg"
          className={`w-20 h-20 transition duration-700 ease-in-out cursor-pointer`}
        />
        <Navigation />
      </div>
    </header>
  );
};
// Dark Blue (#000000): Represents stability and trust.
// Turquoise (#74f0ed): Adds a tech-savvy and modern touch.
// Coral (#ea445a): Provides an energetic accent.
export default Header;

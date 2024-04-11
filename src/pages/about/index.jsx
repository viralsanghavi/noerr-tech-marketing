import React from "react";
import {Helmet} from "react-helmet-async";

const About = () => {
  return (
    <div>
      <Helmet>
        <title>About Page</title>
        <link rel="canonical" href="https://www.google.com/" />
      </Helmet>
      About
    </div>
  );
};

export default About;

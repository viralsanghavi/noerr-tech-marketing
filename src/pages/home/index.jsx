import React from "react";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.google.com/" />
      </Helmet>
      Home
    </div>
  );
};

export default Home;

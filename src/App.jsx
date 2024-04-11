import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./components/main-layout";
import Home from "./pages/home";
import About from "./pages/about";

const createRouteWithLayout = (path, childComponent) => (
  <Route path={path} index element={<MainLayout children={childComponent} />} />
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {createRouteWithLayout("/", <Home />)}
        {createRouteWithLayout("about", <About />)}
        {/* 
        <Route path="faqs" element={<MainLayout children={<Faqs />} />} />
        <Route
          path="terms-and-conditions"
          element={<MainLayout children={<Policy />} />}
        />
        <Route
          path="privacy-policy"
          element={<MainLayout children={<Policy />} />}
        />
        <Route
          path="refund-policy"
          element={<MainLayout children={<Policy />} />}
        />
        <Route
          path="shipping-policy"
          element={<MainLayout children={<Policy />} />}
        />
        <Route
          path="product/:productList"
          element={<MainLayout children={<ProductListing />} />}
        />
        <Route
          path="product/:productList/:productId"
          element={<MainLayout children={<ProductPage />} />}
        /> */}
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import Header from "./Header";

const MainLayout = ({
  children,
  layoutClassName,
}: {
  children: any;
  layoutClassName?: string;
}) => {
  return (
    <div className={`bg-primary min-h-screen h-full ${layoutClassName}`}>
      <Header />

      {children}
    </div>
  );
};

export default MainLayout;

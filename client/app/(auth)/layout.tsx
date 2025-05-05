import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="h-screen flex items-center justify-center">
      <div>{children}</div>
    </main>
  );
};

export default AuthLayout;

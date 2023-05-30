import { FC, PropsWithChildren } from "react";

const ModuleWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto max-w-screen-xl lg:p-12 lg:text-center">
      <div className="flex flex-row flex-wrap gap-2">{children}</div>
    </div>
  );
};

export default ModuleWrapper;

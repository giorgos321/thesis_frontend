import React, { useEffect, useRef } from "react";

const useDidUpdateEffect = (
  callback: () => void,
  dependencies: React.DependencyList
) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      callback();
    } else {
      didMountRef.current = true;
    }
  }, dependencies);
};

export default useDidUpdateEffect;

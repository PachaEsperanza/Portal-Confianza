import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animating, setAnimating] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        prevPath.current = location.pathname;
        setAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
    setDisplayChildren(children);
    prevPath.current = location.pathname;
    return undefined;
  }, [location.pathname, children]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        animating
          ? "opacity-0 translate-y-2"
          : "opacity-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  );
}
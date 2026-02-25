import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../analytics";
import { clarity } from "react-microsoft-clarity";

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);

    if (clarity && clarity.setTag) {
      clarity.setTag("page", location.pathname);
    }
  }, [location]);

  return null;
}

export default PageTracker;
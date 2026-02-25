import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-64F4HK1Q3X"); // your ID
};

export const trackPageView = (page:any) => {
  ReactGA.send({ hitType: "pageview", page });
};
import { IStyles } from "../types";

const highlightStyles = {
  border: "2px dashed red",
  transition: "0.3s border"
};

const highlightHoverStyles = {
  border: "2px solid red",
  transition: "0.3s border"
};

const tooltipStyles = {
  position: "absolute",
  background: "#fff",
  zIndex: "999",
  minWidth: "150px",
  maxWidth: "350px",
  padding: "15px",
  border: "2px solid #ccc",
  borderRadius: "5px",
  opacity: "0"
};

const overlayStyles = {
  position: "absolute",
  opacity: "0",
  boxSizing: "border-box",
  // let's hope we override everything, except the tooltip
  zIndex: "998",
  background: "red"
};

export function mergeStyle(passedStyle: IStyles = {}) {
  const newStyle: IStyles = {};

  newStyle.highlight = Object.assign(
    {},
    highlightStyles,
    passedStyle.highlight
  );
  newStyle.highlightHover = Object.assign(
    {},
    highlightHoverStyles,
    passedStyle.highlightHover
  );

  newStyle.tooltip = Object.assign({}, tooltipStyles, passedStyle.tooltip);
  newStyle.overlay = Object.assign({}, overlayStyles, passedStyle.overlay);

  return newStyle;
}

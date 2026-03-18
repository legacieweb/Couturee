/**
 * Scrolls the window to the top.
 * @param {boolean} smooth - Whether to use smooth scrolling. Defaults to true.
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
};

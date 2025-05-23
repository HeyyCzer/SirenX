/**
 * Buy Me a Coffee widget loader utility
 * @returns {void}
 */
export function loadBuyMeCoffeeWidget() {
  if (document.getElementById("bmc-script")) return;

  const script = document.createElement("script");
  const div = document.getElementById("supportByBMC");
  
  if (!div) {
    console.warn("Support By BMC div not found");
    return;
  }
  
  script.setAttribute("id", "bmc-script");
  script.setAttribute(
    "src",
    "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js",
  );
  script.setAttribute("data-name", "BMC-Widget");
  script.setAttribute("data-cfasync", "false");
  script.setAttribute("data-id", "heyyczer");
  script.setAttribute("data-description", "Support me on Buy me a coffee!");
  script.setAttribute("data-message", "Would you like to support this project?");
  script.setAttribute("data-color", "#40DCA5");
  script.setAttribute("data-position", "Right");
  script.setAttribute("data-x_margin", "18");
  script.setAttribute("data-y_margin", "18");

  script.onload = () => {
    const evt = new Event("DOMContentLoaded", {
      bubbles: false,
      cancelable: false,
    });
    window.dispatchEvent(evt);
  };

  div.appendChild(script);
}

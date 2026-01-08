const placeholderButton = document.getElementById("open-placeholder");
const placeholder = document.getElementById("ai-placeholder");

if (placeholderButton && placeholder) {
  placeholderButton.addEventListener("click", () => {
    placeholder.hidden = !placeholder.hidden;
    placeholderButton.textContent = placeholder.hidden
      ? "Preview placeholder"
      : "Hide placeholder";
  });
}

// === OPTIONS MENU LOGIC ===
const optionsBtn = document.getElementById("options-btn");
const optionsMenu = document.getElementById("options-menu");
const closeOptions = document.getElementById("close-options");
const backToMain = document.getElementById("back-to-main");

optionsBtn.addEventListener("click", () => {
  optionsMenu.classList.toggle("show");
});

closeOptions.addEventListener("click", () => {
  optionsMenu.classList.remove("show");
});

backToMain.addEventListener("click", () => {
  window.location.href = "../pages/index.html";
});

document.addEventListener("click", (event) => {
  if (!optionsBtn.contains(event.target) && !optionsMenu.contains(event.target)) {
    optionsMenu.classList.remove("show");
  }
});

// Handle volume control
const volumeSlider = document.getElementById("volume-slider");
volumeSlider.addEventListener("input", (event) => {
  console.log("Volume:", event.target.value);
  // Add logic to update game sound volume
});

// Handle music control
const musicSlider = document.getElementById("music-slider");
musicSlider.addEventListener("input", (event) => {
  console.log("Music Volume:", event.target.value);
  // Add logic to update background music
});
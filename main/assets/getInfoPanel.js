const gateDescriptions = {
    "AndGate": "Outputs TRUE only if both inputs are TRUE.",
    "OrGate": "Outputs TRUE if at least one input is TRUE.",
    "NotGate": "Outputs the opposite of the input.",
    "NandGate": "Outputs FALSE only if both inputs are TRUE.",
    "NorGate": "Outputs TRUE only if both inputs are FALSE.",
    "XorGate": "Outputs TRUE if inputs are different.",
    "XnorGate": "Outputs TRUE if inputs are the same."
  };
  
  const gateInfoPanel = document.getElementById("gateInfoPanel");
  const togglePanelBtn = document.getElementById("togglePanelBtn");
  const gateList = document.getElementById("gateList");
  const popup = document.getElementById("gateDescPopup");
  const desc = document.getElementById("descText");
  const content = document.getElementById("descContent");
  
  togglePanelBtn.addEventListener("click", () => {
    gateInfoPanel.classList.toggle("open");
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    const stored = localStorage.getItem('initialize_objects');
    if (!stored) return;
  
    const level = JSON.parse(stored);
    const levelDesc = document.getElementById("levelDesc");
  if (level.Description) {
    levelDesc.textContent = level.Description;
  }
    const gatesInLevel = [...new Set(level.Gates.map(g => g.type))];
  
    gateList.innerHTML = '';
    for (const gate of gatesInLevel) {
      const li = document.createElement("li");
      li.style.marginBottom = "10px";
      li.style.cursor = "pointer";
      li.textContent = gate.replace("Gate", "");
      li.title = gateDescriptions[gate] || "No description.";
  
      li.addEventListener("click", () => {
        desc.textContent = gateDescriptions[gate] || "No description.";
        popup.style.display = "flex";
  
        setTimeout(() => {
          window.addEventListener("click", closePopupOnClickOutside);
        }, 10);
      });
  
      gateList.appendChild(li);
    }
  });
  
  function closePopupOnClickOutside(event) {
    if (
      popup.style.display === "flex" &&
      !content.contains(event.target)
    ) {
      popup.style.display = "none";
      window.removeEventListener("click", closePopupOnClickOutside);
    }
  }
  
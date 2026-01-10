const statusNode = document.querySelector(".status");

async function hydrateDemo() {
  try {
    const response = await fetch("/api/demo");
    if (!response.ok) {
      throw new Error("API unavailable");
    }
    const payload = await response.json();
    if (statusNode) {
      statusNode.setAttribute("title", `Source: ${payload.source}`);
    }
  } catch (error) {
    if (statusNode) {
      statusNode.textContent = "Offline";
    }
  }
}

hydrateDemo();

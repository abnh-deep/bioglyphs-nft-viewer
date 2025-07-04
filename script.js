
let nfts = [];
let filtered = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("nfts.json");
  nfts = await res.json();
  filtered = nfts;
  render();
  setupFilters();
});

function render() {
  const grid = document.getElementById("nft-grid");
  const loader = document.getElementById("loading");
  loader.style.display = "none";
  grid.innerHTML = "";
  filtered.forEach(nft => {
    const card = document.createElement("div");
    card.className = "nft-card";
    card.innerHTML = `<img src="${nft.preview_gif}" alt="${nft.name}" />
                      <h3>${nft.name}</h3>`;
    card.onclick = () => openModal(nft);
    grid.appendChild(card);
  });
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      filtered = f === "all" ? nfts : nfts.filter(n => {
        if (f === "45" || f === "90") return n.attributes.some(a => a.value == f);
        if (f === "white") return n.attributes.some(a => a.value === "#ffffff");
        if (f === "blue") return n.attributes.some(a => a.value === "#3907ed");
        return true;
      });
      render();
    });
  });
}

function openModal(nft) {
  document.getElementById("modal-image").src = nft.preview_gif;
  const video = document.getElementById("modal-video");
  if (nft.animation_url.endsWith(".mp4")) {
    video.src = nft.animation_url;
    video.style.display = "block";
  } else {
    video.style.display = "none";
  }
  document.getElementById("modal-title").textContent = nft.name;
  document.getElementById("modal-description").textContent = nft.description;
  const attr = document.getElementById("modal-attributes");
  attr.innerHTML = "";
  nft.attributes.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.trait_type}: ${a.value}`;
    attr.appendChild(li);
  });
  document.getElementById("modal-viewer-link").href = nft.viewer_html;
  document.getElementById("modal-opensea-link").href = nft.opensea_url || "#";
  document.getElementById("modal-download").href = nft.metadata_json;
  document.getElementById("nft-modal").style.display = "flex";
}

document.getElementById("modal-close").onclick = () => {
  document.getElementById("nft-modal").style.display = "none";
};

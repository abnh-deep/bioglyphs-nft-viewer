let nfts = [];
let filtered = [];

fetch("nfts.json")
  .then((res) => res.json())
  .then((data) => {
    nfts = data;
    filtered = nfts;
    renderNFTs();
    setupFilters();
  });

function renderNFTs() {
  const grid = document.getElementById("nft-grid");
  grid.innerHTML = "";
  filtered.forEach((nft) => {
    const card = document.createElement("div");
    card.className = "nft-card";
    card.innerHTML = \`
      <img src="\${nft.preview_gif}" alt="\${nft.name}" />
      <h3>\${nft.name}</h3>
    \`;
    card.onclick = () => openModal(nft);
    grid.appendChild(card);
  });
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.filter;
      if (val === "all") {
        filtered = nfts;
      } else if (val === "white") {
        filtered = nfts.filter(n => n.attributes.some(a => a.value === "#ffffff"));
      } else if (val === "blue") {
        filtered = nfts.filter(n => n.attributes.some(a => a.value === "#3907ed"));
      } else {
        filtered = nfts.filter(n => n.attributes.some(a => a.value == val));
      }
      renderNFTs();
    });
  });
}

function openModal(nft) {
  document.getElementById("modal-title").textContent = nft.name;
  document.getElementById("modal-description").textContent = nft.description;
  document.getElementById("modal-image").src = nft.preview_gif;
  const video = document.getElementById("modal-video");
  if (nft.animation_url && nft.animation_url.endsWith(".mp4")) {
    video.src = nft.animation_url;
    video.style.display = "block";
  } else {
    video.style.display = "none";
  }

  const attrDiv = document.getElementById("modal-attributes");
  attrDiv.innerHTML = "";
  (nft.attributes || []).forEach(attr => {
    const p = document.createElement("p");
    p.textContent = \`\${attr.trait_type}: \${attr.value}\`;
    attrDiv.appendChild(p);
  });

  document.getElementById("viewer-link").href = nft.viewer_html || "#";
  document.getElementById("download-link").href = nft.metadata_json || "#";
  document.getElementById("nft-modal").style.display = "flex";
}

document.getElementById("modal-close").onclick = () => {
  document.getElementById("nft-modal").style.display = "none";
};
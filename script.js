let allNFTs = [];
let filteredNFTs = [];

fetch("nfts.json")
  .then((res) => res.json())
  .then((data) => {
    allNFTs = data;
    filteredNFTs = allNFTs;
    renderGallery();
    setupFilters();
  });

function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  filteredNFTs.forEach((nft) => {
    const card = document.createElement("div");
    card.className = "nft-card";
    card.innerHTML = `
      <img src="${nft.preview_gif}" alt="${nft.name}" />
      <h3>${nft.name}</h3>
    `;
    card.onclick = () => openModal(nft);
    gallery.appendChild(card);
  });
}

function setupFilters() {
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.onclick = () => {
      const val = btn.dataset.filter;
      if (val === "all") {
        filteredNFTs = allNFTs;
      } else if (val === "white") {
        filteredNFTs = allNFTs.filter(n => n.attributes.some(a => a.value === "#ffffff"));
      } else if (val === "blue") {
        filteredNFTs = allNFTs.filter(n => n.attributes.some(a => a.value === "#3907ed"));
      } else {
        filteredNFTs = allNFTs.filter(n => n.attributes.some(a => a.value == val));
      }
      renderGallery();
    };
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
    p.textContent = `${attr.trait_type}: ${attr.value}`;
    attrDiv.appendChild(p);
  });

  document.getElementById("modal-viewer").href = nft.viewer_html;
  document.getElementById("modal-download").href = nft.metadata_json;

  const tweetText = encodeURIComponent(`Check out this Bioglyph: ${nft.name}`);
  const tweetUrl = encodeURIComponent(nft.viewer_html);
  document.getElementById("modal-twitter").href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

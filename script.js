let nftsData = [];
let filteredNfts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadNFTs();
  updateTotalNftsCount();
  renderNFTs();
  setupEventListeners();
});

async function loadNFTs() {
  const loader = document.getElementById("loading");
  loader.style.display = "block";
  const res = await fetch("nfts.json");
  nftsData = await res.json();
  filteredNfts = nftsData;
  loader.style.display = "none";
}

function updateTotalNftsCount() {
  const countElement = document.getElementById("total-nfts");
  countElement.textContent = nftsData.length;
}

function renderNFTs() {
  const grid = document.getElementById("nft-grid");
  grid.innerHTML = "";

  if (filteredNfts.length === 0) {
    grid.innerHTML = "<p>Aucun NFT trouvé.</p>";
    return;
  }

  filteredNfts.forEach((nft) => {
    const card = document.createElement("div");
    card.className = "nft-card";

    const img = document.createElement("img");
    img.src = convertIPFSToHTTPS(nft.image);
    img.alt = nft.name;
    card.appendChild(img);

    card.addEventListener("click", () => openNFTModal(nft));
    grid.appendChild(card);
  });
}

function openNFTModal(nft) {
  document.getElementById("modal-title").textContent = nft.name;
  document.getElementById("modal-description").textContent = nft.description;
  document.getElementById("modal-image").src = convertIPFSToHTTPS(nft.image);

  // عرض الفيديو إن وُجد
  const modalMedia = document.querySelector(".modal-media");
  const existingVideo = modalMedia.querySelector("video");
  if (existingVideo) existingVideo.remove();

  if (nft.animation_url && nft.animation_url.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = convertIPFSToHTTPS(nft.animation_url);
    video.controls = true;
    video.style.marginTop = "1rem";
    video.style.maxWidth = "100%";
    modalMedia.appendChild(video);
  }

  // خصائص NFT
  const attrList = document.getElementById("modal-attributes-list");
  attrList.innerHTML = "";
  (nft.attributes || []).forEach((attr) => {
    const div = document.createElement("div");
    div.className = "attribute";
    div.innerHTML = `<span class="trait-type">${attr.trait_type}</span>: <span class="value">${attr.value}</span>`;
    attrList.appendChild(div);
  });

  // روابط
  document.getElementById("modal-viewer-link").href = nft.external_url || "#";
  document.getElementById("modal-opensea-link").href = `https://opensea.io/assets/matic/${nft.contract_address || '0x...'}?search[query]=${encodeURIComponent(nft.name)}`;

  // زر تحميل metadata
  let downloadBtn = document.getElementById("modal-download-link");
  if (!downloadBtn) {
    downloadBtn = document.createElement("a");
    downloadBtn.id = "modal-download-link";
    downloadBtn.className = "btn btn-secondary";
    downloadBtn.textContent = "Télécharger Metadata";
    document.querySelector(".modal-actions").appendChild(downloadBtn);
  }
  downloadBtn.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nft, null, 2));
  downloadBtn.download = nft.name.replace(/\s+/g, "_") + ".json";

  document.getElementById("nft-modal").classList.add("active");
}

function closeNFTModal() {
  document.getElementById("nft-modal").classList.remove("active");
}

function convertIPFSToHTTPS(url) {
  return url?.startsWith("ipfs://")
    ? url.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
    : url;
}

function setupEventListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      applyFilter(filter);
    });
  });

  document.getElementById("modal-close").addEventListener("click", closeNFTModal);
  document.getElementById("modal-overlay").addEventListener("click", closeNFTModal);
}

function applyFilter(filter) {
  switch (filter) {
    case "45":
      filteredNfts = nftsData.filter((n) => n.attributes?.some((a) => a.value === "45x45"));
      break;
    case "90":
      filteredNfts = nftsData.filter((n) => n.attributes?.some((a) => a.value === "90x90"));
      break;
    case "white":
      filteredNfts = nftsData.filter((n) => n.attributes?.some((a) => a.value === "#ffffff"));
      break;
    case "blue":
      filteredNfts = nftsData.filter((n) => n.attributes?.some((a) => a.value === "#3907ed"));
      break;
    default:
      filteredNfts = nftsData;
  }
  renderNFTs();
}

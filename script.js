let nftsData = [];
let filteredNfts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadNFTs();
  updateTotalNftsCount();
  renderNFTs();
  setupEventListeners();
  setupSmoothScrolling();
  setupLazyLoading();
});

async function loadNFTs() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  const res = await fetch("nfts.json");
  nftsData = await res.json();
  filteredNfts = nftsData;
  loader.style.display = "none";
}

function updateTotalNftsCount() {
  const countElement = document.getElementById("total-nfts");
  const target = nftsData.length;
  let count = 0;
  const interval = setInterval(() => {
    count++;
    countElement.textContent = count;
    if (count === target) clearInterval(interval);
  }, 10);
}

function renderNFTs() {
  const grid = document.getElementById("nft-grid");
  grid.innerHTML = "";

  if (filteredNfts.length === 0) {
    grid.innerHTML = "<p>No NFTs match the selected filter.</p>";
    return;
  }

  filteredNfts.forEach((nft) => {
    const card = createNFTCard(nft);
    grid.appendChild(card);
  });
}

function createNFTCard(nft) {
  const card = document.createElement("div");
  card.className = "nft-card";

  const image = document.createElement("img");
  image.dataset.src = convertIPFSToHTTPS(nft.image);
  image.alt = nft.name;
  image.className = "lazy-image";
  image.onerror = () => {
    image.style.display = "none";
  };

  const name = document.createElement("h3");
  name.textContent = nft.name;

  const description = document.createElement("p");
  description.textContent = nft.description.slice(0, 80) + "...";

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(description);

  card.addEventListener("click", () => openNFTModal(nft));
  return card;
}

function openNFTModal(nft) {
  const modal = document.getElementById("nft-modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = nft.name;

  const image = document.createElement("img");
  image.src = convertIPFSToHTTPS(nft.image);
  image.alt = nft.name;
  image.style.maxWidth = "100%";
  image.style.borderRadius = "8px";

  modalContent.appendChild(title);
  modalContent.appendChild(image);

  // ✅ Show animation video if available
  if (nft.animation_url && nft.animation_url.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = convertIPFSToHTTPS(nft.animation_url);
    video.controls = true;
    video.style.width = "100%";
    video.style.marginTop = "1rem";
    modalContent.appendChild(video);
  }

  const desc = document.createElement("p");
  desc.textContent = nft.description;
  modalContent.appendChild(desc);

  // ✅ Traits
  if (nft.attributes && nft.attributes.length > 0) {
    const traitsList = document.createElement("ul");
    nft.attributes.forEach((attr) => {
      const li = document.createElement("li");
      li.textContent = `${attr.trait_type}: ${attr.value}`;
      traitsList.appendChild(li);
    });
    modalContent.appendChild(traitsList);
  }

  // ✅ External links
  if (nft.external_url) {
    const viewerLink = document.createElement("a");
    viewerLink.href = nft.external_url;
    viewerLink.target = "_blank";
    viewerLink.textContent = "🔬 Open Interactive Viewer";
    viewerLink.style.display = "block";
    viewerLink.style.marginTop = "1rem";
    modalContent.appendChild(viewerLink);
  }

  // ✅ Download Metadata Button
  const metadataBtn = document.createElement("a");
  metadataBtn.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nft, null, 2));
  metadataBtn.download = nft.name.replace(/\s+/g, '_') + '_metadata.json';
  metadataBtn.textContent = '⬇️ Download Metadata';
  metadataBtn.className = 'metadata-download-button';
  metadataBtn.style.display = 'inline-block';
  metadataBtn.style.marginTop = '1rem';
  metadataBtn.style.padding = '0.5rem 1rem';
  metadataBtn.style.background = '#333';
  metadataBtn.style.color = '#fff';
  metadataBtn.style.textDecoration = 'none';
  metadataBtn.style.borderRadius = '6px';

  modalContent.appendChild(metadataBtn);

  modal.style.display = "block";
}

function closeNFTModal() {
  const modal = document.getElementById("nft-modal");
  modal.style.display = "none";
}

function filterNFTs(filterType) {
  switch (filterType) {
    case "all":
      filteredNfts = nftsData;
      break;
    case "45x45":
      filteredNfts = nftsData.filter((nft) => nft.attributes?.some((attr) => attr.value === "45x45"));
      break;
    case "90x90":
      filteredNfts = nftsData.filter((nft) => nft.attributes?.some((attr) => attr.value === "90x90"));
      break;
    case "white":
      filteredNfts = nftsData.filter((nft) => nft.attributes?.some((attr) => attr.value === "#ffffff"));
      break;
    case "blue":
      filteredNfts = nftsData.filter((nft) => nft.attributes?.some((attr) => attr.value === "#3907ed"));
      break;
    default:
      filteredNfts = nftsData;
  }
  renderNFTs();
}

function setupEventListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterNFTs(filter);
    });
  });

  document.getElementById("close-modal").addEventListener("click", closeNFTModal);

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("nft-modal");
    if (event.target === modal) closeNFTModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNFTModal();
  });
}

function convertIPFSToHTTPS(url) {
  if (!url) return "";
  return url.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setupSmoothScrolling() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`nav a[href="#${id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link?.classList.add("active");
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupLazyLoading() {
  const images = document.querySelectorAll("img.lazy-image");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy-image");
        obs.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  images.forEach((img) => observer.observe(img));
}

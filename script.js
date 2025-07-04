fetch("nfts.json")
  .then(res => res.json())
  .then(nfts => {
    const gallery = document.getElementById("gallery");

    nfts.forEach(nft => {
      const card = document.createElement("div");
      card.className = "nft-card";

      card.innerHTML = `
        <a href="viewer.html?id=${nft.id}">
          <img src="${nft.media.preview_gif}" alt="${nft.name}">
          <h3>${nft.name}</h3>
        </a>
      `;

      gallery.appendChild(card);
    });
  });

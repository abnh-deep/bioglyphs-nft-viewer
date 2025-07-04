fetch('nfts.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('nft-gallery');
    data.forEach(nft => {
      const card = document.createElement('div');
      card.className = 'nft-card';
      card.innerHTML = `
        <a href="${nft.external_url}">
          <img src="${nft.image}" alt="${nft.name}">
          <h3>${nft.name}</h3>
        </a>
      `;
      container.appendChild(card);
    });
  });

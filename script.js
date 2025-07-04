fetch('nfts.json')
  .then(res => res.json())
  .then(nfts => {
    const gallery = document.getElementById('gallery');
    nfts.forEach(nft => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <a href="viewer.html?id=${nft.id}" target="_blank">
          <img src="${nft.media.preview_gif}" alt="${nft.name}">
          <h2>${nft.name}</h2>
        </a>
      `;
      gallery.appendChild(card);
    });
  });

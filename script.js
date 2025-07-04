// Global variables
let nftsData = [];
let filteredNfts = [];
let currentFilter = 'all';

// DOM elements
const nftGrid = document.getElementById('nft-grid');
const loading = document.getElementById('loading');
const totalNftsElement = document.getElementById('total-nfts');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('nft-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadNFTs();
    setupEventListeners();
    setupSmoothScrolling();
});

// Load NFTs from JSON file
async function loadNFTs() {
    try {
        showLoading(true);
        const response = await fetch('nfts.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        nftsData = await response.json();
        filteredNfts = [...nftsData];
        
        updateTotalNftsCount();
        renderNFTs();
        showLoading(false);
        
    } catch (error) {
        console.error('Erreur lors du chargement des NFTs:', error);
        showError('Erreur lors du chargement des NFTs. Veuillez réessayer plus tard.');
        showLoading(false);
    }
}

// Show/hide loading indicator
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    nftGrid.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

// Update total NFTs count
function updateTotalNftsCount() {
    if (totalNftsElement) {
        animateNumber(totalNftsElement, 0, nftsData.length, 1000);
    }
}

// Animate number counter
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Render NFTs in the grid
function renderNFTs() {
    if (filteredNfts.length === 0) {
        nftGrid.innerHTML = `
            <div class="no-results">
                <p>Aucun NFT trouvé pour ce filtre.</p>
            </div>
        `;
        return;
    }
    
    nftGrid.innerHTML = '';
    
    filteredNfts.forEach(nft => {
        const nftCard = createNFTCard(nft);
        nftGrid.appendChild(nftCard);
    });
}

// Create NFT card element
function createNFTCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    card.setAttribute('data-nft-id', nft.id);
    
    // Extract key attributes for display
    const gridSize = nft.attributes.find(attr => attr.trait_type === 'Grid Size')?.value || 'N/A';
    const baseColor = nft.attributes.find(attr => attr.trait_type === 'Base Color')?.value || '#ffffff';
    
    card.innerHTML = `
        <div class="nft-media">
            <img src="${nft.preview_gif}" alt="${nft.name}" class="nft-image" loading="lazy">
        </div>
        <div class="nft-info">
            <h3 class="nft-title">${nft.name}</h3>
            <p class="nft-description">${truncateText(nft.description, 100)}</p>
            <div class="nft-attributes">
                <span class="attribute-tag">Grille ${gridSize}x${gridSize}</span>
                <span class="attribute-tag" style="color: ${baseColor};">Base ${baseColor}</span>
            </div>
        </div>
    `;
    
    // Add click event to open modal
    card.addEventListener('click', () => openNFTModal(nft));
    
    return card;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Open NFT detail modal
function openNFTModal(nft) {
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalImage = document.getElementById('modal-image');
    const modalAttributesList = document.getElementById('modal-attributes-list');
    const modalViewerLink = document.getElementById('modal-viewer-link');
    const modalOpenseaLink = document.getElementById('modal-opensea-link');
    
    // Populate modal content
    modalTitle.textContent = nft.name;
    modalDescription.textContent = nft.description;
    modalImage.src = nft.preview_gif;
    modalImage.alt = nft.name;
    
    // Populate attributes
    modalAttributesList.innerHTML = '';
    nft.attributes.forEach(attr => {
        const attributeItem = document.createElement('div');
        attributeItem.className = 'attribute-item';
        attributeItem.innerHTML = `
            <div class="attribute-type">${attr.trait_type}</div>
            <div class="attribute-value">${attr.value}</div>
        `;
        modalAttributesList.appendChild(attributeItem);
    });
    
    // Set links
    modalViewerLink.href = nft.viewer_html;
    modalOpenseaLink.href = nft.opensea_url || '#';
    
    // Disable OpenSea link if URL is empty
    if (!nft.opensea_url) {
        modalOpenseaLink.style.opacity = '0.5';
        modalOpenseaLink.style.pointerEvents = 'none';
        modalOpenseaLink.textContent = 'Bientôt disponible';
    } else {
        modalOpenseaLink.style.opacity = '1';
        modalOpenseaLink.style.pointerEvents = 'auto';
        modalOpenseaLink.textContent = 'Acheter sur OpenSea';
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close NFT modal
function closeNFTModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Filter NFTs based on criteria
function filterNFTs(filterType) {
    currentFilter = filterType;
    
    switch (filterType) {
        case 'all':
            filteredNfts = [...nftsData];
            break;
        case '45':
            filteredNfts = nftsData.filter(nft => {
                const gridSize = nft.attributes.find(attr => attr.trait_type === 'Grid Size')?.value;
                return gridSize === 45;
            });
            break;
        case '90':
            filteredNfts = nftsData.filter(nft => {
                const gridSize = nft.attributes.find(attr => attr.trait_type === 'Grid Size')?.value;
                return gridSize === 90;
            });
            break;
        case 'white':
            filteredNfts = nftsData.filter(nft => {
                const baseColor = nft.attributes.find(attr => attr.trait_type === 'Base Color')?.value;
                return baseColor === '#ffffff';
            });
            break;
        case 'blue':
            filteredNfts = nftsData.filter(nft => {
                const baseColor = nft.attributes.find(attr => attr.trait_type === 'Base Color')?.value;
                return baseColor === '#3907ed';
            });
            break;
        default:
            filteredNfts = [...nftsData];
    }
    
    renderNFTs();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Apply filter
            const filterType = button.getAttribute('data-filter');
            filterNFTs(filterType);
        });
    });
    
    // Modal close events
    modalClose.addEventListener('click', closeNFTModal);
    modalOverlay.addEventListener('click', closeNFTModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeNFTModal();
        }
    });
    
    // Navigation smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
    // Intersection Observer for navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                // Update active navigation link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Lazy loading for images (additional optimization)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Error handling for failed image loads
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Failed to load image:', e.target.src);
    }
}, true);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential external use
window.BioglyphsApp = {
    loadNFTs,
    filterNFTs,
    openNFTModal,
    closeNFTModal
};


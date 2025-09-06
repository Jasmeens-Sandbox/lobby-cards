function arrowScroll() {
    document.getElementById('gallery-container').scrollIntoView({ behavior: 'smooth' });
}

async function generateImagesForYear(year, count = 20) {
    const images = [];
    const response = await fetch(`https://api.collection.nfsa.gov.au/search?forms=Lobby%20card&year=${year}-${year + 9}&hasMedia=yes`);
    let data = await response.json();
    data = data.results;
    var baseUrl = "https://media.nfsacollection.net/";

    for (let i = 0; i < count; i++) {
        var item = data[Math.floor(Math.random() * data.length)];
        var filePath = item.preview[0].filePath;
        images.push({
            src: `${baseUrl}${filePath}`,
            alt: `Image ${i + 1} for ${year}`,
            width: 220,
            height: 220
        });
    }
    return images;
}

async function renderGallery(year) {
    const gallery = document.getElementById('gallery-container');
    gallery.innerHTML = '';
    const images = await generateImagesForYear(year);
    const grid = document.createElement('div');
    grid.className = 'gallery-grid';
    images.forEach(img => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        const image = document.createElement('img');
        image.src = img.src;
        image.alt = img.alt;
        image.width = img.width;
        image.height = img.height;
        image.classList.add('fade-in');
        image.onload = () => {
            image.classList.add('loaded');
        };
        card.appendChild(image);
        grid.appendChild(card);
    });
    gallery.appendChild(grid);
}

renderGallery(1920);
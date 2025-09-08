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

function createTimeline(startYear, endYear, onYearClick) {
    const timeline = document.createElement('ul');
    timeline.className = 'timeline';
    for (let year = startYear; year <= endYear; year += 10) {
        const longBar = document.createElement('li');
        longBar.className = 'long-bar';
        const label = document.createElement('a');
        label.className = 'year-label';
        label.textContent = year;
        label.href = '#year-' + year;
        label.style.textDecoration = 'none';
        document.querySelector('#gallery-title').textContent = year;
        label.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('#gallery-title').textContent = year;
            document.querySelectorAll('.year-label.active').forEach(function (el) {
                el.classList.remove('active');
            });
            label.classList.add('active');
            if (typeof onYearClick === 'function') {
                onYearClick(year);
            }
        });

        if (year === startYear) {
            label.classList.add('active');
        }

        longBar.appendChild(label);
        timeline.appendChild(longBar);
        // 9 short bars (except after last decade)
        if (year + 10 <= endYear) {
            for (let i = 1; i <= 9; i++) {
                const shortBar = document.createElement('li');
                shortBar.className = 'short-bar';
                timeline.appendChild(shortBar);
            }
        }
    }
    return timeline;
}

// Initial render
const startYear = 1920;
const endYear = 1980;
const container = document.getElementById('timeline-container');
container.appendChild(createTimeline(startYear, endYear, renderGallery));
// Set initial gallery view
renderGallery(startYear);
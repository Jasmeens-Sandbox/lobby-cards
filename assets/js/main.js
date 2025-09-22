// API functionality
(function (api) {

    // Main function to get movies by year
    async function getMoviesByYear(year) {

        const movieList = [];
        const totalLimit = 8;

        const primaryMovies = await getLobbyCardsNFSA(year);
        const primaryGroups = Object.groupBy(primaryMovies, x => x.title);
        const primaryResults = await processGroup(primaryGroups, totalLimit);
        movieList.push(...primaryResults);

        // If not enough movies, fetch fallback movies without media and with OMDB data
        if (movieList.length < totalLimit) {
            const moviesLeft = totalLimit - movieList.length;
            const fallbackMovies = (await getLobbyCardsNFSA(year, false));
            const fallbackGroups = Object.groupBy(fallbackMovies, x => x.title);
            const fallbackResults = await processGroup(fallbackGroups, moviesLeft, true);

            movieList.push(...fallbackResults);
        }

        return movieList;
    }

    // Function to fetch lobby cards from NFSA API
    async function getLobbyCardsNFSA(year, hasMedia = true) {

        let cachedResults = [];
        let currentPage = 1;
        const limit = 25;
        const totalLimit = 150;

        const baseUrl = "https://api.collection.nfsa.gov.au/search?";

        const startYear = year - 10;
        const endYear = year - 1;
        const yearQuery = `${startYear}-${endYear}`;
        const hasMediaQuery = hasMedia ? "yes" : "no";

        while (true) {
            try {

                if (cachedResults.length >= totalLimit) {
                    break;
                }

                const queryParams = new URLSearchParams({
                    forms: "Lobby card",
                    hasMedia: hasMediaQuery,
                    page: currentPage,
                    limit: limit,
                    year: yearQuery
                });

                const url = `${baseUrl}${queryParams.toString()}`;
                const res = await fetch(url);
                const jsonData = await res.json();
                cachedResults = cachedResults.concat(jsonData?.results);
                currentPage++;

                if (jsonData?.results?.length < limit) {
                    break;
                }

            } catch (error) {
                break;
            }
        }

        return cachedResults;
    }

    // Helper function to process groups of movies
    async function processGroup(group, totalLimit, useOmdb = false) {
        const results = [];

        for (const [titleRaw, items] of Object.entries(group)) {
            if (results.length >= totalLimit) break;
            const sortedItems = items.sort((a, b) => (b.summary?.length || 0) - (a.summary?.length || 0));
            const item = sortedItems[0];
            const title = titleRaw.replace(/^\[([^:]+)\s*:.*\]$/, '$1').trim();
            let summary = item.summary || "No description available.";
            const itemYear = item.productionDates?.[0]?.fromYear || "N/A";

            const omdb = useOmdb && await getDataFromOmdb(title, itemYear);
            let imageUrl = useOmdb ? omdb.poster : getImageUrl(item);

            if (!imageUrl) continue;

            if (useOmdb) {
                try {
                    //summary = omdb.plot;
                    const response = await fetch(imageUrl);
                    if (response.status === 404) continue;
                } catch {
                    continue;
                }
            }

            results.push({
                title,
                item: item,
                imageUrl,
                summary,
                year: itemYear,
                src: useOmdb ? "omdb" : "nfsa"
            });
        }

        return results;
    }

    // Helper function to get image URL from NFSA item
    function getImageUrl(item) {
        const baseurl = "https://media.nfsacollection.net/";
        const imgArr = item.preview || [];
        let imgurl = "";

        for (let i = 0; i < imgArr.length; i++) {
            if (imgArr[i].hasOwnProperty("filePath")) {
                imgurl = baseurl + imgArr[i].filePath;
                break;
            }
        }
        return imgurl;
    }

    // Helper function to fetch data from OMDB
    async function getDataFromOmdb(title, year) {

        try {
            const imgUrl = `http://www.omdbapi.com/?&apikey=85b97b19&t=${encodeURIComponent(title)}&y=${encodeURIComponent(year)}&plot=full`;
            const response = await fetch(imgUrl);
            const data = await response.json();
            return {
                poster: data.Poster || "",
                plot: data.Plot || ""
            };
        } catch (error) {
            return {
                poster: "",
                plot: ""
            };
        }
    }

    // expose functions to the global api object
    api.getMoviesByYear = getMoviesByYear;

})(window.api = window.api || {});

// Main application functionality
(function App() {

    // Define start and end years
    const startYear = 1930;
    const endYear = 1990;

    // Initialize global app state
    window.app = {
        state: {
            previousActiveYear: null,
            moviesByYear: {}
        }
    };

    
    // Initialize on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {

        // Scroll down arrow event
        const scrollArrow = document.getElementById('scroll-down-arrow');
        scrollArrow?.addEventListener('click', () => document.getElementById('gallery-title')
            .scrollIntoView({ behavior: 'smooth' }));

        // Create timeline and attach to DOM
        const timeline = createTimeline(startYear, endYear, onYearClick);
        const container = document.getElementById('timeline-container');
        container?.appendChild(timeline);
        // Initial gallery render
        onYearClick(startYear);

        // Set initial viewport height CSS variable
        function updateVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        // Add resize event for updating --vh
        window.addEventListener('resize', updateVH);
        updateVH();

    });

    // Function to create the timeline
    function createTimeline(startYear, endYear, onYearClick) {

        const timelineContainer = document.getElementById('timeline-container');
        if (!timelineContainer) return null;

        const timeline = document.createElement('ul');
        timeline.className = 'timeline';

        for (let year = startYear; year <= endYear; year += 10) {

            const galleryTitle = document.getElementById('gallery-title');
            galleryTitle.textContent = `Lobby Cards: ${startYear - 9}-${startYear}`;

            const longBar = document.createElement('li');
            longBar.className = 'timeline__long-bar';
            const link = document.createElement('a');
            link.className = 'timeline__year-label';
            link.textContent = year;
            link.href = '#year-' + year;

            // Add to timeline menu
            const timelineMenu = document.getElementById('timeline-list');
            const listItem = document.createElement('li');
            listItem.className = 'timeline-menu__item';
            const link2 = document.createElement('a');
            link2.className = 'timeline-menu__link';
            link2.textContent = year;
            link2.href = '#year-' + year;
            listItem.appendChild(link2);
            timelineMenu.appendChild(listItem);

            // Combined click handler for both links
            function handleYearClick(e, year, link, link2) {
                e.preventDefault();

                const galleryTitle = document.getElementById('gallery-title');
                galleryTitle.textContent = `Lobby Cards: ${year - 9}-${year}`;

                // Save previous active year
                const activeYear = document.querySelector('.timeline__year-label.active, .timeline-menu__item .active');
                app.state.previousActiveYear = activeYear ? parseInt(activeYear.textContent) : null;

                // Clear all active states
                document.querySelectorAll('.timeline__year-label.active, .timeline-menu__item .active')
                    .forEach(el => el.classList.remove('active'));

                // Activate both links
                link.classList.add('active');
                link2.classList.add('active');

                if (typeof onYearClick === 'function') {
                    onYearClick(year);
                }

                //Hide toggle menu
                if (e.target === link2) showHide();
            }

            link.addEventListener('click', (e) => handleYearClick(e, year, link, link2));
            link2.addEventListener('click', (e) => handleYearClick(e, year, link, link2));


            if (year === startYear) {
                link.classList.add('active');
                link2.classList.add('active');
            }

            longBar.appendChild(link);
            timeline.appendChild(longBar);

            // 9 short bars (except after last decade)
            if (year < endYear) {
                for (let i = 1; i <= 9; i++) {
                    const shortBar = document.createElement('li');
                    shortBar.className = 'timeline__short-bar';

                    if (i < 5) {
                        shortBar.classList.add('timeline__short-bar-hide');
                    }

                    timeline.appendChild(shortBar);
                }
            }
        }
        return timeline;
    }

    // Function to render the gallery
    function renderGallery(movies, year) {
        const gallery = document.getElementById('gallery');

        movies.forEach(movie => {

            let wrapper = document.createElement("div");
            wrapper.classList.add("gallery__lobby-card");

            let animationFade = getAnimationClass(app.state.previousActiveYear, year);

            wrapper.classList.add("animate", animationFade);
            let template = `
            <h3 class="gallery__lobby-card-title">${movie.title}</h3>
            <img class="gallery__lobby-card-img animate ${animationFade}" id="${movie.item.id}" src="${movie.imageUrl}" />`;
            wrapper.innerHTML = template;

            wrapper.querySelector('img').addEventListener('click', function () {
                //Modal code will go here
            });

            gallery.appendChild(wrapper);

            // When fade-in animation ends, remove classes to allow re-animation
            wrapper.querySelector('img').addEventListener('animationend', (e) => {
                e.target.classList.remove("animate", "fadeInRight", "fadeInLeft");
            });
        });

        function getAnimationClass(prevYear, currentYear) {
            if (!prevYear) return "fadeInRight";
            return prevYear < currentYear ? "fadeInRight" : "fadeInLeft";
        }
    }

    // Handler for year click
    async function onYearClick(year) {

        if (app.state.previousActiveYear === year) {
            return;
        }

        if (app.state.previousActiveYear && (year == 1930 || year == 1950 || year == 1990)) {
            const loader = document.getElementById('loader');
            loader.style.display = 'block';
        }

        document.getElementById('gallery').innerHTML = '';

        app.state.moviesByYear[year] = app.state.moviesByYear[year] || await api.getMoviesByYear(year);
        const movies = app.state.moviesByYear[year];
        renderGallery(movies, year);

        if (loader)
            loader.style.display = 'none';

        // Scroll to top of gallery
        if (app.state.previousActiveYear)
            document.getElementById('gallery-title')
                .scrollIntoView({ behavior: 'smooth' });
    }

    // Timeline menu toggle functionality
    function showHide(event) {
        // Toggle hamburger icon animation
        document.getElementById("timeline-button")
            .classList.toggle("change");

        // Toggle menu visibility
        const menu = document.getElementById("timeline-menu");
        menu.classList.toggle("timeline-menu--active");

        // Prevent click event from bubbling up
        event.stopPropagation();
    }

    document.getElementById("timeline-button")
        .addEventListener("click", showHide);

    //Hide menu when clicking anywhere else on the page
    document.addEventListener("click", function (event) {
        const menu = document.getElementById("timeline-menu");
        const button = document.getElementById("timeline-button");

        // Check if click was outside the menu and button
        if (!menu.contains(event.target) && !button.contains(event.target)) {
            // Remove active classes
            menu.classList.remove("timeline-menu--active");
            button.classList.remove("change");
        }
    });
})();
# Australian Lobby Cards – Project Rationale

## Student ID: U3270100

## Rationale

The goal of the project was to create a web application that creates an engaging digital interface for exploring the collections of the National Film and Sound Archive of Australia (NFSA). At the moment, the NFSA site heavily relies on keyword searches, which makes it difficult for users to browse and locate artifacts. To address this issue, I designed a timeline-based interface where users can browse lobby cards from the 1920s to the 1990s in chronological order. The timeline approach lets user visualise the cultural evolution of film promotion in one glance year by year and eliminating the need for keyword search.

## Design Process

I wanted the Lobby cards site to be visually engaging, clean and simple at the same time. To achieve this, I designed my site with a dark theme and simple colour palette of black, white, grey, and yellow. The dark background helped the images stand out and also referenced the look of old movie theatres. I also added a parallax hero section on the landing page to immediately capture user attention and showcase the intent of the website. During the peer review and feedback session other students confirmed that having a parallax hero section as a landing page was a strong design choice. 

## Development Process

Technically I learned a lot during the build process of this website. I used HTML, CSS, and JavaScript to build the site and the NFSA API to fetch lobby card images and film metadata. I also experimented with the OMDb API to add missing film data like movie posters where the NFSA API lacked media assets. JavaScript DOM manipulation was the main technique, I used to build the timeline and render content dynamically. I also learned more advanced techniques like async/await for handling API calls and the spread operator for array manipulation.
One of the biggest challenges was responsive design of the site. Layouts that looked clean on desktop often became cluttered on mobile. To ensure the interface was responsive across devices, I refined my use of Flexbox, media queries through extensive trial and error. By testing on different devices and fine tuning, I was able to make the design responsive across different screen sizes. 

## Peer Feedback and Iteration

I found the peer review sessions during the tutorials were really valuable. After looking at my website one student suggested reducing the number of images displayed per section because I was showing too many images at once that felt overwhelming. I implemented a limit of eight images per decade which made the layout much cleaner. Another suggestion was to raise the timeline slightly from the bottom of the screen, which improved readability and made it more visible.
I also improved the modal popup based on feedback. At first, some of the images left empty space in the modal because of their small sizes. To fix this, I layered the same image on top of each other and the background version of the image was stretched and blurred to cover the space, and the original image was centred aligned on top of the blurred background. This gave my modal more polished and consistent look despite the size of the image.

## Reflection

This project helped me develop confidence in working with APIs, asynchronous JavaScript, and DOM manipulation. I also gained practical experience in responsive design, which was one of my biggest challenges at the start. The process of incorporating peer review and feedback into my website was very important and helped me with simple and clean design.
If I had more time, I would add advanced filtering options, like sorting by film genre and also invest more time in accessibility testing. Overall, I feel I achieved my goal of creating a site that is engaging, informative, and user-friendly, I also learning a lot of new technical and design skills with this assignment.

## Live Website

[🌐 View Live Site Here](https://jasmeens-sandbox.github.io/lobby-cards/)

## Use of Generative AI

I used generative AI tools (ChatGPT) during the planning and refine documentation and to get feedback on best practices. All code was written and tested manually. 


## Annotated Resources

- BEM. (n.d.). Quick start. BEM methodology. Retrieved September 01, 2025, from  
  [https://en.bem.info/methodology/quick-start/](https://en.bem.info/methodology/quick-start/)

- GIPHY. (n.d.). Parallax text effect gif  Retrieved September 04, 2025, from [https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDFuN243azFjcGo5eWtobTFrY2JhZ3B0YmUyZXBwajZla3hvazhlYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JdWDiqHJ0iKMRiM/giphy.gif](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDFuN243azFjcGo5eWtobTFrY2JhZ3B0YmUyZXBwajZla3hvazhlYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JdWDiqHJ0iKMRiM/giphy.gif)

- MDN Web Docs. (n.d.). CSS Grid Layout. [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

- W3Schools. (n.d.-a). How To Create a Parallax Scrolling Website. [https://www.w3schools.com/howto/howto_css_parallax.asp](https://www.w3schools.com/howto/howto_css_parallax.asp)

- W3Schools. (n.d.-b). How To Create a Loader / Spinner. [https://www.w3schools.com/howto/howto_css_loader.asp](https://www.w3schools.com/howto/howto_css_loader.asp)
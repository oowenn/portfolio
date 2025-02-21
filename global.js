console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
};

let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: 'resume/index.html', title: 'CV' },
    { url: 'meta/index.html', title: 'Meta' },
    { url: 'https://github.com/oowenn/portfolio', title: 'GitHub' }
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);
const ARE_WE_HOME = document.documentElement.classList.contains('home');


for (let p of pages) {
    let url = p.url;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
      }

    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host !== location.host) {
        a.target = '_blank';
    }
    nav.append(a);
};

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`
);

const select = document.querySelector('select');
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
    console.log(event.target.value, 'saved to localStorage');
});

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    console.log('Theme applied:', colorScheme);}

const savedColorScheme = localStorage.colorScheme;
if (savedColorScheme) {
    setColorScheme(savedColorScheme);
    select.value = savedColorScheme;
};


export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
};

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';

    project.forEach(project => {
        const article = document.createElement('article');
        article.innerHTML = `
            ${
                project.url 
                ? `<a href="${project.url}" target="_blank"><${headingLevel}>${project.title} (${project.year})</${headingLevel}></a>` 
                : `<${headingLevel}>${project.title} (${project.year})</${headingLevel}>`
            }        
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <p>${project.description}</p>
        `;

        // article.innerHTML = `
        //     <${headingLevel}>${project.title} (${project.year})</${headingLevel}>
        //     <img src="${project.image}" alt="${project.title}" class="project-image">
        //     <p>${project.description}</p>
        //     `;
        containerElement.appendChild(article);
    });
};

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '../home/home.html', title: 'Home' },
    { url: '../projects/projects.html', title: 'Projects' },
    { url: '../contact/contact.html', title: 'Contact' },
    { url: '../CV/cv.html', title: 'CV' },
    { url: 'https://github.com/oowenn/portfolio', title: 'GitHub' }
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
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
}

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
}

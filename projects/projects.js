import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');

if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
}

let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    let newData = newRolledData.map(([year, count]) => {
        return  { value: count, label: year };
    });
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    let selectedIndex = -1;
    let svg = d3.select('svg');
    let legend = d3.select('.legend');
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // clear up the previous chart and legend
    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

    //  render the new chart and legend    
    newArcs.forEach((arc, idx) => {
        svg
          .append('path')
          .attr('d', arc)
          .attr('fill', colors(idx))
          .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            // console.log('selected index:', selectedIndex);

            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
              } else {
                let selectedYear = newData[selectedIndex].label;
                let filteredProjects = projectsGiven.filter(
                    (project) => project.year === selectedYear
                );
                renderProjects(filteredProjects, projectsContainer, 'h2');
            }

            svg
                .selectAll('path')
                .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected' : ''
                ));
            legend
                .selectAll('li')
                .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected' : ''
                ));
            
        });
    });

    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

}


renderPieChart(projects);


let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    // update query value
    query = event.target.value;
    // filter projects
    let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // render filtered projects
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

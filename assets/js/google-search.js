document.addEventListener('DOMContentLoaded', function() {
    // Configuración del tema
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('.material-icons');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        icon.textContent = 'light_mode';
    } else {
        document.body.classList.remove('dark-mode');
        icon.textContent = 'dark_mode';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.textContent = 'dark_mode';
            localStorage.setItem('theme', 'light');
        }
    });

    // Base de datos de búsqueda mejorada
    const searchDatabase = {
        'proyectos': {url: 'projects/index.html', suggestions: ['ver proyectos', 'mis trabajos', 'portafolio']},
        'cerveza': {
            url: 'projects/cerveza-huaytapallana.html', 
            suggestions: ['huaytapallana', 'cerveza artesanal', 'proyecto cervecero', 'wordpress']
        },
        'huaytapallana': {url: 'projects/cerveza-huaytapallana.html', suggestions: ['cerveza', 'artesanal', 'perú']},
        'artista': {url: 'projects/portafolio-artista.html', suggestions: ['diseño', 'galería', 'creative']},
        'clima': {url: 'projects/clima-app.html', suggestions: ['tiempo', 'meteorológico', 'api']},
        'contacto': {url: 'contact.html', suggestions: ['email', 'formulario', 'escríbeme']},
        'sobre mi': {url: 'about.html', suggestions: ['biografía', 'habilidades', 'experiencia']},
        'inicio': {url: 'index.html', suggestions: ['principal', 'home', 'buscar']}
    };

    // Elementos del DOM
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'suggestions-box';
    searchInput.parentNode.appendChild(suggestionsBox);

    // Mostrar sugerencias
    function showSuggestions() {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsBox.innerHTML = '';
        
        if (query.length > 0) {
            // Coincidencias exactas primero
            const exactMatches = Object.entries(searchDatabase)
                .filter(([keyword, data]) => keyword.includes(query));
            
            // Coincidencias en sugerencias
            const suggestionMatches = Object.entries(searchDatabase)
                .filter(([_, data]) => data.suggestions.some(s => s.includes(query)));
            
            const allMatches = [...exactMatches, ...suggestionMatches];
            const uniqueMatches = [...new Map(allMatches.map(item => [item[0], item])).values()];
            
            if (uniqueMatches.length > 0) {
                uniqueMatches.slice(0, 5).forEach(([keyword, data]) => {
                    const suggestion = document.createElement('div');
                    suggestion.className = 'suggestion-item';
                    suggestion.innerHTML = `
                        <span class="material-icons">search</span>
                        <div>
                            <strong>${keyword}</strong>
                            <small>${data.suggestions.slice(0, 2).join(', ')}</small>
                        </div>
                    `;
                    suggestion.addEventListener('click', () => {
                        searchInput.value = keyword;
                        performSearch();
                    });
                    suggestionsBox.appendChild(suggestion);
                });
                suggestionsBox.style.display = 'block';
            }
        } else {
            suggestionsBox.style.display = 'none';
        }
    }

    // Función de búsqueda mejorada
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsBox.style.display = 'none';
        
        // Buscar coincidencia exacta
        if (searchDatabase[query]) {
            window.location.href = searchDatabase[query].url;
            return;
        }
        
        // Buscar en keywords y sugerencias
        for (const [keyword, data] of Object.entries(searchDatabase)) {
            if (query.includes(keyword) || data.suggestions.some(s => query.includes(s))) {
                window.location.href = data.url;
                return;
            }
        }
        
        // Redirigir a proyectos con término de búsqueda
        window.location.href = `projects/index.html?search=${encodeURIComponent(query)}`;
    }
    
    // Event listeners
    searchInput.addEventListener('input', showSuggestions);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    searchButton.addEventListener('click', performSearch);
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });

    // Función "Voy a tener suerte"
    document.querySelector('.lucky-button').addEventListener('click', function() {
        const projects = Object.entries(searchDatabase)
            .filter(([_, data]) => data.url.includes('projects/'))
            .map(([_, data]) => data.url);
        const randomProject = projects[Math.floor(Math.random() * projects.length)];
        window.location.href = randomProject;
    });
});
// Base de datos de proyectos
const projectsDatabase = [
    {
        id: 1,
        title: "Cerveza Huaytapallana",
        description: "Sitio web oficial para marca de cerveza artesanal peruana",
        url: "projects/cerveza-huaytapallana.html",
        image: "assets/img/huaytapallana-thumb.jpg",
        tags: ["wordpress", "ecommerce", "diseño"]
    },
    {
        id: 2,
        title: "Portafolio Artista",
        description: "Galería interactiva para artista visual profesional",
        url: "projects/portafolio-artista.html",
        image: "assets/img/artista-thumb.jpg",
        tags: ["react", "diseño", "galería"]
    },
    {
        id: 3,
        title: "App Climática",
        description: "Aplicación de pronóstico del tiempo con geolocalización",
        url: "projects/clima-app.html",
        image: "assets/img/clima-thumb.jpg",
        tags: ["javascript", "api", "weather"]
    }
];

// Elementos del DOM
const diceButton = document.getElementById('random-dice');
const diceModal = document.getElementById('dice-modal');
const diceResult = document.getElementById('dice-result');
const visitButton = document.getElementById('visit-project');
const closeModal = document.querySelector('.close-modal');

// Variable para guardar el proyecto seleccionado
let selectedProject = null;

// Función para tirar el dado
diceButton.addEventListener('click', function() {
    // Activar animación
    this.classList.add('rolling');
    diceButton.disabled = true;
    
    // Mostrar mensaje de carga
    diceResult.innerHTML = '<p>Tirando el dado...</p>';
    diceModal.style.display = 'block';
    
    // Simular tiempo de "lanzamiento" (1.5 segundos)
    setTimeout(() => {
        // Seleccionar proyecto aleatorio
        const randomIndex = Math.floor(Math.random() * projectsDatabase.length);
        selectedProject = projectsDatabase[randomIndex];
        
        // Detener animación
        diceButton.classList.remove('rolling');
        diceButton.disabled = false;
        
        // Mostrar resultado
        showProjectResult(selectedProject);
    }, 1500);
});

// Función para mostrar el resultado
function showProjectResult(project) {
    diceResult.innerHTML = `
        <h4>${project.title}</h4>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
        <div class="project-tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    visitButton.onclick = function() {
        window.location.href = project.url;
    };
}

// Cerrar modal
closeModal.addEventListener('click', function() {
    diceModal.style.display = 'none';
});

// Cerrar al hacer clic fuera del modal
window.addEventListener('click', function(event) {
    if (event.target === diceModal) {
        diceModal.style.display = 'none';
    }
});

// Efecto de confeti al ganar (opcional)
function showConfetti() {
    const confettiCount = 100;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1001';
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-10px';
        
        // Animación personalizada para cada confeti
        const animation = document.createElement('style');
        animation.innerHTML = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                    left: ${Math.random() * 100}%;
                }
            }
        `;
        confetti.appendChild(animation);
        container.appendChild(confetti);
    }
    
    document.body.appendChild(container);
    
    // Eliminar después de la animación
    setTimeout(() => {
        container.remove();
    }, 5000);
}

function getRandomColor() {
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8A2BE2'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Autocompletado inteligente con búsqueda difusa
function fuzzySearch(query, projects) {
    return projects.filter(project => {
        const searchString = `${project.title} ${project.tags.join(' ')}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
    });
}

// Integración con GitHub API
async function loadGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/Ameteratzu/repos');
        const repos = await response.json();
        
        const githubProjects = repos.map(repo => ({
            title: repo.name,
            description: repo.description,
            url: repo.html_url,
            tags: repo.topics || [],
            language: repo.language
        }));
        
        // Añadir a la base de datos de búsqueda
        searchDatabase = [...searchDatabase, ...githubProjects];
    } catch (error) {
        console.error('Error cargando proyectos de GitHub:', error);
    }
}

// Búsqueda por tags
function searchByTags(tags) {
    return searchDatabase.filter(project => 
        tags.every(tag => project.tags.includes(tag))
    );
}

// Historial de búsquedas
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function updateSearchHistory(query) {
    searchHistory.unshift(query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 5)));
}

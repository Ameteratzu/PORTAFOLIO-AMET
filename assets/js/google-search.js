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
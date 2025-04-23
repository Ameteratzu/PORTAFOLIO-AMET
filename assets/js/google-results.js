document.addEventListener('DOMContentLoaded', function() {
    // Toggle de tema oscuro/claro
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('.material-icons');
    
    // Comprobar preferencias del sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Comprobar almacenamiento local
    const currentTheme = localStorage.getItem('theme');
    
    // Aplicar tema guardado o preferencia del sistema
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        icon.textContent = 'light_mode';
    } else {
        document.body.classList.remove('dark-mode');
        icon.textContent = 'dark_mode';
    }
    
    // Alternar tema manualmente
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
    
    // Filtrado de proyectos
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar active al botón clickeado
            button.classList.add('active');
            
            const filter = button.textContent.toLowerCase();
            
            // Filtrar proyectos
            projectCards.forEach(card => {
                if (filter === 'todos') {
                    card.style.display = 'block';
                } else {
                    const badges = card.querySelectorAll('.badge');
                    let hasMatch = false;
                    
                    badges.forEach(badge => {
                        if (badge.textContent.toLowerCase().includes(filter)) {
                            hasMatch = true;
                        }
                    });
                    
                    card.style.display = hasMatch ? 'block' : 'none';
                }
            });
        });
    });
    
    // Búsqueda en tiempo real
    const searchInput = document.querySelector('.search-projects input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Cerrar búsqueda
    const closeIcon = document.querySelector('.close-icon');
    const searchInputResults = document.querySelector('.search-input-results');
    
    closeIcon.addEventListener('click', () => {
        searchInputResults.value = '';
        projectCards.forEach(card => card.style.display = 'block');
        filterButtons[0].click(); // Activar filtro "Todos"
    });

    
});
document.addEventListener('DOMContentLoaded', function() {
    // Configuración del tema (igual que en google-search.js)
    
    // Función para filtrar proyectos
    function filterProjects() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const projectCards = document.querySelectorAll('.project-result');
            let hasResults = false;
            
            projectCards.forEach(card => {
                const title = card.querySelector('.project-title').textContent.toLowerCase();
                const description = card.querySelector('.project-description').textContent.toLowerCase();
                const keywords = card.getAttribute('data-keywords').toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tech-badge span')).map(span => span.textContent.toLowerCase());
                
                const matches = title.includes(query) || 
                              description.includes(query) || 
                              keywords.includes(query) ||
                              tags.some(tag => tag.includes(query));
                
                card.style.display = matches ? 'block' : 'none';
                if (matches) hasResults = true;
            });
            
            // Actualizar mensaje de resultados
            const resultsInfo = document.querySelector('.results-info');
            if (resultsInfo) {
                resultsInfo.innerHTML = hasResults ? 
                    `<p class="results-stats">Resultados para: "${searchQuery}"</p>
                     <div class="related-searches">
                        <p>Búsquedas relacionadas:</p>
                        <div class="related-tags">
                            ${getRelatedTags(searchQuery)}
                        </div>
                     </div>` :
                    `<p class="results-stats">No se encontraron resultados para: "${searchQuery}"</p>
                     <div class="suggested-searches">
                        <p>Prueba con:</p>
                        <div class="related-tags">
                            <a href="?search=cerveza">cerveza</a>
                            <a href="?search=wordpress">wordpress</a>
                            <a href="?search=proyectos">proyectos</a>
                        </div>
                        <a href="../index.html" class="back-button">Volver al inicio</a>
                     </div>`;
            }
        }
    }
    
    // Generar tags relacionados
    function getRelatedTags(query) {
        const relatedTags = {
            'cerveza': ['artesanal', 'huaytapallana', 'wordpress', 'perú'],
            'wordpress': ['cms', 'blog', 'cerveza'],
            'diseño': ['ui', 'ux', 'creative'],
            'react': ['javascript', 'frontend', 'app']
        };
        
        for (const [tag, suggestions] of Object.entries(relatedTags)) {
            if (query.includes(tag)) {
                return suggestions.map(s => `<a href="?search=${s}">${s}</a>`).join('');
            }
        }
        
        return `
            <a href="?search=cerveza">cerveza</a>
            <a href="?search=wordpress">wordpress</a>
            <a href="?search=diseño">diseño</a>
            <a href="?search=react">react</a>
        `;
    }
    
    // Inicializar
    filterProjects();
    
    // Sistema de búsqueda (similar al de google-search.js)
    const searchInput = document.querySelector('.search-input-results');
    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'suggestions-box';
    searchInput.parentNode.appendChild(suggestionsBox);
    
    // Resto del código existente...
});
document.addEventListener('DOMContentLoaded', function() {
    // Configuración del tema (igual que en otras páginas)
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

    // Validación del formulario
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Simular envío
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="material-icons">hourglass_top</span> Enviando...';
            
            // Aquí iría la lógica real de envío con Formspree o similar
            setTimeout(() => {
                // Mensaje de éxito (en una implementación real, esto sería después de una respuesta exitosa del servidor)
                alert('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.');
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Copiar al portapapeles
    const contactItems = document.querySelectorAll('.info-item');
    
    contactItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'SPAN') return;
            
            const textToCopy = this.querySelector('p, a')?.textContent;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                    const notification = document.createElement('div');
                    notification.className = 'copy-notification';
                    notification.textContent = '¡Copiado al portapapeles!';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 2000);
                });
            }
        });
    });
});
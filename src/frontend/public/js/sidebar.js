document.addEventListener('DOMContentLoaded', async () => {
    const role = sessionStorage.getItem('role'); // Získání role uživatele
    const sidebarContainer = document.createElement('div');

    try {
        let menuUrl = '';
        if (role === 'admin') {
            menuUrl = '/admin/admin-menu.html';
        } else if (role === 'worker') {
            menuUrl = '/worker/worker-menu.html';
        } else {
            console.error('Neznámá role uživatele.');
            return;
        }

        // Načtení příslušného menu pomocí fetch
        const response = await fetch(menuUrl);
        if (response.ok) {
            const menuHtml = await response.text();
            sidebarContainer.innerHTML = menuHtml;
            document.body.prepend(sidebarContainer); // Přidání menu na začátek stránky
        } else {
            console.error(`Menu nelze načíst: ${response.status}`);
        }
    } catch (error) {
        console.error('Chyba při načítání menu:', error);
    }
});

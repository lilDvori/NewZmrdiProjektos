document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // Formulář přihlášení
    const errorMessage = document.getElementById('errorMessage'); // Pole pro zobrazení chyb

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Zamezíme standardnímu chování formuláře

        const username = document.getElementById('username').value.trim(); // Trim pro odstranění mezer
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            // Zkontrolujeme, zda jsou vyplněna pole
            errorMessage.textContent = 'Vyplňte prosím všechna pole.';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            // Odeslání dat na backend API
            const response = await fetch('/auth/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Pokud odpověď není 200 OK
                errorMessage.textContent = 'Neplatné přihlašovací údaje nebo chyba serveru.';
                errorMessage.style.display = 'block';
                return;
            }

            const data = await response.json(); // Zpracování odpovědi

            if (data.success) {
                // Uložení údajů uživatele do sessionStorage
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('role', data.role);

                // Přesměrování podle role
                if (data.role === 'admin') {
                    window.location.href = '/admin/admin-dashboard.html';
                } else if (data.role === 'worker') {
                    window.location.href = '/worker/worker-dashboard.html';
                } else {
                    errorMessage.textContent = 'Neznámá role uživatele.';
                    errorMessage.style.display = 'block';
                }
            } else {
                errorMessage.textContent = data.message || 'Přihlášení se nezdařilo.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Chyba při přihlašování:', error); // Debug
            errorMessage.textContent = 'Nastala chyba při připojení k serveru.';
            errorMessage.style.display = 'block';
        }
    });
});

import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Twoje poprawne dane
    const folderId = 'Io1hsg'; 
    const token = 'B5radPgpZ0YAHLCeJZDetXNQoKTWCaCI';

    try {
        // Zapytanie do API GoFile o zawartość folderu
        const response = await fetch(`https://api.gofile.io/getFolderContent?folderId=${folderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const text = await response.text();

        // Sprawdzenie, czy GoFile nie wyrzuciło błędu tekstowego
        if (text === "error-notFound") {
            return res.status(404).json({ 
                error: "Folder nie został znaleziony.", 
                help: "Upewnij się, że folder w panelu GoFile ma ustawienie Visibility: Public." 
            });
        }

        if (text === "error-notAllowed") {
            return res.status(403).json({ 
                error: "Brak dostępu.", 
                help: "Twój token API może być nieprawidłowy lub wygasł." 
            });
        }

        // Próba sparsowania odpowiedzi do JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(500).json({ 
                error: "Błąd formatu danych z GoFile", 
                raw: text 
            });
        }

        // Jeśli status to 'ok', wyciągamy listę plików
        if (data.status === 'ok') {
            // Pliki mogą być w data.children (dla folderów) lub data.contents
            const content = data.data.children || data.data.contents || {};
            const filesList = Object.values(content);
            
            res.status(200).json(filesList);
        } else {
            res.status(400).json({ 
                error: data.status, 
                details: data.data 
            });
        }

    } catch (error) {
        // Błąd krytyczny serwera (np. brak internetu lub node-fetch)
        res.status(500).json({ 
            error: "Internal Server Error", 
            message: error.message 
        });
    }
}

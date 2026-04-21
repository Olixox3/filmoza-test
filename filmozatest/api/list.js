import fetch from 'node-fetch';

export default async function handler(req, res) {
    // TWOJE NOWE DANE
    const folderId = 'MbHKSt'; 
    const token = 'B5radPgpZ0YAHLCeJZDetXNQoKTWCaCI';

    try {
        // Próbujemy pobrać zawartość folderu
        // Dodajemy token do URL oraz do Headers dla maksymalnej pewności
        const apiUrl = `https://api.gofile.io/getFolderContent?folderId=${folderId}&token=${token}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const text = await response.text();

        // Obsługa błędów tekstowych GoFile
        if (text === "error-notFound") {
            return res.status(404).json({ 
                error: "GoFile nie znalazło folderu MbHKSt.", 
                debug: "Sprawdź czy w GoFile folder ma Visibility: Public." 
            });
        }

        if (text === "error-notAllowed") {
            return res.status(403).json({ 
                error: "Token odrzucony przez GoFile." 
            });
        }

        // Parsowanie JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(500).json({ error: "Błąd JSON", raw: text });
        }

        if (data.status === 'ok') {
            // Wyciągamy pliki z children lub contents
            const content = data.data.children || data.data.contents || {};
            const files = Object.values(content);
            
            res.status(200).json(files);
        } else {
            res.status(400).json({ error: data.status, details: data.data });
        }

    } catch (error) {
        res.status(500).json({ error: "Błąd Vercel", message: error.message });
    }
}

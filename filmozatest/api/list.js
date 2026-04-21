import fetch from 'node-fetch';

export default async function handler(req, res) {
    // UWAGA: Upewnij się, że ten ID jest poprawny. 
    // To jest ID widoczne w linku, np. gofile.io/d/ADF89a59...
    const folderId = 'adf89a59-c0b8-40f2-a9b8-aed24de11aab'; 
    const token = 'B5radPgpZ0YAHLCeJZDetXNQoKTWCaCI';

    try {
        // Logujemy próbę połączenia
        console.log(`Pobieranie folderu: ${folderId}`);

        const response = await fetch(`https://api.gofile.io/getFolderContent?folderId=${folderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Sprawdzamy czy odpowiedź to w ogóle JSON
        const text = await response.text();
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            return res.status(500).json({ error: "Błąd formatu danych z GoFile", raw: text });
        }

        if (data.status === 'ok') {
            // GoFile zwraca pliki w polu 'children'
            const files = data.data.children ? Object.values(data.data.children) : [];
            res.status(200).json(files);
        } else {
            // Przekazujemy błąd bezpośrednio z GoFile do Twojej konsoli na stronie
            res.status(400).json({ error: data.status, message: "GoFile nie znalazło folderu. Sprawdź czy ID jest poprawne." });
        }
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera Vercel", details: error.message });
    }
}

import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Używamy długiego ID ze zdjęcia
    const folderId = '8c0531c4-6e9e-4c69-a3e3-2c84746b3f9a'; 
    const token = 'B5radPgpZ0YAHLCeJZDetXNQoKTWCaCI';

    try {
        const apiUrl = `https://api.gofile.io/getFolderContent?folderId=${folderId}&token=${token}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const text = await response.text();

        // Jeśli długie ID nie zadziała, spróbujmy automatycznie krótkiego kodu
        if (text === "error-notFound") {
            const secondaryUrl = `https://api.gofile.io/getFolderContent?folderId=MbHKSt&token=${token}`;
            const secondaryRes = await fetch(secondaryUrl, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const secondaryText = await secondaryRes.text();
            
            if (secondaryText === "error-notFound") {
                return res.status(404).json({ error: "GoFile nie widzi żadnego ID (MbHKSt ani długiego)", raw: secondaryText });
            }
            
            const secondData = JSON.parse(secondaryText);
            return res.status(200).json(Object.values(secondData.data.children || secondData.data.contents || {}));
        }

        const data = JSON.parse(text);
        if (data.status === 'ok') {
            const content = data.data.children || data.data.contents || {};
            res.status(200).json(Object.values(content));
        } else {
            res.status(400).json({ error: data.status });
        }

    } catch (error) {
        res.status(500).json({ error: "Błąd serwera Vercel", msg: error.message });
    }
}

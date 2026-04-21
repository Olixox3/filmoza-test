import fetch from 'node-fetch';

export default async function handler(req, res) {
    const folderId = 'adf89a59-c0b8-40f2-a9b8-aed24de11aab';
    const token = 'B5radPgpZ0YAHLCeJZDetXNQoKTWCaCI';

    try {
        const response = await fetch(`https://api.gofile.io/getFolderContent?folderId=${folderId}&token=${token}`);
        const data = await response.json();

        if (data.status === 'ok') {
            // Zwracamy tylko listê plików
            res.status(200).json(Object.values(data.data.contents));
        } else {
            res.status(500).json({ error: "B³¹d pobierania listy" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
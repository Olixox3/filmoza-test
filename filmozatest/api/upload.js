import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'B³¹d pliku' });

        try {
            const serverRes = await fetch('https://api.gofile.io/getServer');
            const serverData = await serverRes.json();
            const server = serverData.data.server;

            const file = files.file[0] || files.file;
            const formData = new FormData();
            formData.append('file', fs.createReadStream(file.filepath));
            formData.append('token', 'B5radPgpZ0YAHLCeJZDetXNQoKTWCaCI');
            formData.append('folderId', 'adf89a59-c0b8-40f2-a9b8-aed24de11aab');

            const uploadRes = await fetch(`https://${server}.gofile.io/uploadFile`, {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(),
            });

            const result = await uploadRes.json();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
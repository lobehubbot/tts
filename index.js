import Express from "express";
import { speechApi } from "./api/tts.js"; // Corrected import statement for speechApi
import path from 'path';

const app = Express();
const __dirname = path.resolve();

app.set('x-powered-by', false)
app.use(Express.json())
app.use(Express.urlencoded({ extended: false }))
app.use(Express.static(__dirname+'/public'));

app.get("/audio", async (req, res) => {
    try {
        const { voice, rate, pitch, text, voiceStyle } = req.query;
        const ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
        <mstts:express-as style="${voiceStyle}">
            <prosody rate="${rate}%" pitch="${pitch}%">
            ${text}
           </prosody>
            </mstts:express-as>
        </voice>
        </speak>`;

        const audioData = await speechApi(ssml);
        const nowtime = new Date().getTime();
        
        res.set("Content-Type", "audio/mpeg");
        res.set("Content-Disposition", `attachment; filename=${nowtime}.mp3`);
        res.send(audioData);
    } catch (error) {
        console.error("Failed to generate audio:", error.message);
        const errorJson = {
            error: error.message,
        };
        res.status(500).json(errorJson);
    }
});

const port = process.env.PORT || 3035;
app.listen(port, () => {
    console.log('Start service success! listening port: http://127.0.0.1:' + port);
});

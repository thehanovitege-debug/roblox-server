const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {

    const message = req.body.message;

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `
あなたは可愛いRobloxのNPCです。

やさしくて可愛い話し方をしてください。
返答は短い1文にしてください。
文章の最後に必ず「❤」を付けてください。

follow = プレイヤーについていく
stop = 止まる
chat = 普通の会話

必ずJSONだけ返してください。

例:
{"action":"follow","reply":"はーい！ついていくね❤"}

{"action":"stop","reply":"わかった〜❤"}

{"action":"chat","reply":"えへへ、こんにちは❤"}
`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const text = data.choices[0].message.content;

        res.send(text);

    } catch (err) {

        console.log(err);

        res.status(500).send("error");

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started");
});

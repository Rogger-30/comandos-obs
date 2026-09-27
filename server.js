const express = require("express");
const OBSWebSocket = require("obs-websocket-js").default;

const app = express();
const obs = new OBSWebSocket();

const PORT = 3000;

// Servir o painel HTML
app.use(express.static("public"));

// Conectar ao OBS
async function conectarOBS() {
    try {
        await obs.connect("ws://127.0.0.1:4455", "SUA_SENHA");

        console.log("✅ Conectado ao OBS!");
    } catch (error) {
        console.error("❌ Erro ao conectar no OBS:", error);
    }
}

conectarOBS();

// Trocar cena
app.get("/cena/:nome", async (req, res) => {
    try {
        await obs.call("SetCurrentProgramScene", {
            sceneName: req.params.nome
        });

        res.json({
            sucesso: true,
            cena: req.params.nome
        });

    } catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// Iniciar transmissão
app.get("/live/iniciar", async (req, res) => {
    try {
        await obs.call("StartStream");

        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// Parar transmissão
app.get("/live/parar", async (req, res) => {
    try {
        await obs.call("StopStream");

        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// Iniciar gravação
app.get("/gravacao/iniciar", async (req, res) => {
    try {
        await obs.call("StartRecord");

        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// Parar gravação
app.get("/gravacao/parar", async (req, res) => {
    try {
        await obs.call("StopRecord");

        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Painel rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

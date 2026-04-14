const btnBuscar = document.getElementById('buscar');
const inputCidade = document.getElementById('cidade');
const dataList = document.getElementById('sugestoes');

function traduzirClima(codigo) {
    const codigos = {
        0: "Céu Limpo", 1: "Limpo", 2: "Parcialmente Nublado", 3: "Nublado",
        45: "Neblina", 48: "Neblina", 51: "Garoa Leve", 53: "Garoa", 55: "Garoa Densa",
        61: "Chuva Leve", 63: "Chuva", 65: "Chuva Forte", 80: "Pancadas Chuva", 95: "Trovoada"
    };
    return codigos[codigo] || "Variável";
}

const cidadesBR = ["São Paulo, SP", "Rio de Janeiro, RJ", "Brasília, DF", "Salvador, BA", "Fortaleza, CE", "Belo Horizonte, MG", "Manaus, AM", "Curitiba, PR", "Recife, PE", "Porto Alegre, RS", "Palmas, TO"];

inputCidade.addEventListener('input', (e) => {
    const busca = e.target.value.toLowerCase();
    dataList.innerHTML = "";
    if (busca.length >= 2) {
        cidadesBR.filter(c => c.toLowerCase().includes(busca)).forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            dataList.appendChild(opt);
        });
    }
});

async function buscarClima() {
    const cidade = inputCidade.value.split(',')[0].trim();
    if (!cidade) return;

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`);
        const geoData = await geoRes.json();
        if (!geoData.results) throw new Error("Cidade não encontrada");

        const { latitude, longitude, name } = geoData.results[0];
        const climaRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max&timezone=auto`);
        const climaData = await climaRes.json();

        document.getElementById('nome-cidade').innerText = name;
        document.getElementById('display-temp').innerText = `${Math.round(climaData.current.temperature_2m)}°C`;
        document.getElementById('desc-clima').innerText = traduzirClima(climaData.current.weather_code);
        document.getElementById('vento').innerText = `${climaData.current.wind_speed_10m} km/h`;
        document.getElementById('sensacao').innerText = `${Math.round(climaData.current.apparent_temperature)}°C`;

        const forecastDiv = document.getElementById('previsao');
        forecastDiv.innerHTML = "";
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

        climaData.daily.time.forEach((t, i) => {
            if (i === 0 || i > 6) return; // Mostra 6 dias futuros para caber na tela
            const d = new Date(t + "T00:00");
            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <span class="dia-legenda">${diasSemana[d.getDay()]}</span>
                    <strong class="dia-temp">${Math.round(climaData.daily.temperature_2m_max[i])}°</strong>
                </div>`;
        });
    } catch (e) { alert(e.message); }
}

btnBuscar.addEventListener('click', buscarClima);
inputCidade.addEventListener('keypress', (e) => e.key === 'Enter' && buscarClima());

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('pt-BR');
}
setInterval(updateClock, 1000);
updateClock();
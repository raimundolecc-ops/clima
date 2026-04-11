const btnBuscar = document.getElementById('buscar');
const inputCidade = document.getElementById('cidade');
const dataList = document.getElementById('sugestoes');



// Traduções para o Português
const traducoes = {
    "Clear": "Céu Limpo",
    "Partly cloudy": "Parcialmente Nublado",
    "Cloudy": "Nublado",
    "Rain": "Chuva",
    "Light rain": "Chuva Leve",
    "Sunny": "Ensolarado",
    "Patchy rain nearby": "Chuva nas proximidades",
    "Moderate rain": "Chuva Moderada",
    "Heavy rain": "Chuva Forte",
    "Overcast": "Encoberto",
    "Mist": "Névoa",
    "Fog": "Neblina"
};

// Lista de Sugestões (Capitais do Brasil)
const cidadesBR = [
    "Aracaju, SE", "Belém, PA", "Belo Horizonte, MG", "Boa Vista, RR", "Brasília, DF",
    "Campo Grande, MS", "Cuiabá, MT", "Curitiba, PR", "Florianópolis, SC", "Fortaleza, CE",
    "Goiânia, GO", "João Pessoa, PB", "Macapá, AP", "Maceió, AL", "Manaus, AM",
    "Natal, RN", "Palmas, TO", "Porto Alegre, RS", "Porto Velho, RO", "Recife, PE",
    "Rio Branco, AC", "Rio de Janeiro, RJ", "Salvador, BA", "São Luís, MA", "São Paulo, SP",
    "Teresina, PI", "Vitória, ES"
];

// 1. Filtro de Sugestões
inputCidade.addEventListener('input', (e) => {
    const busca = e.target.value.toLowerCase();
    dataList.innerHTML = "";
    if (busca.length >= 2) {
        cidadesBR.filter(c => c.toLowerCase().includes(busca)).forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade;
            dataList.appendChild(option);
        });
    }
});

// 2. Busca de Clima
async function buscarClima() {
    const cidadeDigitada = inputCidade.value;
    
    // Tratamento: remove acentos e caracteres especiais para a URL da API
    const cidadeTratada = cidadeDigitada.split(',')[0].trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!cidadeTratada) return;

    try {
        document.getElementById('desc-clima').innerText = "Consultando...";
        
        // URL Corrigida (herokuapp)
        const response = await fetch(`https://goweather.herokuapp.com/weather/${encodeURIComponent(cidadeTratada)}`);
        
        if (!response.ok) throw new Error();

        const dados = await response.json();

        if (dados.temperature && dados.temperature !== "") {
            atualizarTela(dados, cidadeDigitada.split(',')[0].trim());
        } else {
            document.getElementById('desc-clima').innerText = "Cidade não encontrada";
            alert("API limitada: Tente uma capital ou cidade maior sem acentos.");
        }
    } catch (erro) {
        document.getElementById('desc-clima').innerText = "Erro na conexão";
        alert("Erro ao conectar no servidor. Tente novamente.");
    }
}

// 3. Atualização da Interface
function atualizarTela(dados, cidadeExibicao) {
    const descTraduzida = traducoes[dados.description] || dados.description;

    document.getElementById('nome-cidade').innerText = cidadeExibicao;
    document.getElementById('display-temp').innerText = dados.temperature;
    document.getElementById('desc-clima').innerText = descTraduzida;
    document.getElementById('vento').innerText = dados.wind;
    document.getElementById('sensacao').innerText = dados.temperature;

    const forecastDiv = document.getElementById('previsao');
    forecastDiv.innerHTML = "";

    const legendasDias = ["Amanhã", "2 dias", "3 dias"];

    if (dados.forecast) {
        dados.forecast.forEach((dia, index) => {
            const div = document.createElement('div');
            div.className = 'forecast-item';
            const diaTexto = legendasDias[index] || `Dia ${dia.day}`;
            
            div.innerHTML = `
                <span class="dia-legenda">${diaTexto}</span>
                <strong class="dia-temp">${dia.temperature}</strong>
            `;
            forecastDiv.appendChild(div);
        });
    }
}

btnBuscar.addEventListener('click', buscarClima);
inputCidade.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscarClima(); });

function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        document.getElementById('clock').textContent = timeString;
    }

    // Atualiza a cada segundo
    setInterval(updateClock, 1000);
    // Chama imediatamente para não esperar 1 segundo no início
    updateClock();
var createTextStyle = function(feature, resolution, labelText, labelFont,
                               labelFill, placement, bufferColor,
                               bufferWidth) {

    if (feature.hide || !labelText) {
        return; 
    } 

    if (bufferWidth == 0) {
        var bufferStyle = null;
    } else {
        var bufferStyle = new ol.style.Stroke({
            color: bufferColor,
            width: bufferWidth
        })
    }
    
    var textStyle = new ol.style.Text({
        font: labelFont,
        text: labelText,
        textBaseline: "middle",
        textAlign: "left",
        offsetX: 8,
        offsetY: 3,
        placement: placement,
        maxAngle: 0,
        fill: new ol.style.Fill({
          color: labelFill
        }),
        stroke: bufferStyle
    });

    return textStyle;
};

function stripe(stripeWidth, gapWidth, angle, color) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = screen.width;
    canvas.height = stripeWidth + gapWidth;
    context.fillStyle = color;
    context.lineWidth = stripeWidth;
    context.fillRect(0, 0, canvas.width, stripeWidth);
    innerPattern = context.createPattern(canvas, 'repeat');

    var outerCanvas = document.createElement('canvas');
    var outerContext = outerCanvas.getContext('2d');
    outerCanvas.width = screen.width;
    outerCanvas.height = screen.height;
    outerContext.rotate((Math.PI / 180) * angle);
    outerContext.translate(-(screen.width/2), -(screen.height/2));
    outerContext.fillStyle = innerPattern;
    outerContext.fillRect(0,0,screen.width,screen.height);

    return outerContext.createPattern(outerCanvas, 'no-repeat');
};

// Função para atualizar a legenda na barra lateral
function updateLegend(layers) {
    const legendContainer = document.getElementById('map-legend');
    legendContainer.innerHTML = ''; // Limpa o conteúdo atual

    // Adiciona a legenda do índice atual
    const indexData = INDEX_DATA[currentIndex];
    if (indexData) {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            // Adiciona o título
            const titleElement = document.createElement('h3');
            titleElement.style.margin = '10px 0';
            titleElement.style.fontSize = '14px';
        titleElement.innerHTML = indexData.legend.title;
            legendItem.appendChild(titleElement);

        // Adiciona a descrição
        const descElement = document.createElement('p');
        descElement.style.margin = '5px 0 15px 0';
        descElement.style.fontSize = '12px';
        descElement.style.color = '#666';
        descElement.innerHTML = indexData.legend.description;
        legendItem.appendChild(descElement);

        // Adiciona as faixas de valores
        indexData.legend.ranges.forEach(range => {
            const rangeDiv = document.createElement('div');
            rangeDiv.style.display = 'flex';
            rangeDiv.style.alignItems = 'center';
            rangeDiv.style.margin = '5px 0';

                    const colorBox = document.createElement('span');
                    colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = range.color;
                    colorBox.style.width = '20px';
                    colorBox.style.height = '20px';
                    colorBox.style.display = 'inline-block';
                    colorBox.style.marginRight = '8px';

                    const label = document.createElement('span');
                    label.className = 'legend-label';
            label.textContent = range.label;
                    label.style.fontSize = '12px';

            rangeDiv.appendChild(colorBox);
            rangeDiv.appendChild(label);
            legendItem.appendChild(rangeDiv);
                });

            legendContainer.appendChild(legendItem);
    }
}

// Função para formatar a data
function formatDate(day, month) {
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
}

// Função para limpar tags HTML de uma string
function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

// Função para encontrar uma camada pelo título
function findLayerByTitle(map, layerTitle) {
    let foundLayer = null;
    
    function searchInGroup(layers) {
        layers.forEach(layer => {
            if (layer instanceof ol.layer.Group) {
                if (layer.get('title') === 'NDRE') {
                    layer.getLayers().forEach(sublayer => {
                        const title = sublayer.get('title') || '';
                        if (title === layerTitle) {
                            foundLayer = sublayer;
                        }
                    });
                } else {
                    searchInGroup(layer.getLayers().getArray());
                }
            } else {
                const title = layer.get('title') || '';
                if (title === layerTitle) {
                    foundLayer = layer;
                }
            }
        });
    }
    
    searchInGroup(map.getLayers().getArray());
    return foundLayer;
}

// Função para criar a legenda
function createLegend(map) {
    const legendContainer = document.getElementById('map-legend');
    const ndreGroup = map.getLayers().getArray().find(layer => 
        layer instanceof ol.layer.Group && layer.get('title') === 'NDRE'
    );

    if (ndreGroup) {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <h3>NDRE</h3>
            <div>
                <span class="legend-color" style="background-color: #d7191c"></span>
                <span class="legend-label">Vegetação estressada ou solo exposto</span>
            </div>
            <div>
                <span class="legend-color" style="background-color: #fdae61"></span>
                <span class="legend-label">Vegetação em desenvolvimento inicial</span>
            </div>
            <div>
                <span class="legend-color" style="background-color: #a6d96a"></span>
                <span class="legend-label">Vegetação saudável</span>
            </div>
            <div>
                <span class="legend-color" style="background-color: #1a9641"></span>
                <span class="legend-label">Vegetação muito vigorosa</span>
            </div>
        `;
        legendContainer.appendChild(legendItem);
    }
}

// Variáveis globais
var map;
var currentDate;

// Dados de exemplo para os índices
const INDEX_DATA = {
    'NDRE': {
        name: "NDRE",
        dates: [
            // Setembro 2024
            { day: 14, month: 9, year: 2024, info: "NDRE - Setembro 2024" },
            { day: 29, month: 9, year: 2024, info: "NDRE - Setembro 2024" },
            // Outubro 2024
            { day: 4, month: 10, year: 2024, info: "NDRE - Outubro 2024" },
            { day: 19, month: 10, year: 2024, info: "NDRE - Outubro 2024" },
            { day: 29, month: 10, year: 2024, info: "NDRE - Outubro 2024" },
            // Novembro 2024
            { day: 13, month: 11, year: 2024, info: "NDRE - Novembro 2024" },
            // Dezembro 2024
            { day: 18, month: 12, year: 2024, info: "NDRE - Dezembro 2024" },
            { day: 23, month: 12, year: 2024, info: "NDRE - Dezembro 2024" },
            { day: 28, month: 12, year: 2024, info: "NDRE - Dezembro 2024" },
            // Janeiro 2025
            { day: 2, month: 1, year: 2025, info: "NDRE - Janeiro 2025" },
            { day: 7, month: 1, year: 2025, info: "NDRE - Janeiro 2025" },
            { day: 12, month: 1, year: 2025, info: "NDRE - Janeiro 2025" },
            { day: 17, month: 1, year: 2025, info: "NDRE - Janeiro 2025" },
            { day: 22, month: 1, year: 2025, info: "NDRE - Janeiro 2025" },
            // Fevereiro 2025
            { day: 1, month: 2, year: 2025, info: "NDRE - Fevereiro 2025" },
            { day: 11, month: 2, year: 2025, info: "NDRE - Fevereiro 2025" },
            { day: 21, month: 2, year: 2025, info: "NDRE - Fevereiro 2025" },
            { day: 26, month: 2, year: 2025, info: "NDRE - Fevereiro 2025" }
        ],
        legend: {
            title: "Índice NDRE",
            description: "Normalized Difference Red Edge - Avalia o teor de clorofila e nitrogênio",
            ranges: [
                { color: "#d7191c", label: "Vegetação estressada (0.0-0.2)" },
                { color: "#fdae61", label: "Estresse moderado (0.2-0.4)" },
                { color: "#a6d96a", label: "Vegetação saudável (0.4-0.6)" },
                { color: "#1a9641", label: "Vegetação muito saudável (0.6-1.0)" }
            ]
        }
    },
    'NDVI': {
        name: "NDVI",
        dates: [
            // Setembro 2024
            { day: 14, month: 9, year: 2024, info: "NDVI - Setembro 2024" },
            { day: 29, month: 9, year: 2024, info: "NDVI - Setembro 2024" },
            // Outubro 2024
            { day: 4, month: 10, year: 2024, info: "NDVI - Outubro 2024" },
            { day: 19, month: 10, year: 2024, info: "NDVI - Outubro 2024" },
            { day: 29, month: 10, year: 2024, info: "NDVI - Outubro 2024" },
            // Novembro 2024
            { day: 13, month: 11, year: 2024, info: "NDVI - Novembro 2024" },
            // Dezembro 2024
            { day: 18, month: 12, year: 2024, info: "NDVI - Dezembro 2024" },
            { day: 23, month: 12, year: 2024, info: "NDVI - Dezembro 2024" },
            { day: 28, month: 12, year: 2024, info: "NDVI - Dezembro 2024" },
            // Janeiro 2025
            { day: 2, month: 1, year: 2025, info: "NDVI - Janeiro 2025" },
            { day: 7, month: 1, year: 2025, info: "NDVI - Janeiro 2025" },
            { day: 12, month: 1, year: 2025, info: "NDVI - Janeiro 2025" },
            { day: 17, month: 1, year: 2025, info: "NDVI - Janeiro 2025" },
            { day: 22, month: 1, year: 2025, info: "NDVI - Janeiro 2025" },
            // Fevereiro 2025
            { day: 1, month: 2, year: 2025, info: "NDVI - Fevereiro 2025" },
            { day: 11, month: 2, year: 2025, info: "NDVI - Fevereiro 2025" },
            { day: 21, month: 2, year: 2025, info: "NDVI - Fevereiro 2025" },
            { day: 26, month: 2, year: 2025, info: "NDVI - Fevereiro 2025" }
        ],
        legend: {
            title: "Índice NDVI",
            description: "Normalized Difference Vegetation Index - Avalia o vigor da vegetação",
            ranges: [
                { color: "#d7191c", label: "Solo exposto (0.0-0.2)" },
                { color: "#fdae61", label: "Vegetação esparsa (0.2-0.4)" },
                { color: "#a6d96a", label: "Vegetação moderada (0.4-0.6)" },
                { color: "#1a9641", label: "Vegetação densa (0.6-0.8)" },
                { color: "#006400", label: "Vegetação muito densa (0.8-1.0)" }
            ]
        }
    },
    'GNDVI': {
        name: "GNDVI",
        dates: [
            { day: 14, month: 9, year: 2024, info: "GNDVI" },
            { day: 29, month: 9, year: 2024, info: "GNDVI" },
            { day: 4, month: 10, year: 2024, info: "GNDVI" },
            { day: 19, month: 10, year: 2024, info: "GNDVI" },
            { day: 29, month: 10, year: 2024, info: "GNDVI" },
            // Novembro 2024
            { day: 13, month: 11, year: 2024, info: "GNDVI" },
            // Dezembro 2024
            { day: 18, month: 12, year: 2024, info: "GNDVI" },
            { day: 23, month: 12, year: 2024, info: "GNDVI" },
            { day: 28, month: 12, year: 2024, info: "GNDVI" },
            // Janeiro 2025
            { day: 2, month: 1, year: 2025, info: "GNDVI" },
            { day: 7, month: 1, year: 2025, info: "GNDVI" },
            { day: 12, month: 1, year: 2025, info: "GNDVI" },
            { day: 17, month: 1, year: 2025, info: "GNDVI" },
            { day: 22, month: 1, year: 2025, info: "GNDVI" },
            // Fevereiro 2025
            { day: 1, month: 2, year: 2025, info: "GNDVI" },
            { day: 11, month: 2, year: 2025, info: "GNDVI" },
            { day: 21, month: 2, year: 2025, info: "GNDVI" },
            { day: 26, month: 2, year: 2025, info: "GNDVI" }

        ],
        legend: {
            title: "Índice GNDVI",
            description: "Green Normalized Difference Vegetation Index - Sensível à variação de clorofila",
            ranges: [
                { color: "#d7191c", label: "Baixa atividade (0.0-0.2)" },
                { color: "#fdae61", label: "Atividade moderada (0.2-0.4)" },
                { color: "#a6d96a", label: "Alta atividade (0.4-0.6)" },
                { color: "#1a9641", label: "Atividade muito alta (0.6-1.0)" }
            ]
        }
    },
    'NDMI': {
        name: "NDMI",
        dates: [
            { day: 14, month: 9, year: 2024, info: "NDMI" },
            { day: 29, month: 9, year: 2024, info: "NDMI" },
            { day: 19, month: 10, year: 2024, info: "NDMI" },
            { day: 29, month: 10, year: 2024, info: "NDMI" },
            { day: 29, month: 10, year: 2024, info: "NDMI" },
            { day: 13, month: 11, year: 2024, info: "NDMI" },
            { day: 18, month: 12, year: 2024, info: "NDMI" },
            { day: 23, month: 12, year: 2024, info: "NDMI" },
            { day: 28, month: 12, year: 2024, info: "NDMI" },
            { day: 2, month: 1, year: 2025, info: "NDMI" },
            { day: 7, month: 1, year: 2025, info: "NDMI" },
            { day: 12, month: 1, year: 2025, info: "NDMI" },
            { day: 17, month: 1, year: 2025, info: "NDMI" },
            { day: 22, month: 1, year: 2025, info: "NDMI" },
            { day: 1, month: 2, year: 2025, info: "NDMI" },
            { day: 11, month: 2, year: 2025, info: "NDMI" },
            { day: 21, month: 2, year: 2025, info: "NDMI" },
            { day: 26, month: 2, year: 2025, info: "NDMI" },
            { day: 4, month: 10, year: 2024, info: "NDMI" }
        ],
        legend: {
            title: "Índice NDMI",
            description: "Normalized Difference Moisture Index - Avalia o conteúdo de água na vegetação",
            ranges: [
                { color: "#d7191c", label: "Baixa umidade (< 0.2)" },
                { color: "#fdae61", label: "Umidade moderada (0.2-0.4)" },
                { color: "#a6d96a", label: "Alta umidade (0.4-0.6)" },
                { color: "#1a9641", label: "Umidade muito alta (> 0.6)" }
            ]
        }
    },
    'SAVI': {
        name: "SAVI",
        dates: [
            { day: 14, month: 9, year: 2024, info: "SAVI" },
            { day: 29, month: 9, year: 2024, info: "SAVI" },
            { day: 19, month: 10, year: 2024, info: "SAVI" },
            { day: 29, month: 10, year: 2024, info: "SAVI" },
            { day: 13, month: 11, year: 2024, info: "SAVI" },
            { day: 18, month: 12, year: 2024, info: "SAVI" },
            { day: 23, month: 12, year: 2024, info: "SAVI" },
            { day: 28, month: 12, year: 2024, info: "SAVI" },
            { day: 2, month: 1, year: 2025, info: "SAVI" },
            { day: 7, month: 1, year: 2025, info: "SAVI" },
            { day: 12, month: 1, year: 2025, info: "SAVI" },
            { day: 17, month: 1, year: 2025, info: "SAVI" },
            { day: 22, month: 1, year: 2025, info: "SAVI" },
            { day: 1, month: 2, year: 2025, info: "SAVI" },
            { day: 11, month: 2, year: 2025, info: "SAVI" },
            { day: 21, month: 2, year: 2025, info: "SAVI" },
            { day: 26, month: 2, year: 2025, info: "SAVI" },
            { day: 4, month: 10, year: 2024, info: "SAVI" }
        ],
        legend: {
            title: "Índice SAVI",
            description: "Soil Adjusted Vegetation Index - Minimiza a influência do solo",
            ranges: [
                { color: "#d7191c", label: "Vegetação muito esparsa (0.0-0.2)" },
                { color: "#fdae61", label: "Vegetação esparsa (0.2-0.4)" },
                { color: "#a6d96a", label: "Vegetação moderada (0.4-0.6)" },
                { color: "#1a9641", label: "Vegetação densa (> 0.6)" }
            ]
        }
    },
    'EVI': {
        name: "EVI",
        dates: [
            { day: 14, month: 9, year: 2024, info: "EVI" },
            { day: 29, month: 9, year: 2024, info: "EVI" },
            { day: 19, month: 10, year: 2024, info: "EVI" },
            { day: 29, month: 10, year: 2024, info: "EVI" },
            { day: 13, month: 11, year: 2024, info: "EVI" },
            { day: 18, month: 12, year: 2024, info: "EVI" },
            { day: 23, month: 12, year: 2024, info: "EVI" },
            { day: 28, month: 12, year: 2024, info: "EVI" },
            { day: 2, month: 1, year: 2025, info: "EVI" },
            { day: 7, month: 1, year: 2025, info: "EVI" },
            { day: 12, month: 1, year: 2025, info: "EVI" },
            { day: 17, month: 1, year: 2025, info: "EVI" },
            { day: 22, month: 1, year: 2025, info: "EVI" },
            { day: 1, month: 2, year: 2025, info: "EVI" },
            { day: 11, month: 2, year: 2025, info: "EVI" },
            { day: 21, month: 2, year: 2025, info: "EVI" },
            { day: 26, month: 2, year: 2025, info: "EVI" },
            { day: 4, month: 10, year: 2024, info: "EVI" }
        ],
        legend: {
            title: "Índice EVI",
            description: "Enhanced Vegetation Index - Otimizado para alta biomassa",
            ranges: [
                { color: "#d7191c", label: "Baixa biomassa (0.0-0.2)" },
                { color: "#fdae61", label: "Biomassa moderada (0.2-0.4)" },
                { color: "#a6d96a", label: "Alta biomassa (0.4-0.6)" },
                { color: "#1a9641", label: "Biomassa muito alta (> 0.6)" }
            ]
        }
    }
};

let currentIndex = 'NDRE';

// Função para verificar se uma data está disponível para o índice atual
function isDateAvailable(day, month, year) {
    if (!INDEX_DATA[currentIndex]) {
        console.error('Índice não encontrado:', currentIndex);
        return false;
    }

    const dates = INDEX_DATA[currentIndex].dates;
    
    // Converte os valores para números para garantir a comparação correta
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    console.log('Verificando disponibilidade:', {
        data: `${dayNum}/${monthNum}/${yearNum}`,
        índice: currentIndex
    });

    const isAvailable = dates.some(date => 
        date.day === dayNum && 
        date.month === monthNum && 
        date.year === yearNum
    );

    if (isAvailable) {
        console.log('Data disponível:', `${dayNum}/${monthNum}/${yearNum}`);
    }

    return isAvailable;
}

// Função para atualizar a legenda dinâmica
function updateDynamicLegend(day, month, year) {
    const legendContent = document.getElementById('dynamic-legend-content');
    const dates = INDEX_DATA[currentIndex].dates;
    const date = dates.find(d => d.day === day && d.month === month && d.year === year);

    if (date) {
        const indexData = INDEX_DATA[currentIndex];
        legendContent.innerHTML = `
            <span><strong>${indexData.legend.title}</strong></span>
            <span>${indexData.legend.description}</span>
            <span>Data: ${day}/${month}/${year}</span>
            <span>${date.info}</span>
        `;
    } else {
        legendContent.innerHTML = 'Selecione uma data para ver as informações.';
    }
}

// Array com a sequência correta dos meses
const VALID_MONTHS = [
    { month: 9, year: 2024 },   // Setembro 2024
    { month: 10, year: 2024 },  // Outubro 2024
    { month: 11, year: 2024 },  // Novembro 2024
    { month: 12, year: 2024 },  // Dezembro 2024
    { month: 1, year: 2025 },   // Janeiro 2025
    { month: 2, year: 2025 }    // Fevereiro 2025
];

let currentMonthIndex = 0;

// Função para atualizar o calendário
function updateCalendar() {
    console.log('Atualizando calendário para o índice:', currentMonthIndex);
    
    const monthYear = document.getElementById('current-month');
    const calendarDays = document.getElementById('calendar-days');
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (!monthYear || !calendarDays) {
        console.error('Elementos do calendário não encontrados');
        return;
    }

    const currentMonth = VALID_MONTHS[currentMonthIndex];
    console.log('Mês atual:', currentMonth);
    
    // Array com nomes dos meses em português
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    // Atualiza o título do mês
    monthYear.textContent = `${monthNames[currentMonth.month - 1]} ${currentMonth.year}`;
    
    // Limpa o calendário
    calendarDays.innerHTML = '';
    
    // Calcula o primeiro e último dia do mês
    const firstDay = new Date(currentMonth.year, currentMonth.month - 1, 1);
    const lastDay = new Date(currentMonth.year, currentMonth.month, 0);
    
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    // Adiciona os dias do mês anterior
    const prevMonth = currentMonth.month === 1 ? 12 : currentMonth.month - 1;
    const prevYear = currentMonth.month === 1 ? currentMonth.year - 1 : currentMonth.year;
    const prevMonthDays = new Date(prevYear, prevMonth, 0).getDate();
    
    for (let i = startingDay - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        calendarDays.appendChild(dayDiv);
    }
    
    // Adiciona os dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        if (isDateAvailable(day, currentMonth.month, currentMonth.year)) {
            dayDiv.classList.add('has-image');
            dayDiv.onclick = function() {
                const selected = document.querySelector('.calendar-day.selected');
                if (selected) selected.classList.remove('selected');
                dayDiv.classList.add('selected');
                updateDynamicLegend(day, currentMonth.month, currentMonth.year);
                showImageForDate(day, new Date(currentMonth.year, currentMonth.month - 1, day));
            };
        }
        
        calendarDays.appendChild(dayDiv);
    }
    
    // Adiciona apenas os dias necessários para completar a última semana
    const totalCells = startingDay + totalDays;
    const remainingDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    
    for (let day = 1; day <= remainingDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        calendarDays.appendChild(dayDiv);
    }
    
    // Atualiza os botões de navegação
    if (prevButton && nextButton) {
        prevButton.disabled = currentMonthIndex === 0;
        nextButton.disabled = currentMonthIndex === VALID_MONTHS.length - 1;
        prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
    }
}

// Função para formatar a data para o nome do arquivo
function formatDateForLayer(day, month) {
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`;
}

// Função para encontrar o índice do arquivo
function findFileIndex(dateStr) {
    const allDates = Object.values(INDEX_DATA).flatMap(index => 
        index.dates.map(date => formatDateForLayer(date.day, date.month))
    );
    return allDates.indexOf(dateStr) + 1;
}

// Função para mostrar a imagem de uma data específica
function showImageForDate(day, date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = formatDateForLayer(day, month);
    
    console.log('Mostrando imagem para:', {
        data: `${day}/${month}/${year}`,
        índice: currentIndex,
        formatoData: dateStr
    });
    
    // Esconder todas as camadas exceto o mapa base e o limite
    map.getLayers().getArray().forEach(layer => {
        const layerTitle = layer.get('title');
        if (layerTitle && layerTitle !== 'Google Hybrid' && layerTitle !== 'IMOVEL PRIMAVERA') {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(sublayer => {
                    sublayer.setVisible(false);
                });
            } else {
                layer.setVisible(false);
            }
        }
    });

    // Manter o mapa base e o limite da propriedade visíveis
    if (window.lyr_GoogleHybrid_0) {
        window.lyr_GoogleHybrid_0.setVisible(true);
    }
    if (window.lyr_IMOVELPRIMAVERAUTM_19) {
        window.lyr_IMOVELPRIMAVERAUTM_19.setVisible(true);
    }
    
    // Encontrar e mostrar a camada correspondente
    map.getLayers().getArray().forEach(layer => {
        if (layer instanceof ol.layer.Group && layer.get('title') === currentIndex) {
            layer.getLayers().forEach(sublayer => {
                const title = sublayer.get('title');
                const expectedTitle = `${currentIndex} ${dateStr}`;
                console.log('Comparando camadas:', { atual: title, esperada: expectedTitle });
                    
                if (title === expectedTitle) {
                    console.log('Ativando camada:', title);
                    sublayer.setVisible(true);
                    layer.setVisible(true);
                        
                    // Verificar se a fonte da imagem está carregando corretamente
                    const source = sublayer.getSource();
                    if (source) {
                        console.log('URL da imagem:', source.getUrl());
                        source.on('imageloadstart', () => console.log('Iniciando carregamento da imagem'));
                        source.on('imageloadend', () => console.log('Imagem carregada com sucesso'));
                        source.on('imageloaderror', (event) => {
                            console.error('Erro ao carregar imagem:', event);
                            console.error('URL que falhou:', source.getUrl());
                        });
                    }
                }
            });
        }
    });

    // Atualizar a legenda
    updateLegend(map.getLayers().getArray());
}

// Função para inicializar a interface
function initInterface(map) {
    // Inicializa com setembro de 2024
    currentMonthIndex = 0;
    updateCalendar();

    // Configuração dos botões de navegação do calendário
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');

    if (prevButton) {
        prevButton.onclick = function() {
            if (currentMonthIndex > 0) {
                currentMonthIndex--;
                console.log('Navegando para mês anterior:', VALID_MONTHS[currentMonthIndex]);
                updateCalendar();
            }
        };
    }

    if (nextButton) {
        nextButton.onclick = function() {
            if (currentMonthIndex < VALID_MONTHS.length - 1) {
                currentMonthIndex++;
                console.log('Navegando para próximo mês:', VALID_MONTHS[currentMonthIndex]);
                updateCalendar();
            }
        };
    }

    // Configuração dos botões de índice
    const indexButtons = document.querySelectorAll('.index-button');
    indexButtons.forEach(button => {
        button.onclick = function() {
            currentIndex = this.getAttribute('data-index');
            indexButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateCalendar();
            
            const selected = document.querySelector('.calendar-day.selected');
            if (selected) {
                selected.classList.remove('selected');
            }
            
            document.getElementById('dynamic-legend-content').innerHTML = 
                'Selecione uma data para ver as informações.';
            
            updateLegend(map.getLayers().getArray());
        };
    });

    // Configura estado inicial dos botões
    if (prevButton && nextButton) {
        prevButton.disabled = true;
        nextButton.disabled = false;
        prevButton.style.opacity = '0.5';
        nextButton.style.opacity = '1';
    }
}

// Função para inicializar o mapa
function initMap() {
    console.log('Iniciando inicialização do mapa...');
    
    try {
        map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    title: 'Google Hybrid',
                    source: new ol.source.XYZ({
                        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                        attributions: ['Imagery © Google']
                    }),
                    visible: true
                }),
                ...window.layersList
            ],
            view: new ol.View({
                projection: 'EPSG:31981',
                center: [501877.862185, 6716862.240050],
                zoom: 14
            })
        });

        console.log('Mapa criado com sucesso');

        // Listar todas as camadas e suas estruturas
        map.getLayers().getArray().forEach(layer => {
            if (layer instanceof ol.layer.Group) {
                console.log('Grupo:', layer.get('title'));
                layer.getLayers().forEach(sublayer => {
                    console.log('  - Subcamada:', sublayer.get('title'));
                });
            } else {
                console.log('Camada:', layer.get('title'));
            }
        });

        // Configurar visibilidade inicial
        map.getLayers().getArray().forEach(layer => {
            const title = layer.get('title');
            if (title === 'Google Hybrid' || title === 'IMOVEL PRIMAVERA') {
                layer.setVisible(true);
            } else if (layer instanceof ol.layer.Group) {
                layer.setVisible(false);
                layer.getLayers().forEach(sublayer => {
                    sublayer.setVisible(false);
                });
            } else {
                layer.setVisible(false);
            }
        });

        // Inicializar interface
        initInterface(map);

        return map;
    } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        throw error;
    }
}

// Inicializar o mapa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando aplicação...');
    
    // Verificar se todas as dependências estão carregadas
    if (typeof ol === 'undefined') {
        console.error('OpenLayers não foi carregado!');
        return;
    }
    
    if (typeof proj4 === 'undefined') {
        console.error('Proj4 não foi carregado!');
        return;
    }
    
    if (typeof json_IMOVELPRIMAVERAUTM_19 === 'undefined') {
        console.error('Dados do imóvel não foram carregados!');
        return;
    }
    
    if (typeof style_IMOVELPRIMAVERAUTM_19 === 'undefined') {
        console.error('Estilo do imóvel não foi carregado!');
        return;
    }

    try {
        map = initMap();
        console.log('Mapa inicializado com sucesso');
    } catch (error) {
        console.error('Erro durante a inicialização:', error);
    }
});

function updateCalendarTitle(date) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    document.getElementById('current-month').textContent = `${monthName} ${year}`;
}

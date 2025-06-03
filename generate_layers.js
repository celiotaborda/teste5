const fs = require('fs');
const path = require('path');

// Lista de datas disponíveis
const dates = [
    { day: 14, month: 9, year: 2024 },
    { day: 29, month: 9, year: 2024 },
    { day: 4, month: 10, year: 2024 },
    { day: 19, month: 10, year: 2024 },
    { day: 29, month: 10, year: 2024 },
    { day: 13, month: 11, year: 2024 },
    { day: 18, month: 12, year: 2024 },
    { day: 23, month: 12, year: 2024 },
    { day: 28, month: 12, year: 2024 },
    { day: 2, month: 1, year: 2025 },
    { day: 7, month: 1, year: 2025 },
    { day: 12, month: 1, year: 2025 },
    { day: 17, month: 1, year: 2025 },
    { day: 22, month: 1, year: 2025 },
    { day: 1, month: 2, year: 2025 },
    { day: 11, month: 2, year: 2025 },
    { day: 21, month: 2, year: 2025 },
    { day: 26, month: 2, year: 2025 }
];

// Extensão da imagem (mesma para todas as camadas)
const imageExtent = [497235.869610, 6712247.784580, 506519.854760, 6721476.695520];

// Função para gerar o conteúdo do arquivo JS
function generateLayerJS(index, date, layerType) {
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    
    return `var lyr_${layerType}${day}${month}_${index} = new ol.layer.Image({
    title: '${layerType} ${day}-${month}',
    opacity: 1,
    source: new ol.source.ImageStatic({
        url: "./layers/${layerType}${day}${month}_${index}.png",
        attributions: ' ',
        projection: 'EPSG:31981',
        alwaysInRange: true,
        imageExtent: [${imageExtent.join(', ')}]
    })
});`;
}

// Gerar arquivos para cada tipo de índice
const indices = ['NDRE', 'NDVI', 'GNDVI', 'NDMI', 'SAVI', 'EVI'];

indices.forEach(index => {
    dates.forEach((date, i) => {
        const content = generateLayerJS(i + 1, date, index);
        const filename = `layers/${index}${String(date.day).padStart(2, '0')}${String(date.month).padStart(2, '0')}_${i + 1}.js`;
        
        fs.writeFileSync(filename, content);
        console.log(`Arquivo gerado: ${filename}`);
    });
}); 
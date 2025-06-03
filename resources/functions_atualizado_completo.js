
// Substituição completa da variável INDEX_DATA com suporte para todos os índices e 18 datas padronizadas

const INDEX_DATA = {
  'NDRE': buildIndexData('NDRE', 'Normalized Difference Red Edge - Avalia o teor de clorofila e nitrogênio'),
  'NDVI': buildIndexData('NDVI', 'Normalized Difference Vegetation Index - Avalia o vigor da vegetação'),
  'GNDVI': buildIndexData('GNDVI', 'Green NDVI - Sensível à variação de clorofila'),
  'NDMI': buildIndexData('NDMI', 'Moisture Index - Avalia o conteúdo de água na vegetação'),
  'SAVI': buildIndexData('SAVI', 'Soil Adjusted Vegetation Index - Minimiza a influência do solo'),
  'EVI': buildIndexData('EVI', 'Enhanced Vegetation Index - Otimizado para alta biomassa')
};

function buildIndexData(indexName, description) {
  const baseDates = [
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

  return {
    name: indexName,
    dates: baseDates.map(d => ({
      ...d,
      info: `${indexName} - ${d.day.toString().padStart(2, '0')}/${d.month.toString().padStart(2, '0')}/${d.year}`
    })),
    legend: {
      title: `Índice ${indexName}`,
      description: description,
      ranges: [
        { color: "#d7191c", label: "0.0 - 0.2" },
        { color: "#fdae61", label: "0.2 - 0.4" },
        { color: "#a6d96a", label: "0.4 - 0.6" },
        { color: "#1a9641", label: "0.6 - 1.0" }
      ]
    }
  };
}

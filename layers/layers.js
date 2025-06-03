ol.proj.proj4.register(proj4);
var wms_layers = [];

// Criar camada do imóvel
var lyr_IMOVELPRIMAVERAUTM_19 = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(json_IMOVELPRIMAVERAUTM_19, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:31981'
        })
    }),
    style: style_IMOVELPRIMAVERAUTM_19,
    title: 'IMOVEL PRIMAVERA'
});

// Google Hybrid base layer
var lyr_GoogleHybrid_0 = new ol.layer.Tile({
    title: 'Google Hybrid',
    type: 'base',
    opacity: 1.0,
    source: new ol.source.XYZ({
        attributions: ' &middot; <a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
    })
});

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

// Mapeamento dos índices de arquivo
window.fileIndices = {
    '14-09': '18',
    '29-09': '17',
    '04-10': '16',
    '19-10': '15',
    '29-10': '14',
    '13-11': '13',
    '18-12': '12',
    '23-12': '11',
    '28-12': '10',
    '02-01': '9',
    '07-01': '8',
    '12-01': '7',
    '17-01': '6',
    '22-01': '5',
    '01-02': '4',
    '11-02': '3',
    '21-02': '2',
    '26-02': '1'
};

// Criar grupos apenas para NDRE e NDVI
const indices = ['NDRE', 'NDVI', 'GNDVI', 'NDMI', 'SAVI', 'EVI'];
const groups = {};

indices.forEach(type => {
    groups[type] = new ol.layer.Group({
        layers: [],
        fold: 'close',
        title: type
    });
});

// Função para criar uma camada
function createLayer(type, date) {
    // Verifica se o tipo é válido (apenas NDRE e NDVI)
    if (!indices.includes(type)) {
        console.log(`Tipo de índice não suportado: ${type}`);
        return null;
    }

    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    const dateKey = `${day}-${month}`;
    const fileIndex = window.fileIndices[dateKey];
    
    if (!fileIndex) {
        console.error(`Índice não encontrado para a data ${dateKey}`);
        return null;
    }

    const url = `./layers/${type}${day}${month}_${fileIndex}.png`;
    console.log(`Tentando carregar: ${url}`);

    // Verifica se o arquivo existe antes de criar a camada
    const layer = new ol.layer.Image({
        title: `${type} ${dateKey}`,
        opacity: 1,
        visible: false,
        source: new ol.source.ImageStatic({
            url: url,
            attributions: ' ',
            projection: 'EPSG:31981',
            alwaysInRange: true,
            imageExtent: [497235.869610, 6712247.784580, 506519.854760, 6721476.695520]
        })
    });

    // Adiciona handlers de erro e sucesso
    layer.getSource().on('imageloadstart', function() {
        console.log(`Iniciando carregamento: ${url}`);
    });
    
    layer.getSource().on('imageloadend', function() {
        console.log(`Carregamento bem sucedido: ${url}`);
    });
    
    layer.getSource().on('imageloaderror', function() {
        console.error(`Erro ao carregar: ${url}`);
    });

    return layer;
}

// Criar camadas para cada tipo e data
indices.forEach(type => {
    dates.forEach(date => {
        const layer = createLayer(type, date);
        if (layer) {
            groups[type].getLayers().push(layer);
        }
    });
});

// Lista final de camadas
var layersList = [
    lyr_GoogleHybrid_0,
    ...indices.map(type => groups[type]),
    lyr_IMOVELPRIMAVERAUTM_19
];

// Configurar visibilidade inicial
lyr_GoogleHybrid_0.setVisible(true);
lyr_IMOVELPRIMAVERAUTM_19.setVisible(true);

// Exportar grupos para uso global
window.layersList = layersList;
window.lyr_GoogleHybrid_0 = lyr_GoogleHybrid_0;
window.lyr_IMOVELPRIMAVERAUTM_19 = lyr_IMOVELPRIMAVERAUTM_19;
indices.forEach(type => {
    window[`group_${type}`] = groups[type];
});

// Configurar campos e labels para a camada do imóvel
lyr_IMOVELPRIMAVERAUTM_19.set('fieldAliases', {
    'id': 'id',
    'Name': 'Name',
    'descriptio': 'descriptio',
    'timestamp': 'timestamp',
    'begin': 'begin',
    'end': 'end',
    'altitudeMo': 'altitudeMo',
    'tessellate': 'tessellate',
    'extrude': 'extrude',
    'visibility': 'visibility',
    'drawOrder': 'drawOrder',
    'icon': 'icon',
    'cod_tema': 'cod_tema',
    'nom_tema': 'nom_tema',
    'cod_imovel': 'cod_imovel',
    'mod_fiscal': 'mod_fiscal',
    'num_area': 'num_area',
    'ind_status': 'ind_status',
    'ind_tipo': 'ind_tipo',
    'des_condic': 'des_condic',
    'municipio': 'municipio',
    'cod_estado': 'cod_estado',
    'dat_criaca': 'dat_criaca',
    'dat_atuali': 'dat_atuali'
});

lyr_IMOVELPRIMAVERAUTM_19.set('fieldImages', {
    'id': 'TextEdit',
    'Name': 'TextEdit',
    'descriptio': 'TextEdit',
    'timestamp': 'TextEdit',
    'begin': 'TextEdit',
    'end': 'TextEdit',
    'altitudeMo': 'TextEdit',
    'tessellate': 'TextEdit',
    'extrude': 'TextEdit',
    'visibility': 'TextEdit',
    'drawOrder': 'TextEdit',
    'icon': 'TextEdit',
    'cod_tema': 'TextEdit',
    'nom_tema': 'TextEdit',
    'cod_imovel': 'TextEdit',
    'mod_fiscal': 'TextEdit',
    'num_area': 'TextEdit',
    'ind_status': 'TextEdit',
    'ind_tipo': 'TextEdit',
    'des_condic': 'TextEdit',
    'municipio': 'TextEdit',
    'cod_estado': 'TextEdit',
    'dat_criaca': 'TextEdit',
    'dat_atuali': 'TextEdit'
});

lyr_IMOVELPRIMAVERAUTM_19.set('fieldLabels', {
    'id': 'no label',
    'Name': 'no label',
    'descriptio': 'no label',
    'timestamp': 'no label',
    'begin': 'no label',
    'end': 'no label',
    'altitudeMo': 'no label',
    'tessellate': 'no label',
    'extrude': 'no label',
    'visibility': 'no label',
    'drawOrder': 'no label',
    'icon': 'no label',
    'cod_tema': 'no label',
    'nom_tema': 'no label',
    'cod_imovel': 'no label',
    'mod_fiscal': 'no label',
    'num_area': 'no label',
    'ind_status': 'no label',
    'ind_tipo': 'no label',
    'des_condic': 'no label',
    'municipio': 'no label',
    'cod_estado': 'no label',
    'dat_criaca': 'no label',
    'dat_atuali': 'no label'
});
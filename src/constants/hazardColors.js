const D3_CATEGORY20 = [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5",
    "#F1B0A7"
];

const D3_CATEGORY20B = [
    // blues
    '#393b79',
    '#5254a4',
    '#6b6ecf',
    '#9c9ede',
    // green
    '#637939',
    '#8ca252',
    '#b5cf6b',
    '#cedb9c',
    // yellows
    '#8c6d31',
    '#bd9e39',
    '#e7ba52',
    '#e7cb94',
    // reds
    '#843c39',
    '#ad494a',
    '#d6616b',
    '#e7969c',
    // purple
    '#7b4173',
    '#a55194',
    '#ce6dbd',
    '#de9ed6',

]

const D3_CATEGORY20B_RANGE = [
    [
     // '#393b79',
     '#f5f5f8', 
     '#ebebf2', 
     '#cecede', 
     '#b0b1c9', 
     '#7476a1', 
     '#393b79', 
     '#33356d', 
     '#2b2c5b', 
     '#222349', 
     '#1c1d3b'
    ],
    [
    // '#5254a4'
    '#f6f6fa', 
    '#eeeef6', 
    '#d4d4e8', 
    '#babbdb', 
    '#8687bf', 
    '#5254a4', 
    '#4a4c94', 
    '#3e3f7b', 
    '#313262', 
    '#282950'
    ]

]



const D3_CATEGORY20_RANGE = [
    [
        "#219bde",
        "#1f78b7",
        "#205f95",
        "#1d4278",
        "#17416b"],
    [
        "#aec7e8",
        "#9eb6d7",
        "#899ebf",
        "#7d8aa5",
        "#747f9b",
        "#546073",
    ],
    [
        "#ff7f0e",
        "#d66b0e",
        "#af3c27",
        "#91490d",
        "#632d08",
    ],
    [
        "#ffbb78",
        "#d79871",
        "#aa7b55",
        "#896345",
        "#6e4c37",
    ],
    [
        "#27ca27",
        "#2dab2d",
        "#227622",
        "#1d631d",
        "#164b16"
    ],
    [
        "#98df8a",
        "#6cad5e",
        "#6da25f",
        "#537c49",
        "#425d3d",
    ],
    [
        "#d62728",
        "#b62627",
        "#991f20",
        "#691515",
        "#491010",
    ],
    [
        "#ff9896",
        "#d3716f",
        "#9c5654",
        "#784442",
        "#5c3130",
    ],
    [
        "#9467bd",
        "#6c4992",
        "#5a3d75",
        "#442e5d",
        "#3e314b",
    ],
    [
        "#c5b0d5",
        "#9a8aaa",
        "#7f708f",
        "#574f65",
        "#433e4b",
    ],
    [
        "#8c564b",
        "#703c38",
        "#5d302e",
        "#482424",
        "#361b1b",
    ],
    [
        "#c49c94",
        "#a9827a",
        "#8d6867",
        "#745151",
        "#53403d",
    ],
    [
        "#e377c2",
        "#bd5f9d",
        "#a05283",
        "#874473",
        "#703853",
    ],
    [
        "#f7b6d2",
        "#de9eb9",
        "#bf849b",
        "#a27584",
        "#7a545f",
    ],
    [
        "#7f7f7f",
        "#656565",
        "#505050",
        "#414141",
        "#313131",
    ],
    [
        "#c7c7c7",
        "#aaaaaa",
        "#969696",
        "#7f7f7f",
        "#6f6f6f",
    ],
    [
        "#bcbd22",
        "#a3a422",
        "#88891e",
        "#74751e",
        "#494a13",
    ],
    [
        "#dbdb8d",
        "#bbbb76",
        "#a2a262",
        "#7f7f4e",
        "#616137",
    ],
    [
        "#17becf",
        "#179eaf",
        "#167a8a",
        "#136d7c",
        "#0e5360",
    ],
    [
        "#9edae5",
        "#7fb6c1",
        "#648c96",
        "#4f6e76",
        "#41565d",
    ],
    [
        "#F1B0A7",
        "#E3604F",
        "#9F2819",
        "#691812",
        "#58160E",
    ]
];
const hazardcolors = {
    'wind': D3_CATEGORY20[4],
    'wind_range': D3_CATEGORY20_RANGE[4],
    'wildfire': D3_CATEGORY20[1],
    'wildfire_range': D3_CATEGORY20_RANGE[1],
    'tsunami': D3_CATEGORY20[2],
    'tsunami_range': D3_CATEGORY20_RANGE[2],
    'tornado': D3_CATEGORY20[3],
    'tornado_range': D3_CATEGORY20_RANGE[3],
    'riverine': D3_CATEGORY20[19],
    'riverine_range': D3_CATEGORY20_RANGE[19],
    'lightning': D3_CATEGORY20[5],
    'lightning_range': D3_CATEGORY20_RANGE[5],
    'landslide': D3_CATEGORY20[6],
    'landslide_range': D3_CATEGORY20_RANGE[6],
    'icestorm': D3_CATEGORY20[7],
    'icestorm_range': D3_CATEGORY20_RANGE[7],
    'hurricane': D3_CATEGORY20[8],
    'hurricane_range': D3_CATEGORY20_RANGE[8],
    'heatwave': D3_CATEGORY20[9],
    'heatwave_range': D3_CATEGORY20_RANGE[9],
    'hail': D3_CATEGORY20[0],
    'hail_range': D3_CATEGORY20_RANGE[0],
    'earthquake': D3_CATEGORY20[11],
    'earthquake_range': D3_CATEGORY20_RANGE[11],
    'drought': D3_CATEGORY20[12],
    'drought_range': D3_CATEGORY20_RANGE[12],
    'avalanche': D3_CATEGORY20[13],
    'avalanche_range': D3_CATEGORY20_RANGE[13],
    'coldwave': D3_CATEGORY20[14],
    'coldwave_range': D3_CATEGORY20_RANGE[14],
    'winterweat': D3_CATEGORY20[15],
    'winterweat_range': D3_CATEGORY20_RANGE[15],
    'volcano': D3_CATEGORY20[16],
    'volcano_range': D3_CATEGORY20_RANGE[16],
    'coastal': D3_CATEGORY20[17],
    'coastal_range': D3_CATEGORY20_RANGE[17],
    'all': D3_CATEGORY20[20],
    'all_range': D3_CATEGORY20_RANGE[20]
};

export default hazardcolors
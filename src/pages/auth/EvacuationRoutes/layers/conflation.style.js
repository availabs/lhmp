export const ConflationSource = {
    id: 'conflationSource',
    source: {
        type: 'vector',
        // url: 'mapbox://am3081.7lr7yxgk'
        // url: 'mapbox://am3081.942osjvb'
        url: 'mapbox://am3081.28vx3kjs'
    }
}


export const ConflationCountsSource = {
    id: 'conflationCountsSource',
    source: {
        type: 'vector',
        url: 'mapbox://am3081.8uf9f2hr'
    }
}

const NETWORK_LEVEL = "n",
    WIDTH_MULT = 1,
    OFFSET_MULT = 1;

export const npmrdsPaint = {
    'line-width': [
        "interpolate",
        ["exponential", 1.7],
        ["zoom"],
        5,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], WIDTH_MULT],
            [10, 0],
            1.2,
            [5, 15],
            1.2,
            [20, 30, 40],
            0.5,
            [25, 35, 45],
            0.5,
            [50, 60],
            0,
            [55, 65],
            0,
            [70, 80],
            0,
            [75, 85],
            0,
            1
        ],
        10,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], WIDTH_MULT],
            [10, 0],
            3,
            [5, 15],
            3,
            [20, 30, 40],
            0.75,
            [25, 35, 45],
            0.75,
            [50, 60],
            0,
            [55, 65],
            0,
            [70, 80],
            0,
            [75, 85],
            0,
            1
        ],
        12,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], WIDTH_MULT],
            [10, 0],
            4,
            [5, 15],
            4,
            [20, 30, 40],
            2.5,
            [25, 35, 45],
            2,
            [50, 60],
            0.5,
            [55, 65],
            0.5,
            [70, 80],
            0,
            [75, 85],
            0,
            1
        ],
        14,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], WIDTH_MULT],
            [10, 0],
            6,
            [5, 15],
            6,
            [20, 30, 40],
            3,
            [25, 35, 45],
            6,
            [50, 60],
            2,
            [55, 65],
            1,
            [70, 80],
            1,
            [75, 85],
            1,
            1
        ],
        18,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], WIDTH_MULT],
            [10, 0],
            32,
            [5, 15],
            32,
            [20, 30, 40],
            32,
            [25, 35, 45],
            32,
            [50, 60],
            16.5,
            [55, 65],
            24,
            [70, 80],
            1,
            [75, 85],
            1,
            1
        ]
    ],

    'line-opacity': [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.4,
        1
    ],

    'line-color': 'rgba(200, 200, 200, 0.05)',

    'line-offset': [
        "interpolate",
        ["exponential", 1.7],
        ["zoom"],
        10,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], OFFSET_MULT],
            [10, 0],
            1,
            [5, 15],
            1,
            [20, 30, 40],
            1,
            [25, 35, 45],
            .75,
            [50, 60],
            0,
            [55, 65],
            0,
            [70, 80],
            0,
            [75, 85],
            0,
            1
        ],
        12,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], OFFSET_MULT],
            [10, 0],
            1.8,
            [5, 15],
            1.8,
            [20, 30, 40],
            2,
            [25, 35, 45],
            0,
            [50, 60],
            0.1,
            [55, 65],
            0,
            [70, 80],
            0,
            [75, 85],
            0,
            1
        ],
        14,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], OFFSET_MULT],
            [10, 0],
            3,
            [5, 15],
            0,
            [20, 30, 40],
            1.5,
            [25, 35, 45],
            0,
            [50, 60],
            1.1,
            [55, 65],
            1,
            [70, 80],
            0.5,
            [75, 85],
            0,
            1
        ],
        18,
        [
            "match",
            ["*", ["number", ["get", NETWORK_LEVEL]], OFFSET_MULT],
            [10, 0],
            0,
            [5, 15],
            0,
            [20, 30, 40],
            16,
            [25, 35, 45],
            0,
            [50, 60],
            8,
            [55, 65],
            0,
            [70, 80],
            1,
            [75, 85],
            0,
            1
        ]
    ]
}

export const ConflationStyle =  {
    "id": "conflation",
    "type": "line",
    "source": "conflationSource",
    "source-layer": "network_conflation",
    beneath: 'road-label',
    layout: {
        'visibility': 'visible',
        'line-join': 'round',
        'line-cap': 'round'
    },
    paint: npmrdsPaint

};

export const ConflationRouteStyle =  {
    "id": "conflation-route",
    "type": "line",
    "source": "conflationCountsSource",
    "source-layer": "network_conflation",
    beneath: 'road-label',
    layout: {
        'visibility': 'visible',
        'line-join': 'round',
        'line-cap': 'round'
    },
    paint: npmrdsPaint

};

export const ConflationCountsStyle =  {
    "id": "conflation-counts",
    "type": "line",
    "source": "conflationCountsSource",
    "source-layer": "network_conflation",
    beneath: 'road-label',
    layout: {
        'visibility': 'visible',
        'line-join': 'round',
        'line-cap': 'round'
    },
    paint: npmrdsPaint

};

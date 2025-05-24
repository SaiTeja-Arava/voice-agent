export enum RGB_PATTERN_PROPERTIES {
    PATTERN_SPEED = 0,
    PATTERN_LENGTH = 1,
    COLOR_TRANSITION_INTERVAL = 2,
    RAINBOW_INTERVAL = 3,
    BREATHING_INTERVAL = 4,
    PIN_BALL_SIZE = 5,
    PATTERN_DIRECTION = 6,
    STREAM_SMOOTHNESS = 7,
    STROBE_COUNT = 8,
    FIRE_COOL_DOWN = 9,
    FIRE_IGNITION = 10,
    THEATRE_SPACING = 11,
    RAINBOW_SMOOTHNESS = 12,
    PULSE_SIZE = 13,
    COLOR_RANDOM = 14,
    IS_RAINBOW = 15,
    FLOW_TYPE = 16,
}

export const RGB_PATTERN_PROPERTIES_STR = {
    0: "PATTERN_SPEED",
    1: "PATTERN_LENGTH",
    2: "COLOR_TRANSITION_INTERVAL",
    3: "RAINBOW_INTERVAL",
    4: "BREATHING_INTERVAL",
    5: "PIN_BALL_SIZE",
    6: "PATTERN_DIRECTION",
    7: "STREAM_SMOOTHNESS",
    8: "STROBE_COUNT",
    9: "FIRE_COOL_DOWN",
    10: "FIRE_IGNITION",
    11: "THEATRE_SPACING",
    12: "RAINBOW_SMOOTHNESS",
    13: "PULSE_SIZE",
    14: "COLOR_RANDOM",
    15: "IS_RAINBOW",
    16: "FLOW_TYPE",
}

export enum RGB_PATTERNS {
    STATIC = 0,
    RAINBOW = 1,
    BREATHING = 2,
    STREAM = 3,
    METEOR_RAIN = 4,
    PULSE = 5,
    VIBE = 6,
    STROBE = 7,
    TWINKLE = 8,
    SPARKLE = 9,
    FIRE = 10,
    THEATRE_CHASE = 11,
    COLOR_WIPE = 12,
    PINBALL = 13,
    COMET = 14,
    RAINBOW_CYCLE = 15,
    COLOR_FLASH = 16,
    THEATRE_CHASE_RAINBOW = 17,
    STRIP_TESTER = 18,
    COLOR_GRADIENT = 19,
    BREATHING_ADDRESSABLE = 20,
    STATIC_ADDRESSABLE = 21,
    RAINBOW_ADDRESSABLE = 22,
    SHUFFLE = 23,
}

export const RGB_PATTERNS_STR = {
    0: "STATIC",
    1: "RAINBOW",
    2: "BREATHING",
    3: "STREAM",
    4: "METEOR_RAIN",
    5: "PULSE",
    6: "VIBE",
    7: "STROBE",
    8: "TWINKLE",
    9: "SPARKLE",
    10: "FIRE",
    11: "THEATRE_CHASE",
    12: "COLOR_WIPE",
    13: "PINBALL",
    14: "COMET",
    15: "RAINBOW_CYCLE",
    16: "COLOR_FLASH",
    17: "THEATRE_CHASE_RAINBOW",
    18: "STRIP_TESTER",
    19: "COLOR_GRADIENT",
    20: "BREATHING_ADDRESSABLE",
    21: "STATIC_ADDRESSABLE",
    22: "RAINBOW_ADDRESSABLE",
    23: "SHUFFLE",
}

export enum rgbPatternTypeList {
    unaddressable = 1,
    addressable = 2,
}
interface pattern {
    patternId: number,
    patternName: string,
    minNumberOfColors: number,
    maxNumberOfColors: number,
    PatternType: number,
    patternProperties: Array<
        { id: number, minMaxValues: Array<number> }
    >
}

const rgbPatternsList: Array<pattern> = [
    {
        patternId: RGB_PATTERNS.STATIC,
        patternName: "Static",
        minNumberOfColors: 1,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.unaddressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.COLOR_TRANSITION_INTERVAL, minMaxValues: [] }
        ]
    },
    {
        patternId: RGB_PATTERNS.RAINBOW,
        patternName: "Rainbow",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.unaddressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.RAINBOW_INTERVAL, minMaxValues: [] }
        ]
    },
    {
        patternId: RGB_PATTERNS.BREATHING,
        patternName: "BREATHING",
        minNumberOfColors: 1,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.unaddressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.BREATHING_INTERVAL, minMaxValues: [] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }
        ]

    },
    {
        patternId: RGB_PATTERNS.STATIC_ADDRESSABLE,
        patternName: "Static Addressable",
        minNumberOfColors: 1,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 255] },
            { id: RGB_PATTERN_PROPERTIES.FLOW_TYPE, minMaxValues: [0, 3] },  //0 for disable fill animation, 1 for edge fill, 2 for diverge, 3 for converge
            { id: RGB_PATTERN_PROPERTIES.PATTERN_DIRECTION, minMaxValues: [0, 1] } //0 for strip default direction, 1 to reverse
        ]
    },
    {
        patternId: RGB_PATTERNS.SHUFFLE,
        patternName: "Shuffle",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.unaddressable,
        patternProperties: []
    },
    {
        patternId: RGB_PATTERNS.RAINBOW_ADDRESSABLE,
        patternName: "Rainbow Addressable",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.RAINBOW_INTERVAL, minMaxValues: [0, 90] }
        ]
    },

    {
        patternId: RGB_PATTERNS.BREATHING_ADDRESSABLE,
        patternName: "BREATHING ADDRESSABLE",
        minNumberOfColors: 1,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 20] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }
        ]

    },
    {
        patternId: RGB_PATTERNS.STREAM,
        patternName: "STREAM",
        minNumberOfColors: 2,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 20] },
            { id: RGB_PATTERN_PROPERTIES.STREAM_SMOOTHNESS, minMaxValues: [5, 20] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }
        ]

    },
    {
        patternId: RGB_PATTERNS.METEOR_RAIN,
        patternName: "METEOR_RAIN",
        minNumberOfColors: 1,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 60] }
        ]

    },
    {
        patternId: RGB_PATTERNS.PULSE,
        patternName: "PULSE",
        minNumberOfColors: 2,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 120] },
            { id: RGB_PATTERN_PROPERTIES.PULSE_SIZE, minMaxValues: [5, 20] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }

        ]

    },
    {
        patternId: RGB_PATTERNS.VIBE,
        patternName: "VIBE",
        minNumberOfColors: 1,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [] }
        ]

    },
    {
        patternId: RGB_PATTERNS.STROBE,
        patternName: "STROBE",
        minNumberOfColors: 1,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 20] },
            { id: RGB_PATTERN_PROPERTIES.STROBE_COUNT, minMaxValues: [1, 20] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }
        ]
    },
    {
        patternId: RGB_PATTERNS.TWINKLE,
        patternName: "TWINKLE",
        minNumberOfColors: 1,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 50] }
        ]

    },
    {
        patternId: RGB_PATTERNS.SPARKLE,
        patternName: "SPARKLE",
        minNumberOfColors: 0,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            // {id:RGB_PATTERN_PROPERTIES.PATTERN_SPEED,minMaxValues:[]}
            { id: RGB_PATTERN_PROPERTIES.COLOR_RANDOM, minMaxValues: [0, 1] }
        ]

    },
    {
        patternId: RGB_PATTERNS.FIRE,
        patternName: "FIRE",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [] },
            { id: RGB_PATTERN_PROPERTIES.FIRE_COOL_DOWN, minMaxValues: [20, 50] },
            { id: RGB_PATTERN_PROPERTIES.FIRE_IGNITION, minMaxValues: [50, 200] }
        ]

    },
    {
        patternId: RGB_PATTERNS.THEATRE_CHASE,
        patternName: "THEATRE_CHASE",
        minNumberOfColors: 1,
        maxNumberOfColors: 1,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [30, 100] },
            { id: RGB_PATTERN_PROPERTIES.THEATRE_SPACING, minMaxValues: [3, 15] }
        ]

    },
    {
        patternId: RGB_PATTERNS.COLOR_WIPE,
        patternName: "COLOR_WIPE",
        minNumberOfColors: 1,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 60] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }
        ]

    },
    {
        patternId: RGB_PATTERNS.PINBALL,
        patternName: "PINBALL",
        minNumberOfColors: 1,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 60] },
            { id: RGB_PATTERN_PROPERTIES.PIN_BALL_SIZE, minMaxValues: [3, 10] }
        ]

    },
    {
        patternId: RGB_PATTERNS.COMET,
        patternName: "COMET",
        minNumberOfColors: 2,
        maxNumberOfColors: 2,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 100] }
        ]

    },
    {
        patternId: RGB_PATTERNS.RAINBOW_CYCLE,
        patternName: "RAINBOW_CYCLE",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.STREAM_SMOOTHNESS, minMaxValues: [5, 20] },
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 20] }
        ]

    },
    {
        patternId: RGB_PATTERNS.COLOR_FLASH,
        patternName: "COLOR_FLASH",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [20, 200] }
        ]

    },
    {
        patternId: RGB_PATTERNS.THEATRE_CHASE_RAINBOW,
        patternName: "THEATRE_CHASE_RAINBOW",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [20, 100] }
        ]

    },
    {
        patternId: RGB_PATTERNS.STRIP_TESTER,
        patternName: "STRIP_TESTER",
        minNumberOfColors: 0,
        maxNumberOfColors: 0,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_LENGTH, minMaxValues: [] }
        ]

    },
    {
        patternId: RGB_PATTERNS.COLOR_GRADIENT,
        patternName: "COLOR_GRADIENT",
        minNumberOfColors: 2,
        maxNumberOfColors: 7,
        PatternType: rgbPatternTypeList.addressable,
        patternProperties: [
            { id: RGB_PATTERN_PROPERTIES.PATTERN_SPEED, minMaxValues: [0, 90] },
            { id: RGB_PATTERN_PROPERTIES.IS_RAINBOW, minMaxValues: [0, 1] }
        ]

    }
]

const patternMap = new Map(rgbPatternsList.map((pattern) => [pattern.patternId, pattern]))
export default patternMap


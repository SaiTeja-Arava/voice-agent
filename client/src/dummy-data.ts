import { cloudNats } from "./nats.js";

export const SupportedDeviceList = {
    5: [2,]
}

export const patterns = [
    {
        "patternId": 0,
        "patternName": "Static",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 1,
        "PatternType": 1,
        "patternProperties": [
            {
                "name": "COLOR_TRANSITION_INTERVAL",
                "minMaxValues": []
            }
        ]
    },
    {
        "patternId": 1,
        "patternName": "Rainbow",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 1,
        "patternProperties": [
            {
                "name": "RAINBOW_INTERVAL",
                "minMaxValues": []
            }
        ]
    },
    {
        "patternId": 2,
        "patternName": "BREATHING",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 1,
        "PatternType": 1,
        "patternProperties": [
            {
                "name": "BREATHING_INTERVAL",
                "minMaxValues": []
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 21,
        "patternName": "Static Addressable",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 1,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    255
                ]
            },
            {
                "name": "FLOW_TYPE",
                "minMaxValues": [
                    0,
                    3
                ]
            },
            {
                "name": "PATTERN_DIRECTION",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 23,
        "patternName": "Shuffle",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 1,
        "patternProperties": []
    },
    {
        "patternId": 22,
        "patternName": "Rainbow Addressable",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "RAINBOW_INTERVAL",
                "minMaxValues": [
                    0,
                    90
                ]
            }
        ]
    },
    {
        "patternId": 20,
        "patternName": "BREATHING ADDRESSABLE",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    20
                ]
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 3,
        "patternName": "STREAM",
        "minNumberOfColors": 2,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    20
                ]
            },
            {
                "name": "STREAM_SMOOTHNESS",
                "minMaxValues": [
                    5,
                    20
                ]
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 4,
        "patternName": "METEOR_RAIN",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 1,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    60
                ]
            }
        ]
    },
    {
        "patternId": 5,
        "patternName": "PULSE",
        "minNumberOfColors": 2,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    120
                ]
            },
            {
                "name": "PULSE_SIZE",
                "minMaxValues": [
                    5,
                    20
                ]
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 6,
        "patternName": "VIBE",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": []
            }
        ]
    },
    {
        "patternId": 7,
        "patternName": "STROBE",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    20
                ]
            },
            {
                "name": "STROBE_COUNT",
                "minMaxValues": [
                    1,
                    20
                ]
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 8,
        "patternName": "TWINKLE",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 1,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    50
                ]
            }
        ]
    },
    {
        "patternId": 9,
        "patternName": "SPARKLE",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 1,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "COLOR_RANDOM",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 10,
        "patternName": "FIRE",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": []
            },
            {
                "name": "FIRE_COOL_DOWN",
                "minMaxValues": [
                    20,
                    50
                ]
            },
            {
                "name": "FIRE_IGNITION",
                "minMaxValues": [
                    50,
                    200
                ]
            }
        ]
    },
    {
        "patternId": 11,
        "patternName": "THEATRE_CHASE",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 1,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    30,
                    100
                ]
            },
            {
                "name": "THEATRE_SPACING",
                "minMaxValues": [
                    3,
                    15
                ]
            }
        ]
    },
    {
        "patternId": 12,
        "patternName": "COLOR_WIPE",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    60
                ]
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    },
    {
        "patternId": 13,
        "patternName": "PINBALL",
        "minNumberOfColors": 1,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    60
                ]
            },
            {
                "name": "PIN_BALL_SIZE",
                "minMaxValues": [
                    3,
                    10
                ]
            }
        ]
    },
    {
        "patternId": 14,
        "patternName": "COMET",
        "minNumberOfColors": 2,
        "maxNumberOfColors": 2,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    100
                ]
            }
        ]
    },
    {
        "patternId": 15,
        "patternName": "RAINBOW_CYCLE",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "STREAM_SMOOTHNESS",
                "minMaxValues": [
                    5,
                    20
                ]
            },
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    20
                ]
            }
        ]
    },
    {
        "patternId": 16,
        "patternName": "COLOR_FLASH",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    20,
                    200
                ]
            }
        ]
    },
    {
        "patternId": 17,
        "patternName": "THEATRE_CHASE_RAINBOW",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    20,
                    100
                ]
            }
        ]
    },
    {
        "patternId": 18,
        "patternName": "STRIP_TESTER",
        "minNumberOfColors": 0,
        "maxNumberOfColors": 0,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_LENGTH",
                "minMaxValues": []
            }
        ]
    },
    {
        "patternId": 19,
        "patternName": "COLOR_GRADIENT",
        "minNumberOfColors": 2,
        "maxNumberOfColors": 7,
        "PatternType": 2,
        "patternProperties": [
            {
                "name": "PATTERN_SPEED",
                "minMaxValues": [
                    0,
                    90
                ]
            },
            {
                "name": "IS_RAINBOW",
                "minMaxValues": [
                    0,
                    1
                ]
            }
        ]
    }
]

export const scenes = [
    {
        "scene_id": "3PsWpGjXvC-150",
        "scene_room": "Work Station ",
        "scene_name": "All off"
    },
    {
        "scene_id": "3PsWpGjXvC-151",
        "scene_room": "Work Station ",
        "scene_name": "Bright"
    },
    {
        "scene_id": "3PsWpGjXvC-152",
        "scene_room": "Work Station ",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Q0qNqnpZeX-150",
        "scene_room": "Testing Room",
        "scene_name": "All off"
    },
    {
        "scene_id": "Q0qNqnpZeX-151",
        "scene_room": "Testing Room",
        "scene_name": "Bright"
    },
    {
        "scene_id": "Q0qNqnpZeX-152",
        "scene_room": "Testing Room",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Q0qNqnpZeX-154",
        "scene_room": "Testing Room",
        "scene_name": "Night"
    },
    {
        "scene_id": "8ECsRiSXOw-150",
        "scene_room": "Conference Room",
        "scene_name": "All off"
    },
    {
        "scene_id": "8ECsRiSXOw-151",
        "scene_room": "Conference Room",
        "scene_name": "Bright"
    },
    {
        "scene_id": "8ECsRiSXOw-152",
        "scene_room": "Conference Room",
        "scene_name": "Relax"
    },
    {
        "scene_id": "8ECsRiSXOw-153",
        "scene_room": "Conference Room",
        "scene_name": "Day"
    },
    {
        "scene_id": "3PsWpGjXvC-153",
        "scene_room": "Work Station ",
        "scene_name": "All off"
    },
    {
        "scene_id": "3PsWpGjXvC-154",
        "scene_room": "Work Station ",
        "scene_name": "Bright"
    },
    {
        "scene_id": "3PsWpGjXvC-155",
        "scene_room": "Work Station ",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Z9a4HMfeJQ-150",
        "scene_room": "Hardware room",
        "scene_name": "All off"
    },
    {
        "scene_id": "Z9a4HMfeJQ-151",
        "scene_room": "Hardware room",
        "scene_name": "Bright"
    },
    {
        "scene_id": "Z9a4HMfeJQ-152",
        "scene_room": "Hardware room",
        "scene_name": "Relax"
    },
    {
        "scene_id": "3PsWpGjXvC-156",
        "scene_room": "Work Station ",
        "scene_name": "All off"
    },
    {
        "scene_id": "3PsWpGjXvC-157",
        "scene_room": "Work Station ",
        "scene_name": "Bright"
    },
    {
        "scene_id": "3PsWpGjXvC-158",
        "scene_room": "Work Station ",
        "scene_name": "Relax"
    },
    {
        "scene_id": "FodgNMSBnD-150",
        "scene_room": "Work Station 2",
        "scene_name": "All off"
    },
    {
        "scene_id": "FodgNMSBnD-151",
        "scene_room": "Work Station 2",
        "scene_name": "Bright"
    },
    {
        "scene_id": "Home-150",
        "scene_room": "Home",
        "scene_name": "All off"
    },
    {
        "scene_id": "Home-151",
        "scene_room": "Home",
        "scene_name": "Bright"
    },
    {
        "scene_id": "l0sJl9OL8M-150",
        "scene_room": "Dark Room",
        "scene_name": "All off"
    },
    {
        "scene_id": "l0sJl9OL8M-151",
        "scene_room": "Dark Room",
        "scene_name": "Bright"
    },
    {
        "scene_id": "Vde6I0HZCc-150",
        "scene_room": "Cabin 2",
        "scene_name": "All off"
    },
    {
        "scene_id": "Vde6I0HZCc-151",
        "scene_room": "Cabin 2",
        "scene_name": "Bright"
    },
    {
        "scene_id": "Vde6I0HZCc-152",
        "scene_room": "Cabin 2",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Home-152",
        "scene_room": "Home",
        "scene_name": "Relax"
    },
    {
        "scene_id": "oFm5455ISu-150",
        "scene_room": "Manish cabin",
        "scene_name": "All off"
    },
    {
        "scene_id": "oFm5455ISu-151",
        "scene_room": "Manish cabin",
        "scene_name": "Bright"
    },
    {
        "scene_id": "oFm5455ISu-152",
        "scene_room": "Manish cabin",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Je9sYeG3NA-150",
        "scene_room": "Assembly Room",
        "scene_name": "All off"
    },
    {
        "scene_id": "Je9sYeG3NA-151",
        "scene_room": "Assembly Room",
        "scene_name": "Bright"
    },
    {
        "scene_id": "Je9sYeG3NA-152",
        "scene_room": "Assembly Room",
        "scene_name": "Relax"
    },
    {
        "scene_id": "3PsWpGjXvC-159",
        "scene_room": "Work Station ",
        "scene_name": "All off"
    },
    {
        "scene_id": "3PsWpGjXvC-160",
        "scene_room": "Work Station ",
        "scene_name": "Bright"
    },
    {
        "scene_id": "3PsWpGjXvC-161",
        "scene_room": "Work Station ",
        "scene_name": "Relax"
    },
    {
        "scene_id": "FodgNMSBnD-152",
        "scene_room": "Work Station 2",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Home-153",
        "scene_room": "Home",
        "scene_name": "Night"
    },
    {
        "scene_id": "3PsWpGjXvC-162",
        "scene_room": "Work Station ",
        "scene_name": "Night"
    },
    {
        "scene_id": "3PsWpGjXvC-163",
        "scene_room": "Work Station ",
        "scene_name": "Night"
    },
    {
        "scene_id": "FodgNMSBnD-153",
        "scene_room": "Work Station 2",
        "scene_name": "Night"
    },
    {
        "scene_id": "FodgNMSBnD-155",
        "scene_room": "Work Station 2",
        "scene_name": "Raghu scene "
    },
    {
        "scene_id": "l0sJl9OL8M-152",
        "scene_room": "Dark Room",
        "scene_name": "Relax"
    },
    {
        "scene_id": "Vde6I0HZCc-153",
        "scene_room": "Cabin 2",
        "scene_name": "Day"
    },
    {
        "scene_id": "l0sJl9OL8M-153",
        "scene_room": "Dark Room",
        "scene_name": "Day"
    },
    {
        "scene_id": "Q0qNqnpZeX-156",
        "scene_room": "Testing Room",
        "scene_name": "Day"
    },
    {
        "scene_id": "Q0qNqnpZeX-155",
        "scene_room": "Testing Room",
        "scene_name": "All off"
    },
    {
        "scene_id": "Q0qNqnpZeX-163",
        "scene_room": "Testing Room",
        "scene_name": "Bright"
    },
    {
        "scene_id": "8ECsRiSXOw-156",
        "scene_room": "Conference Room",
        "scene_name": "Ac off"
    },
    {
        "scene_id": "Z9a4HMfeJQ-157",
        "scene_room": "Hardware room",
        "scene_name": "AC off"
    },
    {
        "scene_id": "Z9a4HMfeJQ-159",
        "scene_room": "Hardware room",
        "scene_name": "AC on"
    },
    {
        "scene_id": "FodgNMSBnD-158",
        "scene_room": "Work Station 2",
        "scene_name": "All off"
    },
    {
        "scene_id": "Je9sYeG3NA-154",
        "scene_room": "Assembly Room",
        "scene_name": "Day"
    },
    {
        "scene_id": "Je9sYeG3NA-157",
        "scene_room": "Assembly Room",
        "scene_name": "Night"
    },
    {
        "scene_id": "Z9a4HMfeJQ-160",
        "scene_room": "Hardware room",
        "scene_name": "Day"
    },
    {
        "scene_id": "Z9a4HMfeJQ-161",
        "scene_room": "Hardware room",
        "scene_name": "Night"
    },
    {
        "scene_id": "KuFFBN1K5K-150",
        "scene_room": "Tablet ",
        "scene_name": "All off"
    },
    {
        "scene_id": "Q0qNqnpZeX-153",
        "scene_room": "Testing Room",
        "scene_name": "AC on"
    },
    {
        "scene_id": "Q0qNqnpZeX-200",
        "scene_room": "Testing Room",
        "scene_name": "AC off"
    },
    {
        "scene_id": "69N5CEW4lP-150",
        "scene_room": "Home theatre",
        "scene_name": "All off"
    },
    {
        "scene_id": "69N5CEW4lP-153",
        "scene_room": "Home theatre",
        "scene_name": "Relax"
    },
    {
        "scene_id": "69N5CEW4lP-154",
        "scene_room": "Home theatre",
        "scene_name": "Dolby Atmos"
    },
    {
        "scene_id": "8ECsRiSXOw-165",
        "scene_room": "Conference Room",
        "scene_name": "Night"
    },
    {
        "scene_id": "8ECsRiSXOw-154",
        "scene_room": "Conference Room",
        "scene_name": "AC on"
    },
    {
        "scene_id": "Q0qNqnpZeX-203",
        "scene_room": "Testing Room",
        "scene_name": "Vamshi1"
    },
    {
        "scene_id": "FodgNMSBnD-176",
        "scene_room": "Work Station 2",
        "scene_name": "Bright"
    },
    {
        "scene_id": "3PsWpGjXvC-164",
        "scene_room": "Work Station ",
        "scene_name": "AC on"
    },
    {
        "scene_id": "3PsWpGjXvC-165",
        "scene_room": "Work Station ",
        "scene_name": "AC off"
    },
    {
        "scene_id": "Z9a4HMfeJQ-162",
        "scene_room": "Hardware room",
        "scene_name": "Cool"
    }
]

export const dummyData = [
    {
        "device_id": "CxKv1NnP",
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "cove light",
        "device_room_area": "Main",
        "device_type": "gm_rgbaddressable",
        "capabilities": {
            "onOff": {
                "description": "this is to control the on/off state of the device",
                "current": false,
                "allowedValues": [
                    false,
                    true
                ]
            },
            "brightness": {
                "description": "this is to control the brightness of the device",
                "current": 0,
                "min": 0,
                "max": 100
            },
            "pattern": {
                "description": "this is to control the pattern of the addressable led strip",
                "currentState": {
                    "patternName": "STATIC_ADDRESSABLE",
                    "patternProperties": [
                        {
                            "patternPropertyId": "PATTERN_SPEED",
                            "patternPropertyValue": 120
                        },
                        {
                            "patternPropertyId": "FLOW_TYPE",
                            "patternPropertyValue": 0
                        },
                        {
                            "patternPropertyId": "PATTERN_DIRECTION",
                            "patternPropertyValue": 0
                        }
                    ],
                    "colours": [
                        {
                            "redPercent": 100,
                            "greenPercent": 0,
                            "bluePercent": 0
                        }
                    ]
                },
                "supportedPatterns": [
                    "Static Addressable",
                    "Rainbow Addressable",
                    "BREATHING ADDRESSABLE",
                    "STREAM",
                    "METEOR_RAIN",
                    "PULSE",
                    "VIBE",
                    "STROBE",
                    "TWINKLE",
                    "SPARKLE",
                    "FIRE",
                    "THEATRE_CHASE",
                    "COLOR_WIPE",
                    "PINBALL",
                    "COMET",
                    "RAINBOW_CYCLE",
                    "COLOR_FLASH",
                    "THEATRE_CHASE_RAINBOW",
                    "STRIP_TESTER",
                    "COLOR_GRADIENT"
                ],
                "possibleValues": "Refer patterns object in above message"
            }
        }
    },
    {
        "device_id": "7BZ9Cz0W",
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "Profile",
        "device_room_area": "Main",
        "device_type": "gm_dimmer",
        "capabilities": {
            "onOff": {
                "description": "this is to control the on/off state of the device",
                "current": false,
                "allowedValues": [
                    false,
                    true
                ]
            },
            "brightness": {
                "description": "this is to control the brightness of the device",
                "current": 0,
                "min": 0,
                "max": 100
            }
        }
    },
    {
        "device_id": "cpIEs53S",
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "cove light",
        "device_room_area": "Main",
        "device_type": "gm_rgbwwa",
        "capabilities": {
            "onOff": {
                "description": "this is to control the on/off state of the device",
                "current": false,
                "allowedValues": [
                    false,
                    true
                ]
            },
            "brightness": {
                "description": "this is to control the brightness of the device",
                "current": 0,
                "min": 0,
                "max": 100
            },
            "pattern": {
                "description": "this is to control the pattern of the addressable led strip, here the light can either\n                        warm white colour or to a rgb colour, both cannot be set at a time",
                "current": {
                    "patternName": "STATIC",
                    "patternProperties": [
                        {
                            "patternPropertyId": "COLOR_TRANSITION_INTERVAL",
                            "patternPropertyValue": 250
                        }
                    ],
                    "colour": [
                        {
                            "redPercent": 100,
                            "greenPercent": 0,
                            "bluePercent": 0
                        }
                    ],
                    "wwa": [
                        {
                            "warmWhitePercent": 0,
                            "coolWhitePercent": 0,
                            "amberPercent": 0
                        }
                    ]
                },
                "supportedPatterns": [
                    "Static",
                    "Rainbow",
                    "BREATHING",
                    "Shuffle"
                ]
            }
        }
    },
    {
        "device_id": 20,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "main dimmer",
        "device_room_area": "Main",
        "device_type": "zigbee_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 21,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "Colour Tunable",
        "device_room_area": "Main",
        "device_type": "color_tunable",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            },
            "colorTemperature": {
                "type": "this is a color temperature capability of light, supports color temperature from 2000 to 8000, in kelvin",
                "current": 2000,
                "min": 2000,
                "max": 8000
            }
        }
    },
    {
        "device_id": 22,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "secondary dimmer",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 23,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dining primary dimmer",
        "device_room_area": "Dining",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 25,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dining secondary dinner",
        "device_room_area": "Dining",
        "device_type": "switch",
        "capabilities": {
            "onOff": {
                "description": "this is a switch, 0 means off, 255 means on",
                "current": 0,
                "allowedValues": [
                    0,
                    255
                ]
            }
        }
    },
    {
        "device_id": 27,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dining dimmer",
        "device_room_area": "Dining",
        "device_type": "zigbee_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 20,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "primary dimmer",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 21,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "secondary dimmer",
        "device_room_area": "Main",
        "device_type": "zigbee_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 26,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "washroom light",
        "device_room_area": "Washroom",
        "device_type": "switch",
        "capabilities": {
            "onOff": {
                "description": "this is a switch, 0 means off, 255 means on",
                "current": 0,
                "allowedValues": [
                    0,
                    255
                ]
            }
        }
    },
    {
        "device_id": 27,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "dimmer 3",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 28,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "dimmer 4",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 29,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "dimmer 5",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 30,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "dimmer 6",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 31,
        "device_room_id": "3rHem9k2g6",
        "device_room_name": "Master Bedroom",
        "device_name": "dimmer 7",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 30,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dimmer 8",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 31,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dimmer 3",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 32,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dimmer 4",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    },
    {
        "device_id": 33,
        "device_room_id": "qTlIgG18uL",
        "device_room_name": "Living Room",
        "device_name": "dimmer 5",
        "device_room_area": "Main",
        "device_type": "dali_dimmer",
        "capabilities": {
            "brightness": {
                "description": "this is a dimmable capability, supports brightness level from 0 to 255",
                "current": 0,
                "min": 0,
                "max": 255
            }
        }
    }
]

// (async () => {
//     const siteId = "Keus-9ae6811c-1ae9-4c74-8878-d8986573822d"
//     await cloudNats.start()
//     const detailedInfo = await cloudNats.getDetailedInfo(siteId)
//     console.log("detailed info: ", detailedInfo)

// })
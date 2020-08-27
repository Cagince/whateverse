import { screenToIso } from '../utils';

import pyramidIMG from "../media/pyramid.svg";
import fortressIMG from "../media/fortress.svg";
import magincStonesIMG from "../media/magic_stones.svg";
import townhallIMG from "../media/townhall.svg";
import universityIMG from "../media/university.svg"

export const Rooms = {
    "House of Defiance": {
        src: pyramidIMG,
        coordinates: screenToIso(0,-150),
        urls: {
            jitsi: {
                domain: "meet.jit.si/interspace-metagame",
                roomName: "House of Defiance",
            },
            mozillaHub: {
                externalUrl: "https://hubs.mozilla.com/nKCuNrg/house-of-defiance",
            },
            youtube: {
                videoId: "X5k8Cbr0d44",
                externalUrl: "https://youtu.be/X5k8Cbr0d44",
            },
        },
    },
    "House of DAOs": {
        src: universityIMG,
        coordinates: screenToIso(350, -150),
        urls: {
        jitsi: {
            domain: "meet.jit.si/interspace-metagame",
            roomName: "House of DAOs",
        },
        mozillaHub: {
            externalUrl: "https://hubs.mozilla.com/eJZGNU5/house-of-daos",
        },
        youtube: {
            videoId: "k0UpUwmKaHc",
            externalUrl: "https://youtu.be/k0UpUwmKaHc",
        },
        },
    },
    "House of Adoption": {
        src: townhallIMG,
        coordinates: screenToIso(-350, -150),
        urls: {
        jitsi: {
            domain: "meet.jit.si/interspace-metagame",
            roomName: "House of Adoption",
        },
        mozillaHub: {
            externalUrl: "https://hubs.mozilla.com/tpKKcfA/house-of-adoption",
        },
        youtube: {
            videoId: "_DxQQKrxYFI",
            externalUrl: "https://youtu.be/_DxQQKrxYFI",
        },
        },
    },
    "Stress Test Arena": {
        src: magincStonesIMG,
        coordinates: screenToIso(-350, 200),
        urls: {
        jitsi: {
            domain: "meet.jit.si/interspace-metagame",
            roomName: "Stress Test Arena",
        },
        mozillaHub: {
            externalUrl: "https://hubs.mozilla.com/nx5rV57/stress-test-arena",
        },
        youtube: {
            videoId: "pWfUAjIgoJM",
            externalUrl: "https://youtu.be/pWfUAjIgoJM",
        },
        },
    },
    "Raid Guild": {
        src: fortressIMG,
        coordinates: screenToIso(500, 200),
        urls: {
        jitsi: {
            domain: "meet.jit.si/interspace-metagame",
            roomName: "Raid Guild",
        },
        mozillaHub: {
            externalUrl: "https://hubs.mozilla.com/LmrJQqL/raid-guild",
        },
        youtube: {
            videoId: "f2bnDe5-3mM",
            externalUrl: "https://youtu.be/p7gJTpauAgk",
        },
        },
    },
};
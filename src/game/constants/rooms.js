import defiance from "../media/defiance.png";
import adoption from "../media/adoption.png";
import dao from "../media/dao.png";
import guild from "../media/guild.png";
import pokecenter from "../media/pokecenter.png"
import octo from "../media/octo.png"


export const Rooms = {
    "WhateverseOcto": {
        id: 1,
        src: octo,
        coordinates: [1, 239],
        urls: {
            'loft.radio': {
                domain: "https://loft.radio/",
            },
        },
    },
    "House of Defiance": {
        id: 2,
        src: defiance,
        coordinates: [-393.5, 48],
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
        id: 3,
        src: dao,
        coordinates: [25, -349],
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
        id: 4,
        src: adoption,
        coordinates: [383.5, -8],
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
        id: 5,
        src: pokecenter,
        coordinates: [238, 621],
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
        id: 6,
        src: guild,
        coordinates: [-217, 601],
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
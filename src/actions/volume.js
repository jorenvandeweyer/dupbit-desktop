import loudness from 'loudness';

export default {
    'mute-get': {
        input: null,
        description: 'Get mute',
        execute: async () => {
            const muted = await loudness.getMuted().catch(null);
            console.log('is muted?', muted);
            return muted;
        }
    },
    'volume-get': {
        input: null,
        description: 'Get volume',
        execute: async () => {
            const volume = await loudness.getVolume().catch(null);
            return volume;
        }
    },
    'mute-set': {
        input: {
            type: 'switch',
            default: {
                action: 'mute-get'
            }
        },
        description: 'Set mute',
        execute: async (mute) => {
            if (typeof mute !== 'boolean') {
                mute = true;
            }
            loudness.setMuted(mute);

            return mute;
        },
    },
    'volume-set': {
        input: {
            type: 'slider',
            range: [0, 100],
            default: {
                action: 'volume-get'
            },
        },
        description: 'Set volume',
        execute: async (volume) => {
            if (typeof volume !== 'number') {
                throw 'volume must be a number';
            }

            await loudness.setVolume(volume);

            return volume;
        },
    },
};

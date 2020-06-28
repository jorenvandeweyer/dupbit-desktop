import loudness from 'loudness';

export default {
    'volume-get': {
        input: null,
        description: 'Get volume',
        execute: async () => {
            const volume = await loudness.getVolume().catch(null);
            const muted = await loudness.getMuted().catch(null);

            return { volume, muted };
        }
    },
    'volume-mute': {
        input: true,
        description: 'Mute/Unmute',
        execute: async (mute) => {
            if (typeof mute !== 'boolean') {
                mute = true;
            }

            loudness.setMuted(mute);

            return mute;
        },
    },
    'volume-set': {
        input: 0,
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

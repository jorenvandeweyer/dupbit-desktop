import { exec } from 'child_process';
import lockSystem from 'lock-system';

const isMac = process.platform === 'darwin'

export default {
    'screen-sleep': {
        input: {
            type: 'button'
        },
        description: 'Sleep',
        execute: async () => {
            if (isMac) {
                exec('pmset displaysleepnow');
                return true;
            } else {
                exec("%systemroot%\\system32\\scrnsave.scr /s");
                return true;
            }
        }
    },
    'screen-lock': {
        input: {
            type: 'button'
        },
        description: 'Lock',
        execute: async () => {
            lockSystem();
            return true;
        }
    },
    'screen-unlock': {
        input: {
            type: 'button'
        },
        description: 'Unlock',
        execute: async() => {

        }
    }
};

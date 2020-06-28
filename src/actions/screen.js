import { exec } from 'child_process';
import { powerMonitor } from 'electron';
import lockSystem from 'lock-system';

const isMac = process.platform === 'darwin'

export default {
    'screen-sleep': {
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
        description: 'Lock',
        execute: async () => {
            lockSystem();
            return true;
        }
    },
    'screen-unlock': {
        description: 'Unlock',
        execute: async() => {

        }
    }
};

export const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
    VERBOSE: 'verbose'
  };
  
  export const LOG_DIRECTORY = {
    ERROR: 'logs/error',
    INFO: 'logs/info',
    WARN: 'logs/warn',
    DEBUG: 'logs/debug',
    VERBOSE: 'logs/verbose'
  };

  export const LOG_CONFIG = {
    DATE_PATTERN: 'YYYY-MM-DD',
    MAX_FILES: '30d',
    FILE_EXTENSION: '.log'
  } as const;
  
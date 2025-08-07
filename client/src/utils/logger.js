// client/src/utils/logger.js
export class Logger {
  constructor(enabled = import.meta.env.VITE_LOG_ENABLED === 'true') {
    this.enabled = enabled;
  }
  _ts() { return new Date().toISOString(); }
  log  (...a) { if (this.enabled) console.log(`[${this._ts()}]`, ...a); }
  warn (...a) { if (this.enabled) console.warn(`[WARN ${this._ts()}]`, ...a); }
  error(...a) { if (this.enabled) console.error(`[ERR  ${this._ts()}]`, ...a); }
  enable()  { this.enabled = true;  }
  disable() { this.enabled = false; }
}

// Optional bug.games (bloomplay runtime) integration. The game runs the same without it:
// off-platform every call below is a no-op and the record lives in localStorage.

export class Platform {
  constructor() {
    this.bp = null;
    this.save = null;
    this.onPause = null;
    this.onResume = null;
    this.onMute = null;
  }

  async init() {
    try {
      if (window.parent === window || !window.__bp) return null;
      const bp = await window.__bp;
      if (!bp || !bp.isEmbedded) return null;
      this.bp = bp;
      this.save = bp.save({ key: 'save', cache: 'silk.save.v1' });
      await bp.init({ timeout: 8000 });
      bp.onPause(() => this.onPause && this.onPause());
      bp.onResume(() => this.onResume && this.onResume());
      bp.onMute((m) => this.onMute && this.onMute(m));
      if (this.onMute) this.onMute(!!bp.muted);
      return this.save;
    } catch (e) {
      this.bp = null;
      return null;
    }
  }

  async bestFromSave() {
    if (!this.save) return 0;
    try { await this.save.ready; return Number(this.save.value?.best || 0); } catch (e) { return 0; }
  }

  loading(k, label) { try { this.bp?.loading(k, label); } catch (e) { /* ignore */ } }
  loaded() { try { this.bp?.loaded(); } catch (e) { /* ignore */ } }
  gameplayStart() { try { this.bp?.gameplayStart(); } catch (e) { /* ignore */ } }
  gameplayStop() { try { this.bp?.gameplayStop(); } catch (e) { /* ignore */ } }
  moment(name) {
    this._m = this._m || new Set();
    if (this._m.has(name)) return;
    this._m.add(name);
    try { this.bp?.progress.moment(name); } catch (e) { /* ignore */ }
  }
  saveBest(best) {
    try { if (this.save) this.save.set({ best }); } catch (e) { /* ignore */ }
  }
}

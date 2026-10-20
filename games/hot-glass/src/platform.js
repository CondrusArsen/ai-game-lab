// bug.games (bloomplay runtime) hooks. Every call is a no-op when the game is not embedded on the platform.

export class Platform {
  constructor() { this.bp = null; this.save = null; this.onPause = null; this.onResume = null; this.onMute = null; this.sent = new Set(); }

  async init() {
    try {
      if (window.parent === window || !window.__bp) return null;
      const bp = await window.__bp;
      if (!bp || !bp.isEmbedded) return null;
      this.bp = bp;
      this.save = bp.save({ key: 'save', cache: 'glass.save.v1' });
      await bp.init({ timeout: 8000 });
      bp.onPause(() => this.onPause && this.onPause());
      bp.onResume(() => this.onResume && this.onResume());
      bp.onMute((m) => this.onMute && this.onMute(m));
      if (this.onMute) this.onMute(!!bp.muted);
      return this.save;
    } catch (e) { this.bp = null; return null; }
  }
  async bestFromSave() { try { if (!this.save) return 0; await this.save.ready; return Number(this.save.value?.best || 0); } catch (e) { return 0; } }
  loaded() { try { this.bp?.loaded(); } catch (e) { /* ignore */ } }
  gameplayStart() { try { this.bp?.gameplayStart(); } catch (e) { /* ignore */ } }
  gameplayStop() { try { this.bp?.gameplayStop(); } catch (e) { /* ignore */ } }
  moment(name) { if (this.sent.has(name)) return; this.sent.add(name); try { this.bp?.progress.moment(name); } catch (e) { /* ignore */ } }
  saveBest(best) { try { this.save?.set({ best }); } catch (e) { /* ignore */ } }
}

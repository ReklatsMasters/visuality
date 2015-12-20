export class FrequencyAnalyser {
  /**
   * @param {Function} draw функция отрисовки
   */
  constructor(draw, {interval = 25, fftSize = 256} = {}) {
    this._drawFunc = draw;
    this._interval = interval;
    
    this._context = new AudioContext();
    this._analyser = this._context.createAnalyser();
    this._bands = new Uint8Array(this._analyser.frequencyBinCount);
    
    this._intervalHandle = null;
    this._currentAudioNode = null;
    
    this._analyser.smoothingTimeConstant = 0.3;
    this._analyser.fftSize = fftSize;
    
    this._sourceStore = new WeakMap();  // for Object : Object
  }

  get connected() {
    return this._intervalHandle !== null;
  }
  
  get dataCount() {
    return this._analyser.frequencyBinCount;
  }
  
  /**
   * Return MediaElementAudioSourceNode for this audio node
   */
  source(audioNode) {
    return this._sourceStore.get(audioNode)
  }
  
  add(audioNode) {
    if (this._sourceStore.has(audioNode)) { return; }
    
    var source = this._context.createMediaElementSource(audioNode);
    this._sourceStore.set(audioNode, source);
    
    audioNode.addEventListener('ended', () => {
      // disconnect from stdout to prevent error messages
      source.disconnect(this._context.destination);
    })
  }
  
  /**
   * Подключается к переданному элементу audio и
   * запускает механизм получения характеристик
   * @param {HTMLMediaElement} audioNode элемент audio, 
   *    с потока которого будем снимать характеристики
   */
  connect(audioNode) { // TODO: connect to multiple nodes
    if (this.connected) { return; }

    this._currentAudioNode = audioNode;
    var source = this.source(this._currentAudioNode);
    
    // we can't check connection status to stdout   
    try { source.disconnect(this._context.destination); } catch (e) { }
    
    source.connect(this._analyser);
    this._analyser.connect(this._context.destination);
        
    audioNode.addEventListener('pause', this._onpause);
    audioNode.addEventListener('ended', this._onended);
    audioNode.addEventListener('play', this._onplay);
    
    this._onplay();
  }
  
  /**
   * Отключается от активного узла и прекращает получение характеристик
   */
  disconnect() {
    if (!this.connected) { return; }
    
    this._cleanup();
    
    var source = this.source(this._currentAudioNode);
    
    source.connect(this._context.destination);
    source.disconnect(this._analyser);
    
    this._analyser.disconnect();
    
    this._currentAudioNode.removeEventListener('pause', this._onpause);
    this._currentAudioNode.removeEventListener('ended', this._onended);
    this._currentAudioNode.removeEventListener('play', this._onplay);

    this._currentAudioNode = null;
  }

  /**
   * @private
   */
  _cleanup() {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = null;
    }
  }
  
  _onpause = () => {
    this._cleanup();
  }
  
  _onplay = () => {
    if (this._intervalHandle) { return; }
    
    this._intervalHandle = setInterval(() => {
			this._analyser.getByteFrequencyData(this._bands);
			this._drawFunc(this._bands);
    }, this._interval);
  }
  
  _onended = () => {
    this.disconnect();
  }
}
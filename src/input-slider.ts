
export class InputSlider extends HTMLElement {
  private isDragging: boolean;
  private current: HTMLElement | null;
  private handle: HTMLElement | null;
  private container: HTMLElement | null;
  private level: HTMLElement | null;

  volumeMemory = 0

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {  
    if (name === 'value' && newValue) {
      this.value = parseFloat(newValue)
    }
  }

  get valueAttribute () {
    return this.getAttribute('value');
  }

  get percent () {
    return this.value * 100
  }

  _value: number = 0

  get value () {
    return this._value
  }

  set value(newValue: number) {
    if (this.value === newValue) return;
    this.volumeMemory = this.value

    if (newValue > 1) {
      this._value =  1
    } else if (newValue < 0) {
      this._value = 0
    } else {
      this._value = newValue;
    }
    
    this.setAttribute('value', `${newValue}`);
    this.dispatchEvent(new Event('change'));
    this.setWidths()
  }

  get hideSelector () {
    return this.getAttribute('hide-selector')
  }

  get showSelectorOnHover () {
    return this.getAttribute('show-selector-on-hover')
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isDragging = false;
    this.current = null;
    this.handle = null;
  }

  connectedCallback() {
    this.value = !this.valueAttribute ? 0.5 : parseFloat(this.valueAttribute)

    this.level = document.createElement('div');
    this.level.style.width = '100%';
    this.level.style.padding = '0 10px 0 10px';
    // this.level.style.display = 'inline-block';
    this.level.style.boxSizing = 'border-box';
    // this.level.style.height = '20px';

    this.container = document.createElement('div');
    this.container.className = 'input-slider';
    this.container.style.width = '100%';
    // this.container.style.display = 'inline-block';

    this.container.style.height = '7px';
    this.container.style.backgroundColor = '#9c9c9c';
    this.container.style.position = 'relative';
    this.container.style.cursor = 'pointer';
    this.container.style.borderRadius = '5px';
    this.container.style.top = '0'
    this.container.style.left = '0'
    
    this.level.appendChild(this.container)

    this.current = document.createElement('div');
    this.current.className = 'input-slider-current';
    this.current.style.height = '100%';
    this.current.style.backgroundColor = 'white';
    this.current.style.borderRadius = '5px';
    this.container.appendChild(this.current);

    this.handle = document.createElement('span');
    this.handle.className = 'input-slider-handle';
    this.handle.style.width = '20px';
    this.handle.style.height = '20px';
    this.handle.style.backgroundColor = 'white';
    this.handle.style.position = 'absolute';
    this.handle.style.top = '-6px';
    this.handle.style.borderRadius = '50%';
    this.handle.style.marginLeft = '-10px';
    if (this.hideSelector) this.handle.style.display = 'none';
    this.container.appendChild(this.handle);

    this.setWidths()

    if (!this.shadowRoot) throw new Error('No shadow root');
    this.shadowRoot.appendChild(this.level);

    if (this.showSelectorOnHover) {
      this.addEventListener('mouseenter', this.showHandle)
      this.addEventListener('mouseleave', this.hideHandle)
    }
    // this.addEventListener('mousedown', this.startDragging);
    // this.addEventListener('mousemove', this.dragging);
    // this.addEventListener('mouseup', this.stopDragging);

    this.addEventListener('pointerdown', this.startDragging);
    this.addEventListener('pointermove', this.dragging);
    this.addEventListener('pointerup', this.stopDragging);
    this.addEventListener('pointercancel', this.stopDragging);
  }

  setWidths () {
    if (!this.current || !this.handle) return;
    this.current.style.width = `${this.percent}%`;
    this.handle.style.left = `${this.percent}%`;
  }

  disconnectedCallback () {
    if (this.showSelectorOnHover) {
      this.addEventListener('mouseenter', this.showHandle)
      this.addEventListener('mouseleave', this.hideHandle)
    }

    this.removeEventListener('pointerdown', this.startDragging);
    this.removeEventListener('pointermove', this.dragging);
    this.removeEventListener('pointerup', this.stopDragging);
    this.removeEventListener('pointercancel', this.stopDragging);
  }

  showHandle () {
    if (this.handle) this.handle.style.display = 'block';
  }

  hideHandle () {
    if (this.handle) this.handle.style.display = 'none';
  }

  startDragging (e: MouseEvent) {
    this.isDragging = true;
    this.updateVolume(e);
  }

  dragging (e: MouseEvent) {
    if (this.isDragging) this.updateVolume(e);
  }

  stopDragging () {
    this.isDragging = false;
  }

  updateVolume (e: MouseEvent) {
    if (!this.current || !this.handle) return;
    if (!this.container) throw new Error('No container initalized');
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX;
    let volume = (x - rect.left) / rect.width;
    
    volume = Math.max(0, Math.min(volume, 1));
    
    this.current.style.width = `${volume * 100}%`;
    this.handle.style.left = `${volume * 100}%`;
    this.value = volume;
  }
}

customElements.define('input-slider', InputSlider);

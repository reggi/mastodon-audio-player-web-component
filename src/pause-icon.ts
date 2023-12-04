
class PauseIcon extends HTMLElement {
  height: number = 16;
  width: number = 20;
  constructor() {
    super()
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    const s = this.getAttribute('scale') 
    const scale = s ? parseFloat(s) : 1
    const fill = this.getAttribute('fill') || '#ffffff'
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', (scale * this.height).toString());
    svg.setAttribute('width', (scale * this.width).toString());
    svg.setAttribute('viewBox', '0 0 640 512');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', fill);
    path.setAttribute('d', 'M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z');
    svg.appendChild(path)
    if (!this.shadowRoot) throw new Error('No shadow root');
    this.shadowRoot.appendChild(svg);
  }
}

customElements.define('pause-icon', PauseIcon);

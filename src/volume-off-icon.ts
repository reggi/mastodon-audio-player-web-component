// https://fontawesome.com/icons/volume-off?f=classic&s=solid

class VolumeOffIcon extends HTMLElement {
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
    path.setAttribute('d', 'M320 64c0-12.6-7.4-24-18.9-29.2s-25-3.1-34.4 5.3L131.8 160H64c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64h67.8L266.7 471.9c9.4 8.4 22.9 10.4 34.4 5.3S320 460.6 320 448V64z');
    svg.appendChild(path)
    if (!this.shadowRoot) throw new Error('No shadow root');
    this.shadowRoot.appendChild(svg);
  }
}

customElements.define('volume-off-icon', VolumeOffIcon);

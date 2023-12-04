class DownloadIcon extends HTMLElement {
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
    path.setAttribute('d', 'M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z');
    svg.appendChild(path)
    if (!this.shadowRoot) throw new Error('No shadow root');
    this.shadowRoot.appendChild(svg);
  }
}

customElements.define('download-icon', DownloadIcon);

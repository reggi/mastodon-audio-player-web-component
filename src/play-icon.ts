class PlayIcon extends HTMLElement {
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
    path.setAttribute('d', 'M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z');
    svg.appendChild(path)
    if (!this.shadowRoot) throw new Error('No shadow root');
    this.shadowRoot.appendChild(svg);
  }
}

customElements.define('play-icon', PlayIcon);
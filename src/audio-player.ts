import Visualizer from "./visualizer";
import './input-slider'
import './play-icon'
import './pause-icon'
import './volume-off-icon'
import './volume-high-icon'
import './download-icon'

export class AudioPlayer extends HTMLElement {
  
  private src?: string | null
  private poster?: string | null

  private initalVolume = 1
  private tickSize = 10
  private visualizerColor = '#ffffff'
  private backgroundColor = '#000000'
  private playing = false
  private muted = false
  private scale = 1

  private visualizer: Visualizer
  private audioContext?: AudioContext
  private gainNode?: GainNode
  
  static getRadius (height: number) {
    return height / 2 - 180 * AudioPlayer.getScaleCoefficient(height)
  }

  static getScaleCoefficient (height: number) {
    return (height) / 982;
  }
  
  constructor(){
    super()
    this.attachShadow({mode: 'open'})
    this.visualizer = new Visualizer(this.tickSize)
  }

  get canvasRadius () {
    return AudioPlayer.getRadius(this.height)
  }

  get coefficient () {
    return AudioPlayer.getScaleCoefficient(this.height)
  }
  
  reusableButton () {
    const button = document.createElement('button')
    button.style.background = 'none';
    button.style.color = 'inherit';
    button.style.border = 'none';
    button.style.padding = '0';
    button.style.margin = '0';
    button.style.font = 'inherit';
    button.style.textAlign = 'inherit';
    button.style.cursor = 'pointer';
    return button
  }

  private playButton?: HTMLElement
  private playIcon?: HTMLElement
  private pauseIcon?: HTMLElement
  initPlayButton () {
    this.playButton = this.reusableButton()
    // this.playButton.style.paddingTop = '7px'

    this.playIcon = document.createElement('play-icon')
    this.playIcon.setAttribute('scale', this.scale.toString())
    this.playButton.appendChild(this.playIcon)

    this.pauseIcon = document.createElement('pause-icon')
    this.pauseIcon.setAttribute('scale', this.scale.toString())
    this.pauseIcon.style.display = 'none'

    this.playButton.appendChild(this.pauseIcon)
    this.bottomControls?.appendChild(this.playButton)
    return this.playButton
  }

  private container: HTMLDivElement
  initContainer () {
    this.container = document.createElement('div')
    this.container.style.width = '100%'
    this.container.style.aspectRatio = '16 / 9'
    this.container.style.backgroundColor = this.backgroundColor
    this.container.style.position = 'relative'
    this.container.style.borderRadius = '20px'
    this.container.style.overflow = 'hidden'
    return this.container
  }

  private visualizerCanvas?: HTMLCanvasElement
  initVisualizerCanvas () {
    this.visualizerCanvas = document.createElement('canvas')
    this.visualizerCanvas.style.width = '100%'
    this.visualizerCanvas.style.position = 'absolute'
    this.visualizerCanvas.style.top = '0'
    this.visualizerCanvas.style.left = '0'

    this.visualizer.setCanvas(this.visualizerCanvas);
    this.container.appendChild(this.visualizerCanvas)

    return this.visualizerCanvas
  }

  bottomControls?: HTMLDivElement
  initBottomControls () {
    this.bottomControls = document.createElement('div')
    // this.bottomControls.style.width = '100%'
    this.bottomControls.style.position = 'absolute'
    this.bottomControls.style.display = 'flex'
    this.bottomControls.style.bottom = '0'
    this.bottomControls.style.left = '0'
    this.bottomControls.style.margin = this.controlMargin
    // this.bottomControls.style.justifyContent = 'center'
    this.bottomControls.style.alignItems = 'start'
    this.bottomControls.style.gap = '5px'
    this.container.appendChild(this.bottomControls)
    return this.bottomControls
  }

  soundContainer?: HTMLDivElement
  initSoundContainer () {
    this.soundContainer = document.createElement('div')
    this.soundContainer.style.display = 'flex'
    // this.soundContainer.style.gap = '5px'
    
    this.bottomControls?.appendChild(this.soundContainer)
    return this.soundContainer
  }

  
  animateVolumeSlider () {
    this.volumeContainer.style.width = '150px'
    this.volumeContainer.style.marginRight = '15px'
  }

  resetAnimateVolumeSlider () {
    this.volumeContainer.style.width = '0px'
    this.volumeContainer.style.marginRight = '0px'
  }

  private volumeContainer: HTMLDivElement
  private volumeControl: HTMLInputElement
  initVolumeSlider () {
    this.volumeContainer = document.createElement('div')
    this.volumeContainer.style.width = '0px'
    // this.volumeContainer.style.width = '150px'
    this.volumeContainer.style.overflow = 'hidden'
    this.volumeContainer.style.paddingTop = '7px'
    // this.volumeContainer.style.marginRight = '10px'
    this.volumeContainer.style.transition = 'all .1s linear';
    this.volumeControl = document.createElement('input-slider') as HTMLInputElement
    this.volumeControl.setAttribute('value', this.initalVolume.toString())
    this.volumeContainer.appendChild(this.volumeControl)
    this.soundContainer?.appendChild(this.volumeContainer)
    return this.volumeControl
  }

  private audioElement?: HTMLAudioElement
  initAudio () {
    if (this.src === null) throw new Error('src attribute is required')
    this.audioElement = new Audio(this.src);
    this.audioElement.crossOrigin = 'anonymous'
    this.audioElement.volume = this.initalVolume
    return this.audioElement
  }

  private muteButton?: HTMLElement
  private muteIcon?: HTMLElement
  private soundIcon?: HTMLElement
  initMuteButton () {
    this.muteButton = this.reusableButton()
    this.muteButton.style.padding = '1px 13px 0px 7px'

    this.soundIcon = document.createElement('volume-high-icon')
    this.soundIcon.setAttribute('scale', this.scale.toString())
    this.muteButton.appendChild(this.soundIcon)

    this.muteIcon = document.createElement('volume-off-icon')
    this.muteIcon.setAttribute('scale', this.scale.toString())
    this.muteIcon.style.display = 'none'
    this.muteButton.appendChild(this.muteIcon)

    this.soundContainer?.appendChild(this.muteButton)

    return this.muteButton
  }

  image: HTMLImageElement
  initPosterImage () {
    this.image = document.createElement('img');
    this.image.style.position = 'absolute'
    this.image.style.left = '50%'
    this.image.style.top = '50%'
    this.image.style.height = 'calc(63.3401% - 20px)'
    this.image.style.aspectRatio = '1 / 1'
    this.image.style.transform = 'translate(-50%, -50%)'
    this.image.style.borderRadius ='50%'
    this.image.style.pointerEvents = 'none'
    const whiteSquareBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

    this.image.setAttribute('src', this.poster || whiteSquareBase64)
    this.container.appendChild(this.image)
  }

  timeContainer: HTMLElement
  currentTimeElement: HTMLElement
  durationElement: HTMLElement
  initTime () {
    this.timeContainer = document.createElement('div')
    this.timeContainer.style.fontFamily = 'sans-serif'
    this.timeContainer.style.fontSize = '17px'
    this.timeContainer.style.display = 'inline-block'
    this.timeContainer.style.color = '#ffffff'
    this.currentTimeElement = document.createElement('span')
    this.currentTimeElement.textContent = '00:00'

    this.durationElement = document.createElement('span')
    this.durationElement.textContent = '00:00'

    this.timeContainer.appendChild(this.currentTimeElement)
    const slashElement = document.createElement('span');
    slashElement.textContent = ' / ';
    this.timeContainer.appendChild(slashElement);
    this.timeContainer.appendChild(this.durationElement)
    this.bottomControls?.appendChild(this.timeContainer)
  }

  topControls: HTMLElement
  timelineElement: HTMLInputElement
  initTopControls () {
    this.topControls = document.createElement('div')
    this.topControls.style.width = '100%'
    this.topControls.style.position = 'absolute'
    this.topControls.style.display = 'block'
    this.topControls.style.top = '0'
    this.topControls.style.left = '0'
    
    this.timelineElement = document.createElement('input-slider') as HTMLInputElement
    this.timelineElement.setAttribute('value', '0')
    this.topControls.appendChild(this.timelineElement)

    this.container.appendChild(this.topControls)
    return this.topControls
  }

  draw () {
    requestAnimationFrame(() => this.draw());
    this.visualizerClear()
    this.visualizerDraw()
  }

  visualizerClear () {
    this.visualizer.clear(this.width, this.height);      
  }

  visualizerDraw () {
    this.visualizer.draw(this.width / 2, this.height / 2, this.visualizerColor, this.canvasRadius, this.coefficient);
  }

  initializeAudioContext () {
    if (!this.audioElement) throw new Error('audioElement is not initialized')
    const AudioContext = window.AudioContext || window['webkitAudioContext']
    this.audioContext = new AudioContext()
    const source = this.audioContext.createMediaElementSource(this.audioElement)
    this.gainNode = this.audioContext.createGain()
    this.gainNode.gain.value = this.initalVolume
    this.visualizer.setAudioContext(this.audioContext, source)
    source.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)
  }

  controlMargin = '0 30px 20px 30px'

  initDownloadIcon () {
    const downloadIcon = document.createElement('download-icon')
    downloadIcon.setAttribute('scale', this.scale.toString())
    downloadIcon.style.position = 'absolute'
    downloadIcon.style.right = '0'
    downloadIcon.style.bottom = '0'
    downloadIcon.style.margin = '10px'
    downloadIcon.style.cursor = 'pointer'
    downloadIcon.style.margin = this.controlMargin

    downloadIcon.addEventListener('click', () => {
      const a = document.createElement('a')
      a.href = this.src || ''
      a.download = this.src || ''
      a.click()
    })
    this.container.appendChild(downloadIcon)
  }

  audioElementPauseHandler () {
    if (this.audioContext) this.audioContext.suspend()
  }

  audioElementPlayHandler () {
    if (!this.audioContext) this.initializeAudioContext()
    this.draw();
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  previousVolume = this.initalVolume
  setVolume (value: number) {
    if (value !== 0) {
      this.previousVolume = value
    }

    if (this.gainNode) {
      this.gainNode.gain.value = value
    }
  }

  setDisplayVolume (value: number) {
    this.volumeControl.value = value.toString()
  }

  volumeControlChangeHandler () {
    if (!this.soundIcon || !this.muteIcon) throw new Error('soundIcon or muteIcon is not initialized')
    const current = parseFloat(this.volumeControl.value)
    this.setVolume(current)
    if (current === 0) {
      this.muted = true
      this.soundIcon.style.display = 'none'
      this.muteIcon.style.display = 'inline-block'
      this.previousVolume = 1
    } else {
      this.muted = false
      this.soundIcon.style.display = 'inline-block'
      this.muteIcon.style.display = 'none'
    }
  }

  playButtonClickHandler () {
    if (!this.playIcon || !this.pauseIcon || !this.audioElement) throw new Error('playIcon or pauseIcon or audioElement is not initialized')
    if (this.audioElement && this.playing === false) {
      this.playing = true
      this.audioElement.play()
      this.playIcon.style.display = 'none'
      this.pauseIcon.style.display = 'block'
    } else {
      this.playing = false
      this.audioElement.pause()
      this.playIcon.style.display = 'inline-block'
      this.pauseIcon.style.display = 'none'
    }
  }

  muteButtonClickHandler () {
    if (!this.soundIcon || !this.muteIcon) throw new Error('soundIcon or muteIcon is not initialized')
    if (this.audioElement && this.muted === false) {
      this.muted = true
      this.soundIcon.style.display = 'none'
      this.muteIcon.style.display = 'inline-block'
      this.setVolume(0)
      this.setDisplayVolume(0)
    } else {
      this.muted = false
      this.soundIcon.style.display = 'inline-block'
      this.muteIcon.style.display = 'none'
      this.setVolume(this.previousVolume)
      this.setDisplayVolume(this.previousVolume)
    }
  }

  muteButtonEnterHandler () {
    this.animateVolumeSlider()
  }

  muteButtonLeaveHandler () {
    this.resetAnimateVolumeSlider()
  }

  convertTime(time: number): string {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);

    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    const secsStr = secs < 10 ? `0${secs}` : `${secs}`;

    return `${minsStr}:${secsStr}`;
}

  audioElementLoadedMetadataHandler() {
    if (!this.audioElement) throw new Error('audioElement is not initialized')
    this.durationElement.textContent = this.convertTime(this.audioElement.duration)
  }

  audioElementTimeUpdateHandler () {
    if (!this.audioElement) throw new Error('audioElement is not initialized')
    this.currentTimeElement.textContent = this.convertTime(this.audioElement.currentTime)
    const value = (this.audioElement.currentTime / this.audioElement.duration)
    this.timelineElement.value = value.toString()
  }

  timelineElementClickHandler () {
    if (!this.audioElement) throw new Error('audioElement is not initialized')
    const timelineValue = parseFloat(this.timelineElement.value)
    this.audioElement.currentTime = this.audioElement.duration * timelineValue
    this.currentTimeElement.textContent = this.convertTime(this.audioElement.currentTime)
  }

  setupEvents () {
    if (!this.audioElement) throw new Error('audioElement is not initialized')
    if (!this.playButton) throw new Error('playButton is not initialized')
    if (!this.muteButton) throw new Error('muteButton is not initialized')
    this.audioElement.addEventListener('pause', this.audioElementPauseHandler.bind(this))
    this.audioElement.addEventListener('play', this.audioElementPlayHandler.bind(this))
    this.volumeControl.addEventListener('change', this.volumeControlChangeHandler.bind(this))
    this.playButton.addEventListener('click', this.playButtonClickHandler.bind(this))
    this.muteButton.addEventListener('click', this.muteButtonClickHandler.bind(this))
    this.container.addEventListener('mouseenter', this.muteButtonEnterHandler.bind(this))
    this.container.addEventListener('mouseleave', this.muteButtonLeaveHandler.bind(this))
    this.audioElement.addEventListener('loadedmetadata', this.audioElementLoadedMetadataHandler.bind(this))
    this.audioElement.addEventListener('timeupdate', this.audioElementTimeUpdateHandler.bind(this))
    this.timelineElement.addEventListener('click', this.timelineElementClickHandler.bind(this))
  }

  teardownEvents () {
    this.audioElement?.removeEventListener('pause', this.audioElementPauseHandler.bind(this))
    this.audioElement?.removeEventListener('play', this.audioElementPlayHandler.bind(this))
    this.volumeControl.removeEventListener('change', this.volumeControlChangeHandler.bind(this))
    this.playButton?.removeEventListener('click', this.playButtonClickHandler.bind(this))
    this.muteButton?.removeEventListener('click', this.muteButtonClickHandler.bind(this))
    this.container.removeEventListener('mouseenter', this.muteButtonEnterHandler.bind(this))
    this.container.removeEventListener('mouseleave', this.muteButtonLeaveHandler.bind(this))
    this.audioElement?.removeEventListener('loadedmetadata', this.audioElementLoadedMetadataHandler.bind(this))
    this.audioElement?.removeEventListener('timeupdate', this.audioElementTimeUpdateHandler.bind(this))
    this.timelineElement.removeEventListener('click', this.timelineElementClickHandler.bind(this))
  }

  get width () {
    return this.container.offsetWidth
  }

  get height () {
    return (this.width / (16/9));
  }
  
  connectedCallback () {
    this.src = this.getAttribute('src')
    this.poster = this.getAttribute('poster')
    
    this.initAudio()
    
    this.initContainer()
    this.initVisualizerCanvas()
    this.initBottomControls()
    this.initPlayButton()
    this.initSoundContainer()
    this.initMuteButton()
    this.initVolumeSlider()
    this.initTime()
    this.initPosterImage()
    this.initTopControls()
    this.initDownloadIcon()

    // after initialize
    this.setupEvents()

    if (!this.visualizerCanvas) throw new Error('visualizerCanvas is not initialized')

    this.shadowRoot?.appendChild(this.container)
    this.visualizerCanvas.width = this.width
    this.visualizerCanvas.height = this.height

    this.visualizerDraw()
  }

  disconnectedCallback () {
    this.teardownEvents()
  }

}
customElements.define('audio-player', AudioPlayer)
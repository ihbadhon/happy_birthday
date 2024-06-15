let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    if (isTouchDevice) {
      // Touch events for mobile
      paper.addEventListener('touchmove', (e) => this.onTouchMove(e, paper));
      paper.addEventListener('touchstart', (e) => this.onTouchStart(e, paper));
      paper.addEventListener('touchend', () => this.onTouchEnd());
      paper.addEventListener('gesturestart', (e) => this.onGestureStart(e));
      paper.addEventListener('gestureend', () => this.onGestureEnd());
    } else {
      // Mouse events for PC
      document.addEventListener('mousemove', (e) => this.onMouseMove(e, paper));
      paper.addEventListener('mousedown', (e) => this.onMouseDown(e, paper));
      window.addEventListener('mouseup', () => this.onMouseUp());
    }
  }

  onTouchMove(e, paper) {
    e.preventDefault();
    if (!this.rotating) {
      this.moveX = e.touches[0].clientX;
      this.moveY = e.touches[0].clientY;

      this.velX = this.moveX - this.prevX;
      this.velY = this.moveY - this.prevY;
    }

    const dirX = e.touches[0].clientX - this.startX;
    const dirY = e.touches[0].clientY - this.startY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevX = this.moveX;
      this.prevY = this.moveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  onTouchStart(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.prevX = this.startX;
    this.prevY = this.startY;
  }

  onTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  onGestureStart(e) {
    e.preventDefault();
    this.rotating = true;
  }

  onGestureEnd() {
    this.rotating = false;
  }

  onMouseMove(e, paper) {
    if (!this.rotating) {
      this.moveX = e.clientX;
      this.moveY = e.clientY;

      this.velX = this.moveX - this.prevX;
      this.velY = this.moveY - this.prevY;
    }

    const dirX = e.clientX - this.startX;
    const dirY = e.clientY - this.startY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevX = this.moveX;
      this.prevY = this.moveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  onMouseDown(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    if (e.button === 0) {
      this.startX = this.moveX = e.clientX;
      this.startY = this.moveY = e.clientY;
      this.prevX = this.moveX;
      this.prevY = this.moveY;
    }
    if (e.button === 2) {
      this.rotating = true;
    }
  }

  onMouseUp() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

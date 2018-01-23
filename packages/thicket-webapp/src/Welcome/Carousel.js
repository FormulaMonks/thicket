import React from 'react'
import './Carousel.css'

const clampTo = ([min, max], val) =>
  val <= min ? min : val >= max ? max : val;

export default class Carousel extends React.Component {
  state = {
    currentSlide: 0,
    beingTouched: false,
    touchStartX: null,
    left: `0vw`
  }

  handleStart = clientX => {
    const screenWidth = window.innerWidth
    const { currentSlide } = this.state
    const leftInPx = -screenWidth * currentSlide
    this.setState({
      beingTouched: true,
      touchStartX: clientX,
      leftOnTouchStart: leftInPx,
      left: leftInPx,
    })
  }

  handleMouseDown = e => {
    e.preventDefault();
    this.handleStart(e.clientX);
  }

  handleMove = clientX => {
    const { beingTouched, leftOnTouchStart, touchStartX } = this.state
    if (beingTouched) {
      this.setState({
        left: leftOnTouchStart + clientX - touchStartX
      })
    }
  }

  handleEnd = () => {
    const screenWidth = window.innerWidth
    const slideCount = this.props.children.length
    const { left } = this.state
    const nearestSlide = clampTo(
      [0, slideCount - 1],
      -Math.round(left / screenWidth)
    )
    this.setState({beingTouched: false}, () => {
      if (!isNaN(nearestSlide)) {
        this.setState({
          currentSlide: nearestSlide,
          left: `${nearestSlide * -100}vw`,
        })
      }
    })
  }

  render() {
    const { children } = this.props
    const { currentSlide, beingTouched, left } = this.state
    const slideCount = children.length

    return (
      <div className="Carousel-wrap">
        <div
          className="Carousel-slides"
          style={{
            width: `${slideCount * 100}vw`,
            left,
            transition: beingTouched ? undefined : 'left 0.5s',
          }}
          onTouchStart={e => this.handleStart(e.targetTouches[0].clientX)}
          onTouchMove={e => this.handleMove(e.targetTouches[0].clientX)}
          onTouchEnd={this.handleEnd}
          onMouseDown={this.handleMouseDown}
          onMouseMove={e => this.handleMove(e.clientX)}
          onMouseUp={this.handleEnd}
          onMouseLeave={this.handleEnd}
        >
          {children}
        </div>
        <div className="Carousel-dots" aria-hidden="true">
          {children.map((_, i) =>
            <button
              key={i}
              onClick={() => this.setState({
                currentSlide: i,
                left: `${i * -100}vw`
              })}
              className={`Carousel-dot${
                i === currentSlide ? ' Carousel-dotActive' : ''
              }`}
            >
              go to slide {i}
            </button>
          )}
        </div>
      </div>
    )
  }
}

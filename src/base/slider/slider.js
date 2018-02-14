import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom';
import './slider.less';

export default class Slider extends Component {
    state = {
        dots: [],
        currentPageIndex: 0
    };
    componentDidMount() {
        setTimeout(() => {
          this._setSliderWidth()
          this._initDots()
          this._initSlider()
  
          if (this.autoPlay) {
            this._play()
          }
        }, 20)
  
        window.addEventListener('resize', () => {
          if (!this.BSlider) {
            return
          }
          this._setSliderWidth(true)
          this.BSlider.refresh()
        })
    }
    _setSliderWidth = (isResize) => {
        this.children = this.sliderGroup.children
        console.log(this.children)
        
        let width = 0
        let sliderWidth = this.slider.clientWidth
        for (let i = 0, len = this.children.length; i < len; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.sliderGroup.style.width = width + 'px'
    }
    _initSlider = () => {
        this.BSlider = new BScroll(this.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })

        this.BSlider.on('scrollEnd', () => {
          let pageIndex = this.BSlider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
    }
    _initDots = () => {
        this.dots = new Array(this.children.length)
    }
    _play = () => {
        this.timer = setTimeout(() => {
          this.BSlider.next(400)
        }, this.interval)
    }
    render() {
        const { dots, currentPageIndex } = this.state;
        const dotItems = dots.map((item, index) =>
            <span
                className={currentPageIndex===index?'dot active':'dot'}
                key={index}>
            </span>
        );
        return (
            <div className="slider" ref={(slider) => {this.slider = slider}}>
                <div className="slider-group" ref={(sliderGroup) => {this.sliderGroup = sliderGroup}}>
                    {this.props.children}
                </div>
                <div className="dots">
                    {dotItems}
                </div>
            </div>
        );
    }
}

Slider.propTypes = {
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    interval: PropTypes.number,
    click: PropTypes.bool
};

Slider.defaultProps = {
    loop: true,
    autoPlay: true,
    interval: 4000,
    click: true
}
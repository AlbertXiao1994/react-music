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
            this._initSlider()
          }, 20)
    
          window.addEventListener('resize', () => {
            if (!this.BSlider) {
              return
            }
            this._setSliderWidth(true)
            this.BSlider.refresh()
          })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.children.length !== this.props.children.length && nextProps.children.length > 0)
        setTimeout(() => {
          this._setSliderWidth()
          this._initDots()
  
          if (this.props.autoPlay) {
            this._play()
          }
        }, 20)
    }
    _setSliderWidth = (isResize) => {
        this.children = this.sliderGroup.children
        console.log(this.children)
        
        let width = 0
        let sliderWidth = this.slider.clientWidth
        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i]
            addClass(child, 'slider-item')
            console.log(len)

            child.style.width = sliderWidth + 'px'
            width += sliderWidth
        }
        if (this.props.loop && !isResize) {
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
          this.setState({currentPageIndex: pageIndex})

          if (this.props.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
    }
    _initDots = () => {
        this.setState({dots: new Array(this.children.length)})
    }
    _play = () => {
        this.timer = setTimeout(() => {
          this.BSlider.next(400)
        }, this.props.interval)
    }
    render() {
        const { dots, currentPageIndex } = this.state;
        return (
            <div className="slider" ref={(slider) => {this.slider = slider}}>
                <div className="slider-group" ref={(sliderGroup) => {this.sliderGroup = sliderGroup}}>
                    {this.props.children}
                </div>
                <div className="dots">
                    {
                        dots.map((item, index) => 
                            <span
                                className={currentPageIndex===index?'dot active':'dot'}
                                key={index}>
                            </span>
                        )
                    }
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
    autoPlay: false,
    interval: 4000,
    click: true
}
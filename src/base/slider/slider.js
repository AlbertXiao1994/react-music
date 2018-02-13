import React, { Component } from 'react';
import './slider.less';

export default class Slider extends Component {
    state = {
        dots: [],
        currentPageIndex: 0
    };
    render() {
        const { dots, currentPageIndex } = this.state;
        const dotItems = dots.map((item, index) =>
            <span className={currentPageIndex===index?'dot active':'dot'}></span>
        );
        return (
            <div>
                <div className="slider-group">
                </div>
                <div className="dots">
                    {dotItems}
                </div>
            </div>
        );
    }
}
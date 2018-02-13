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
            <span
                className={currentPageIndex===index?'dot active':'dot'}
                key={index}>
            </span>
        );
        return (
            <div>
                <div className="slider-group">
                    {this.props.children}
                </div>
                <div className="dots">
                    {dotItems}
                </div>
            </div>
        );
    }
}
import React, { Component } from 'react';
import Slider from 'base/slider/slider';
import './recommend.less';

export default class Recommend extends Component {
  state = {
    recommends: []
  };
  render() {
    const { recommends } = this.state;
    const recommendItems = recommends.map((item) => 
      <div>
        <a href={item.linkUrl}>
          <img src={item.picUrl} className="needsClick" alt="" />
        </a>
      </div>
    );
    return (
      <div className="recommend">
        <div className="recommend-content">
          <div>
            <div className="slider-wrapper">
              <Slider>
                {recommendItems}
              </Slider>
            </div>
            <div className="recommend-list">
              <h1 className="list-title">热门歌单推荐</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
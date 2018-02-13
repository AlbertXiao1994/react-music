import React, { Component } from 'react';
import Slider from 'base/slider/slider';
import './recommend.less';
import { getRecommend } from 'api/recommend';
import { ERR_OK } from 'api/config';

export default class Recommend extends Component {
  state = {
    recommends: []
  };
  _getRecommend() {
    getRecommend().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({recommends: res.data.slider});
      }
    }, (err) => {
      console.log(err)
    })
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
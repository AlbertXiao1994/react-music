import React, { Component } from 'react';
import Slider from 'base/slider/slider';
// import Scroll from 'base/scroll/scroll';
import './recommend.less';
import { getRecommend } from 'api/recommend';
import { ERR_OK } from 'api/config';

export default class Recommend extends Component {
  state = {
    recommends: []
  };
  componentWillMount() {
    this._getRecommend()
  }
  _getRecommend() {
    getRecommend().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({recommends: res.data.slider});
      }
    }, (err) => {
      console.log(err)
    })
  }
  loadImg = () => {
    if (!this.checkLoad) {
      this.scroll.refresh()
      this.checkLoad = true
    }
  }
  render() {
    return (
      <div className="recommend">
        <div className="recommend-content" ref={(scroll) => {this.scroll = scroll}}>
          <div>
            <div className="slider-wrapper">
              <Slider click={false}>
                {
                  this.state.recommends.map((item, index) => 
                    <div key={index}>
                      <a href={item.linkUrl}>
                        <img src={item.picUrl} className="needsClick" alt="" />
                      </a>
                    </div>
                  )
                }
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
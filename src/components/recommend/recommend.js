import React, { Component } from 'react';
import Slider from 'base/slider/slider';
// import Scroll from 'base/scroll/scroll';
import './recommend.less';
import { getRecommend, getDiscList } from 'api/recommend';
import { ERR_OK } from 'api/config';

export default class Recommend extends Component {
  state = {
    recommends: [],
    discList: []
  };
  componentWillMount() {
    this._getRecommend()
    this._getDiscList()
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
  _getDiscList() {
    getDiscList().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({discList: res.data.list})
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
              <Slider>
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
              <ul>
                  {
                    this.state.discList.map((item, index) => 
                      <li class="item" v-for="item in discList">
                        <div class="icon">
                          <img width="60" height="60" src={item.imgurl} alt={index} />
                        </div>
                        <div class="text">
                          <h2 class="title">{item.dissname}</h2>
                          <p class="creator">{item.creator.name}</p>
                        </div>
                      </li>
                    )
                  }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
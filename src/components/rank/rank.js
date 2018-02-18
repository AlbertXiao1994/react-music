import React, { Component } from 'react';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getTopList } from 'api/rank';

export default class RouterConfig extends Component {
    state = {
        topList: []
    }
    render() {
        return (
            <div className="rank" ref={rank => this.rank = rank}>
                <Scroll>
                    <ul>

                    </ul>
                    {
                        !this.state.topList.length
                        ? <div className="loading-container">
                            <Loading /> 
                          </div>
                        : ''
                    }
                    
                </Scroll>
            </div>
        );
    }
}
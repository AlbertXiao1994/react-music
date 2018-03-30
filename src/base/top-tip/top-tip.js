import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class TopTip extends PureComponent {
    state = {
        showFlag: false
    }
    show = () => {
        this.setState({showFlag: true})
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.props.delay)
    }
    hide = (e) => {
        this.setState({showFlag: false})
    }
    render() {
        return (
            <div name="drop">
            {
                this.state.showFlag
                ? <div className="top-tip" onClick={this.hide}>
                    this.props.children
                  </div>
                : ''
            }
            </div>
        );
    }
}

TopTip.propTypes = {
    delay: PropTypes.number
};

TopTip.defaultProps = {
    delay: 2000
};
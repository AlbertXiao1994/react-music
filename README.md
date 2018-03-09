## 技术栈

框架：React 16<br>
脚手架：Create-React-App<br>
路由：React Router 4<br>
数据管理：Redux 3<br>
数据请求：axios、jsonp<br>
优化：immutable.js、fastclick、[AsyncComponent](https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html)实现按需加载<br>
动画：[React Transition Group](https://reactcommunity.org/react-transition-group/)<br>
语言：ES6<br>
预处理：Less

## 效果

![效果图](http://wx1.sinaimg.cn/mw690/a98da548gy1fow7qw6idaj20v10catax.jpg)

## 使用

下载
```bash
git clone git@github.com:AlbertXiao1994/react-music.git
```

进入项目文件根目录，安装依赖
```bash
npm install
```

运行
```bash
npm start
```

## 脱坑

### 要不要npm run eject？

Create-React-App据说是为了优雅，将webpack配置相关的文件封装进了react-scripts包中。这有助于让开发者专注于前端代码，但却束缚力我们的手脚，不利于在脚手架的基础上进行扩展。我选择的是将配置文件暴露出来。

对webpack配置文件，主要进行三方面改造：
* 设置文件路径别名
* 使用less-loader
* 基于Express，通过devServer里before(app)函数设置数据接口

### 项目结构的选择

以下两种项目结构或许都行：
第一种，我现在使用的
``` 
|── src
|   |── api # 接口相关
|   |── base #基础组件
|   |── common # 通用文件
|   |  |── fonts # 字体、图标
|   |  |── images # 图片资源
|   |  |── js # 函数
|   |  |── style # 样式
|   |──components # 业务组件
|   |──store # Redux配置
|   |  |── reducers # reducer文件夹
|   |  |  |── a.js # 子Reducer
|   |  |  |── b.js # 子Reducer
|   |  |  |── index.js # 合成所有子Reducer
|   |  |── action-types.js # Action类型汇总
|   |  |── actions.js # 定义action生成器、派发action
|   |  |── index.js # 创建store
|   |──App.js # 根组件
|   |──index.js # 入口文件，根组件挂载
|   |──registerServiceWorker.js
```

第二种，Redux官方例子的项目目录

```
|── src
|   |──actions # Redux的Action文件夹
|   |  |── actions.js # 定义action生成器、派发action
|   |── api # 接口相关
|   |── base #基础组件
|   |── common # 通用文件
|   |  |── fonts # 字体、图标
|   |  |── images # 图片资源
|   |  |── js # 函数
|   |  |── style # 样式
|   |──components # UI组件
|   |──constants # 常量
|   |  |── action-types.js # Action类型汇总
|   |──containers # 容器组件
|   |──store # Redux配置
|   |── reducers # Redux的Reducer文件夹
|   |  |── a.js # 子Reducer
|   |  |── b.js # 子Reducer
|   |  |── index.js # 合成所有子Reducer
|   |──App.js # 根组件
|   |──index.js # 入口文件，根组件挂载，创建store
|   |──registerServiceWorker.js
```

这两种项目结构主要有两点差别：
* 第一种统一将Redux放在src下，而第二种将Redux拆分后各部分直接放在src下
* 后者将使用了Redux的组件显式拆分成UI组件和容器组件，层次清晰

第一种有着明显的Vue全家桶开发痕迹，但整个技术栈的层次清晰。第二种更适合React全家桶的开发模式，显式将使用了Redux的组件拆分，这点有着明显的优点。

或许，结合两者的优点是更好的选择：将Redux相关的写到一个文件，显式写出容器组件

### 路由配置

在Vue中，我们习惯于通过一个配置文件t统一管理路由，像这样：

```javascript
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    }
  ]
})

```

而在React中，路由也是组件。需要像下面这样把根组件App改造成一个Router组件。至于子路由，可以直接在这个文件配置，也可以在需要的组件下再嵌套

```javascript
// App.js
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact render={() => (
            <Redirect to="/recommend" />
          )} />
          <Route path="/recommend" component={Recommend} />
        </Switch>
    </Router>
    );
  }
}

// Recommend.js
export const Recommend = ({match}) => ({
  <Route path={`${match.url}/:Id`} component={SingerDetail} />
  <Route exact path={match.url} render={() => SomeComp />
})
```

### 监听数据变化

这个大概是两个框架的最大差别了。

在Vue中，我们可以很方便地设置计算属性和watch来处理数据变化时的逻辑。

在React中，为达到同样的目的，我使用了shouldComponentUpdate()、componentWillReceiveProps()这两个钩子函数。
```javascript
shouldComponentUpdate(nextProps, nextState) {
  // 监测state变化
  if (nextStates.foo !== nextState.foo) {
    // doSomething
  }
}
componentWillReceiveProps(nextProps) {
   // 监测props变化
   if (nextProps.baz !== nextProps.baz) {
    // doSomething
  }
}
```

### 列表和条件渲染

在Vue中，列表和条件渲染可以方便的分别通过v-for、v-if或者v-show来实现。

在React中，我们需要采用jsx的方式：

```javascript
// 列表渲染
const listItems = {
  // key是必须的，有助于提升重新渲染时的性能
  array.map((item, index) => (
    <li key={index}>{item}</li>
  }
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);

// 条件渲染
const UserCenter = this.props.isLogIn ? : <LogOut /> : <LogIn />
```

### 数据管理

Vue有Vuex，React对应着Redux。不过，Redux比Vuex使用起来复杂得多。

四句话就能说请Vuex的用法：

**1、设置state对象：里面包含所有需要全局管理的数据**
**2、设置mutation-types：一个数据对应一个类型，如：**
```javascript
export const SET_DATA='SET_DATA'
```
**3、设置mutation：一个mutation改变一个state里的数据，仅赋值**
**4、设置action：每个action可包含复杂逻辑、异步请求，通过commit提交mutation一个或多个请求**

Redux就复杂多了，又是中间件、又是react-redux，不过我经过多天的爬坑也可提炼个基本套路：

**1、设置action-types：一个数据对应一个类型，如：**
```javascript
export const SET_DATA='SET_DATA'
```
**2、编写Actions.js：一个数据对应一个Action生成器，为每个Action编写一个函数派发它，最后编写派发多个action的函数**<br>
**3、编写Reducer文件夹：index.js，负责合成子Reducer，并提供state里所有数据的接口；若干个子Reducer，为接受每个Action更新state里的对应数据**<br>
**4、设置store：传入将合成后的Reducer、中间件**<br>
**5、拆分组件：将需要使用全局数据的组件用一个空组件包裹，将Redux的数据接口提供给mapStateToProps，actions提供给mapDispatchToProps，通过connect将外层组件变为容器组件，给内层组件传入属性、方法**

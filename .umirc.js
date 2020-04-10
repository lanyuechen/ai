
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  hash: true,
  publicPath: '/ai/',
  routes: [
    {
      path: '/',
      component: '../pages/index',
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: false,
      dynamicImport: false,
      title: 'AI五子棋',
      dll: false,
      
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}

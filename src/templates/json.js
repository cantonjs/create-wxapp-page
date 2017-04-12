export default (options) => `// Window configuration
// https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#window
{
	// 类型：HexColor；默认值：#000000
	// 导航栏背景颜色，如"#000000"
	"navigationBarBackgroundColor": "#ffffff",
	// 类型：String；默认值：white
	// 导航栏标题颜色，仅支持 black/white
	"navigationBarTextStyle": "black",
	// 类型：String；默认值：无
	// 导航栏标题文字内容
	"navigationBarTitleText": "${options.name}",
	// 类型：HexColor；默认值：#ffffff
	// 窗口的背景色
	"backgroundColor": "#000000",
	// 类型：String；默认值：dark
	// 下拉背景字体、loading 图的样式，仅支持 dark/light
	"backgroundTextStyle": "light",
	// 类型：Boolean；默认值：false
	// 是否开启下拉刷新，详见页面相关事件处理函数。
	// https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html?t=1476197491005#页面相关事件处理函数
	"enablePullDownRefresh": false
}
`;

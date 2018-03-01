import React from 'react';
import ReactDOM from 'react-dom';
import Xlsx from 'xlsx';
import _ from "underscore";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/grid";

const listEdit = list => {
	let item
	let items = []
	let itemss = []
	let content = []
	let proportion = []
	let chart = []
	for (let i = 0; i < list.length; i++) {
		if (list[i].item !== undefined) {
			item = list[i].item;
		} else {
			list[i].item = item
		}
		items.push(item)
	}
	const set = new Set(items);
	for (let i = 0; i < set.size; i++) {
		itemss.push(_.where(list, {
			item: [...set][i]
		}))
	}
	for (let i = 0; i < itemss.length; i++) {
		content.push(_.pluck(itemss[i], 'content'));
		proportion.push(_.pluck(itemss[i], 'proportion'));
	}
	for (let i = 0; i < set.size; i++) {
		chart.push({
			item: [...set][i],
			content: content[i],
			proportion: proportion[i]
		})
	}

	return chart
}

class Flie extends React.Component {
	constructor() {
		super()
		this.state = {
			chart: []
		}
	}

	componentDidUpdate() {
		this.state.chart.map((obj, indexs) => {
				let datas = []
				obj.proportion.map((res, index) => {
					let data = new Array(obj.proportion.length).fill('-')
					data[index] = res
					datas.push({
						data,
						name: obj.content[index],
						type: 'bar',
						barCategoryGap: '60%',
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'top',
									formatter: function(params) {
										return (params.value * 100).toFixed(1) + '%'
									}
								}
							}
						}
					})
				})
				echarts.init(document.getElementById(`main${indexs}`)).setOption({
					title: {
						text: obj.item,
						left: 'center'
					},
					grid: {
						width: '75%',
						x: '5%'
					},
					legend: {
						left: '80%',
						itemWidth: 14,
						orient: 'vertical',
						top: 'middle',
						selectedMode: false
					},
					xAxis: {
						type: 'category',
						boundaryGap: true,
						data: obj.content,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true
						}
					},
					yAxis: {
						type: 'value',
						splitLine: {
							show: false
						},
						boundaryGap: [0, 0.01],
						axisTick: {
							inside: true
						},
						axisLabel: {
							formatter: function(value) {
								return (value * 100).toFixed(1) + '%'
							}
						}
					},
					series: datas
				})
			}

		)
	}

	handleChange(e) {
		let rABS = true
		let files = e.target.files
		let f = files[0]
		let reader = new FileReader()
		reader.onload = e => {
			let data = e.target.result;
			if (!rABS) {
				data = new Uint8Array(data);
			}
			let workbook = Xlsx.read(data, {
				type: rABS ? 'binary' : 'array'
			})
			let list = Xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
			let chart = listEdit(list)
			this.setState({
				chart
			})
		}
		if (rABS) {
			reader.readAsBinaryString(f)
		} else {
			reader.readAsArrayBuffer(f)
		}
	}

	render() {
		return (
			<div>
				<input type="file" onChange={this.handleChange.bind(this)} />
				{this.state.chart.map((obj,index)=>
			<div key={index} id={`main${index}`} style={{ width: 1400, height: 400 }}></div>
				)}
			</div>
		)
	}
}
class App extends React.Component {
	render() {
		return (
			<div>
				<Flie />
			</div>
		)
	}
}
ReactDOM.render(
	<App />,
	document.getElementById('root')
);
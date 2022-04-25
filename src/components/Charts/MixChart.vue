<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import request from '@/utils/request'
import { on } from 'codemirror'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      allDatas: [],
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 请求数据
      request({
        url: '/order/queryData',
        method: 'post',
        data: {
          time: 1650965933371
        }
      }).then(data => {
        const cateMap = []
        const idToMap = new Map()
        const len = data.data.length
        for (let i = 0; i < len; i++) {
          const item = data.data[i]
          for (let j = 0; j < item.length; j++) {
            const objs = JSON.parse(item[j].order_items)
            for (let k = 0; k < objs.length; k++) {
              const obj = objs[k]
              if (cateMap[obj.id] == null) {
                cateMap[obj.id] = Array(len).fill(0)
              }
              idToMap.set(obj.id, obj.name)
              cateMap[obj.id][i] += (obj.count)
            }
          }
        }
        const alldata = []
        idToMap.forEach(function(value, key) {
          // console.log(key,value);
          const data = {}
          data.name = value
          data.type = 'bar'
          data.stack = 'to'
          data.barMaxWidth = 35
          data.barGap = '10%'
          data.data = cateMap[key]
          alldata.push(data)
        })
        this.chart.setOption({
          backgroundColor: '#344b58',
          title: {
            text: '近日数据',
            x: '20',
            top: '20',
            textStyle: {
              color: '#fff',
              fontSize: '22'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '16'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            borderWidth: 0,
            top: 150,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          legend: {
            x: '5%',
            top: '10%',
            textStyle: {
              color: '#90979c'
            },
            data: menu
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0

            },
            data: xData
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
          dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [
              0
            ],
            bottom: 30,
            start: 10,
            end: 80,
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'

            },
            textStyle: {
              color: '#fff' },
            borderColor: '#90979c'

          }, {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }],
          series: alldata
        })
        console.log(alldata)
      })

      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = []
        const day = new Date().getDay()
        const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        for (let i = 6; i >= 0; i--) {
          data.push(week[(day - i + 7) % 7])
        }
        return data
      }())
      var menu = ['1', '2', '3']
      var datas = {}
      datas.name = '233333'
      datas.type = 'bar'
      datas.stack = 'to'
      datas.barMaxWidth = 35
      datas.barGap = '10%'
      datas.data = [1, 2, 3, 4, 5, 6, 7]
    }
  }
}
</script>

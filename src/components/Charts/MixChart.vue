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
        data:{
          time:1650965933371
        }
      }).then(data=>{
        let cateMap = [];
        let idToMap = [];
        let len =data.data.length
        for(let i=0;i<len;i++){
         let item= data.data[i];
         for(let j=0;j<item.length;j++){
          let objs=JSON.parse(item[j].order_items)
          for(let k=0;k<objs.length;k++){
            let obj=objs[k];
            if(cateMap[obj.id]==null){
              cateMap[obj.id]=Array(len).fill(0);
            }
            idToMap[obj.id]=obj.name;
            cateMap[obj.id][i]+=(obj.count)
          }
         }
         
        }
        for(let i=0;i<idToMap.length;i++){
          
        }
      })
      
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = [];
        let day=new Date().getDay();
        let week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        for (let i = 6; i >0;i--) {
          data.push(week[(day-i+7)%7])
        }
        return data
      }())
      var menu=['1','2','3']
      var datas={};
      datas.name='233333'
      datas.type='bar'
      datas.stack='to'
      datas.barMaxWidth=35
      datas.barGap='10%'
      datas.data=[1,2,3,4,5,6,7]
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
        series: [datas,

        {
          name: 'apc滴小含苞',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            327,
            1776,
            507,
            1200,
            800,
            482,
            204,
            1390,
            1001,
            951,
            381,
            220
          ]
        }, {
          name: '共计',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            1036,
            3693,
            2962,
            3810,
            2519,
            1915,
            1748,
            4675,
            6209,
            4323,
            2865,
            4298
          ]
        }
        ]
      })
    }
  }
}
</script>

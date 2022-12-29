<script setup lang="ts">
import { ref, onMounted, computed, watch, unref } from "vue";
import * as THREE from "three";
import type {
  PerspectiveCamera,
  Scene,
  Renderer,
  AnimationMixer,
  Camera,
} from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as echarts from "echarts";
import { getCurrentTime, getCurrentDate } from "@/utils/date";
import { ClickOutside as vClickOutside } from "element-plus";

// ------- 渲染3D模型逻辑 -------
const clock = new THREE.Clock();

let container = ref();
let scene: Scene;
let camera: Camera;
let loader: FBXLoader;
let renderer: Renderer;
let mixer: AnimationMixer;
let controls: OrbitControls;

const initScene = () => {
  console.log("Initializing Scene...");
  scene = new THREE.Scene();

  loader = new FBXLoader();
  loader.load("/new.fbx", (fbx) => {
    fbx.position.set(-50, 0, 20);
    scene.add(fbx);
    mixer = new THREE.AnimationMixer(fbx);
    console.log(fbx.animations);
    if (fbx.animations[0]) {
      let action = mixer.clipAction(fbx.animations[0]);
      action.play();
    }
  });

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(61, 18, 5.8);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth * 0.6, window.innerHeight * 0.6);
  container.value.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  controls = new OrbitControls(camera, renderer.domElement);

  render();
};

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  if (mixer) mixer.update(clock.getDelta());
  // console.log(camera.position)
}

// ------- 缺陷历史表格逻辑 -------

const popoverRef = ref();

// const comfirm = ["确认缺陷","缺陷错误"                                                                                                                                                                                  ]
// let currentDefect = ref(0)
// let confirmDefect = ref(comfirm[currentDefect.value])

const tableData = [
  {
    index: "01_1",
    deviceId: "Alpha1",
    cameraId: "C1",
    recordTime: "2022-11-17 12:39:01",
    defectType: "爆丝",
    defectLocation: 25.32,
    image: "whatever",
    manualConfirmedResult: "正确",
    confirmedOwner: "Xu",
  },
  {
    index: "02_2",
    deviceId: "Alpha1",
    cameraId: "C1",
    recordTime: "2022-11-17 12:39:01",
    defectType: "爆丝",
    defectLocation: 25.32,
    image: "whatever",
    manualConfirmedResult: "正确",
    confirmedOwner: "Xu",
  },
  {
    index: "03_3",
    deviceId: "Alpha1",
    cameraId: "C1",
    recordTime: "2022-11-17 12:39:01",
    defectType: "爆丝",
    defectLocation: 25.32,
    image: "whatever",
    manualConfirmedResult: "正确",
    confirmedOwner: "Xu",
  },
  {
    index: "03_3",
    deviceId: "Alpha1",
    cameraId: "C1",
    recordTime: "2022-11-17 12:39:01",
    defectType: "爆丝",
    defectLocation: 25.32,
    image: "whatever",
    manualConfirmedResult: "正确",
    confirmedOwner: "Xu",
  },
];

interface Defect {
  index: string;
  deviceId: string;
  cameraId: string;
  recordTime: string;
  defectType: string;
  defectLocation: number;
  image: string;
  manualConfirmedResult: string;
  confirmedOwner: string;
}

const tableRow = ({ row, rowIndex }: { row: Defect; rowIndex: number }) => {
  if (rowIndex % 2 === 0) return "table-row-odd";
  return "table-row-even";
};

// const confirmRight = () => {
//   manualConfirmedResult: "正确",
// }
//
// let confirmOption = computed(() => {
//   if (confirmDefect.value === "确认缺陷") return confirmRight
//   else if (confirmDefect.value === "缺陷错误") return confirmWorng
//   else return confirmRight
// })

// ------- 页面时间 -------
let currentTime = ref("");
let currentDate = ref("");

// ------- 设备信息 -------
let deviceNum = ref(8);
let shouldAlarm = ref("开启");

// ------- 良品率 -------
const periods = ["日", "周", "月"];

let currentPeriodIndex = ref(0);
let goodRateTimePeriod = ref(periods[currentPeriodIndex.value]);
let defectTypeTimePeriod = ref(periods[currentPeriodIndex.value]);

// ------- 各类图表自动切换展示 -------
let currentPieIndex = ref(-1);
const pieDataLength = 6;

function dispatchPieAction(chart: echarts.ECharts | null | undefined) {
  // 取消之前高亮的图形
  chart &&
    chart.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: currentPieIndex.value,
    });
  currentPieIndex.value = (currentPieIndex.value + 1) % pieDataLength;
  // 高亮当前图形
  chart &&
    chart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: currentPieIndex.value,
    });
  // 显示 tooltip
  chart &&
    chart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: currentPieIndex.value,
    });
}

function randArray(len: number, min: number, max: number) {
  return Array.from(
    { length: len },
    (v) => Math.floor(Math.random() * (max - min)) + min
  );
}

const lineOptionDay = {
  xAxis: {
    type: "category",
    data: [
      "第一天",
      "第二天",
      "第三天",
      "第四天",
      "第五天",
      "第六天",
      "第七天",
    ],
  },
  yAxis: {
    max: 100,
    min: 0,
    axisLine: { show: true },
    splitLine: { show: false },
  },
  series: [
    {
      data: [92, 98, 94, 88, 95, 99, 97],
      type: "line",
      label: {
        show: true,
        position: "top",
      },
    },
  ],
};

const lineOptionWeek = {
  xAxis: {
    type: "category",
    data: [
      "第一周",
      "第二周",
      "第三周",
      "第四周",
      "第五周",
      "第六周",
      "第七周",
    ],
  },
  yAxis: {
    max: 100,
    min: 0,
    axisLine: { show: true },
    splitLine: { show: false },
  },
  series: [
    {
      data: randArray(7, 85, 100),
      type: "line",
      label: {
        show: true,
        position: "top",
      },
    },
  ],
};

const lineOptionMonth = {
  xAxis: {
    type: "category",
    data: [
      "第一月",
      "第二月",
      "第三月",
      "第四月",
      "第五月",
      "第六月",
      "第七月",
    ],
  },
  yAxis: {
    max: 100,
    min: 0,
    axisLine: { show: true },
    splitLine: { show: false },
  },
  series: [
    {
      data: randArray(7, 85, 100),
      type: "line",
      label: {
        show: true,
        position: "top",
      },
    },
  ],
};

let lineOption = computed(() => {
  if (goodRateTimePeriod.value === "日") return lineOptionDay;
  else if (goodRateTimePeriod.value === "周") return lineOptionWeek;
  else if (goodRateTimePeriod.value === "月") return lineOptionMonth;
  else return lineOptionDay;
});

let lineChart = ref<echarts.ECharts>();
let pieChart = ref<echarts.ECharts>();
let graphChart = ref<echarts.ECharts>();

watch(lineOption, async (newOption, oldOption) => {
  lineChart.value &&
    lineOption.value &&
    lineChart.value.setOption(lineOption.value);
});

// ------- 声明周期钩子 -------
onMounted(() => {
  initScene();

  setInterval(() => {
    currentTime.value = getCurrentTime(new Date());
    currentDate.value = getCurrentDate(new Date());
  }, 1000);

  lineChart.value = echarts.init(
    document.getElementById("line-chart") as any as HTMLElement
  );
  lineOption.value && lineChart.value.setOption(lineOption.value);

  pieChart.value = echarts.init(
    document.getElementById("pie-chart") as any as HTMLElement
  );
  let pieOptionDay = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "缺陷类型统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "32",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 234, name: "爆丝" },
          { value: 120, name: "缺丝" },
          { value: 80, name: "抽筋起扭" },
          { value: 74, name: "压伤" },
          { value: 40, name: "绞花" },
          { value: 20, name: "翻丝" },
        ],
      },
    ],
  };
  let pieOptionWeek = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "缺陷类型统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "32",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "爆丝" },
          { value: 770, name: "缺丝" },
          { value: 580, name: "抽筋起扭" },
          { value: 484, name: "压伤" },
          { value: 300, name: "绞花" },
          { value: 300, name: "翻丝" },
        ],
      },
    ],
  };
  let pieOptionMonth = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "缺陷类型统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "32",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 5048, name: "爆丝" },
          { value: 2870, name: "缺丝" },
          { value: 2080, name: "抽筋起扭" },
          { value: 1684, name: "压伤" },
          { value: 1200, name: "绞花" },
          { value: 900, name: "翻丝" },
        ],
      },
    ],
  };
  let pieOption = computed(() => {
    if (defectTypeTimePeriod.value === "日") return pieOptionDay;
    else if (defectTypeTimePeriod.value === "周") return pieOptionWeek;
    else if (defectTypeTimePeriod.value === "月") return pieOptionMonth;
    else return pieOptionDay;
  });

  pieOption.value && pieChart.value.setOption(pieOption.value);
  watch(pieOption, async (newOption, oldOption) => {
    pieChart.value &&
      pieOption.value &&
      pieChart.value.setOption(pieOption.value);
  });

  dispatchPieAction(pieChart.value);

  setInterval(() => {
    dispatchPieAction(pieChart.value);
  }, 5000);
});

// 屏幕尺寸参考: (1920, 1080)

// ------- 缺陷类型表格逻辑 -------
const defectData = [
  {
    defectType: "爆丝",
    defectNum: "1048",
  },
  {
    defectType: "缺丝",
    defectNum: "770",
  },
  {
    defectType: "抽筋起扭",
    defectNum: "580",
  },
  {
    defectType: "压伤",
    defectNum: "484",
  },
  {
    defectType: "绞花",
    defectNum: "300",
  },
  {
    defectType: "翻丝",
    defectNum: "300",
  },
];
const defectDataWeek = [
  {
    defectType: "爆丝",
    defectNum: "1048",
  },
  {
    defectType: "缺丝",
    defectNum: "770",
  },
  {
    defectType: "抽筋起扭",
    defectNum: "580",
  },
  {
    defectType: "压伤",
    defectNum: "484",
  },
  {
    defectType: "绞花",
    defectNum: "300",
  },
  {
    defectType: "翻丝",
    defectNum: "300",
  },
];

// let defectData = computed(() => {
//   if (defectTypeTimePeriod.value === "日") return defectDataDay
//   else if (defectTypeTimePeriod.value === "周") return defectDataWeek
//   else if (defectTypeTimePeriod.value === "月") return defectDataWeek
//   else return defectDataDay
// })
</script>

<template>
  <div
    style="
      background-color: #081623;
      background-size: cover;
      min-height: 100vh;
      margin: 0px;
      padding: 0px;
    "
  >
    <div class="top-bar">
      <div class="logo"><p class="title-font">LOGO</p></div>
      <div class="system-name"><p class="title-font">钢缆缺陷智检系统</p></div>
      <div class="clock">
        <div class="time">
          <p class="title-font">{{ currentTime }}</p>
        </div>
        <div class="date">
          <p class="title-font" style="font-size: 12px">{{ currentDate }}</p>
        </div>
      </div>
    </div>
    <el-row id="top">
      <el-col :span="16" id="top-left">
        <div
          style="align-content: left; margin: 0px; border: none; padding: 0px"
        >
          <div ref="container" style="width: 56vw"></div>
        </div>
      </el-col>
      <el-col :span="8" id="top-right">
        <el-row id="device-section" style="margin-top: 3vh">
          <el-col :span="9" id="manufacture-speed">
            <p class="title-font">当前产线运行速度</p>
            <p class="title-font">30m/s</p>
          </el-col>
          <el-col :span="15" id="device-info">
            <div><p class="title-font">设备信息</p></div>
            <div
              style="
                background-color: #133b5e;
                margin-right: 1.67vw;
                display: flex;
                margin-top: 2vh;
              "
            >
              <p
                class="small-font"
                style="font-size: 18px; align-self: center; margin-left: 1vw"
              >
                设备数量
              </p>
              <p
                class="small-font"
                style="font-size: 24px; align-self: center; margin-left: 11.5vw"
              >
                {{ deviceNum }}
              </p>
              <p class="small-font" style="align-self: center">台</p>
            </div>
            <el-row id="device-alive" style="margin-top: 1vh">
              <el-col :span="8" id="normal">
                <div style="display: flex">
                  <el-icon color="green"><SuccessFilled /></el-icon>
                  <div style="text-align: left">
                    <p class="small-font">正常</p>
                    <div style="display: flex">
                      <p class="small-font" style="font-size: 24px">6</p>
                      <p class="small-font" style="align-self: center">台</p>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8" id="need-clean">
                <div style="display: flex">
                  <el-icon color="yellow"><WarningFilled /></el-icon>
                  <div style="text-align: left">
                    <p class="small-font">需要清洁</p>
                    <div style="display: flex">
                      <p class="small-font" style="font-size: 24px">1</p>
                      <p class="small-font" style="align-self: center">台</p>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8" id="disconnect">
                <div style="display: flex">
                  <el-icon color="red"><CircleCloseFilled /></el-icon>
                  <div style="text-align: left">
                    <p class="small-font">失去连接</p>
                    <div style="display: flex">
                      <p class="small-font" style="font-size: 24px">1</p>
                      <p class="small-font" style="align-self: center">台</p>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="alarm" style="display: flex">
              <p>声光报警</p>
              <div style="margin-left: 50px">
                <el-radio-group v-model="shouldAlarm" size="small">
                  <el-radio-button label="开启" />
                  <el-radio-button label="关闭" />
                </el-radio-group>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="good-rate-graph" style="margin-top: 2vh">
          <div style="display: flex">
            <p class="title-font">良品率 百分比</p>
            <div style="margin-left: 50px">
              <el-radio-group v-model="goodRateTimePeriod">
                <el-radio-button label="日" />
                <el-radio-button label="周" />
                <el-radio-button label="月" />
              </el-radio-group>
            </div>
          </div>
          <div id="line-chart" style="width: 30vw; height: 35vh"></div>
        </div>
      </el-col>
    </el-row>
    <el-row id="bottom">
      <el-col :span="16" id="bottom-left">
        <div class="history-list">
          <p class="title-font" style="margin-top: 1.5vh">缺陷历史</p>
          <div style="margin-top: 1.5vh">
            <el-table
              :data="tableData"
              :row-class-name="tableRow"
              :header-cell-style="{
                background: '#133B5E',
                border: 'none',
                fontSize: '16px',
                color: 'white',
                fontWeight: '700',
              }"
              style="--el-table-border-color: none"
            >
              <el-table-column
                prop="index"
                label="序号"
                min-width="6%"
                align="center"
              />
              <el-table-column
                prop="deviceId"
                label="设备ID"
                min-width="10%"
                align="center"
              />
              <el-table-column
                prop="cameraId"
                label="相机ID"
                min-width="8%"
                align="center"
              />
              <el-table-column
                prop="recordTime"
                label="记录时间"
                min-width="16%"
                align="center"
              />
              <el-table-column
                prop="defectType"
                label="缺陷类型"
                min-width="10%"
                align="center"
              />
              <el-table-column
                prop="defectLocation"
                label="缺陷位置"
                min-width="10%"
                align="center"
              />
              <el-table-column
                prop="image"
                label="图像"
                min-width="10%"
                align="center"
              >
                <!--                <template #default="scope">-->
                <!--                  <img src="@/assets/defect.png" style="width: 1.8vw; height: auto"/>&ndash;&gt;-->
                <!--                   -->
                <!--                </template>-->
                <template #default="scope">
                  <el-popover
                    placement="top"
                    :width="620"
                    :hight="700"
                    trigger="click"
                  >
                    <template #reference>
                      <!--                      <el-avatar src="@/assets/defect.png" style="width: 1.8vw; height: auto" />-->
                      <img
                        src="@/assets/defect.png"
                        style="width: 1.8vw; height: auto"
                      />
                    </template>

                    <template #default>
                      <img
                        src="@/assets/defect.png"
                        style="width: 600px; height: 600px"
                      />
                      <div>
                        <el-button
                          type="success"
                          @click="handleEditRow(scope.$index)"
                        >
                          确认缺陷
                        </el-button>
                        <el-button type="danger"> 缺陷错误 </el-button>
                      </div>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="manualConfirmedResult"
                label="人工确认结果"
                min-width="14%"
                align="center"
              >
                <!--                <editable-cell-->
                <!--                    :show-input="row.editMode"-->
                <!--                    slot-scope="{row}"-->
                <!--                    editable-component="el-select"-->
                <!--                    close-event="change"-->
                <!--                    v-model="row.manualConfirmedResult">-->

                <!--                  <el-tag size="medium"-->
                <!--                          :type="row.manualConfirmedResult === 'M' ? 'primary' : 'danger'"-->
                <!--                          slot="content">-->
                <!--                    {{row.manualConfirmedResult === 'M' ? 'Male': 'Female'}}-->
                <!--                  </el-tag>-->
                <!--                </editable-cell>-->
              </el-table-column>
              <el-table-column
                prop="confirmedOwner"
                label="确认者身份"
                min-width="10%"
                align="center"
              />
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="8" id="bottom-right">
        <div style="display: flex">
          <p class="title-font">缺陷类型</p>
          <div>
            <el-radio-group v-model="defectTypeTimePeriod">
              <el-radio-button label="日" />
              <el-radio-button label="周" />
              <el-radio-button label="月" />
            </el-radio-group>
          </div>
        </div>
        <div style="display: flex">
          <div id="pie-chart" style="width: 24vw; height: 24vh"></div>
          <div class="defect-category-list"></div>
          <el-col :span="16">
            <div style="display: flex">
              <el-scrollbar height="200px">
                <div class="defect-table">
                  <el-table
                    :data="defectData"
                    :row-class-name="defectRow"
                    :header-cell-style="{
                      background: '#133B5E',
                      border: 'none',
                      fontSize: '16px',
                      color: 'white',
                      fontWeight: '700',
                    }"
                    style="--el-table-border-color: none"
                  >
                    <el-table-column
                      prop="defectType"
                      label="缺陷类型"
                      min-width="100px"
                      align="center"
                    />
                    <el-table-column
                      prop="defectNum"
                      label="缺陷数量"
                      min-width="100px"
                      align="center"
                    />
                  </el-table>
                </div>
              </el-scrollbar>
            </div>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.history-list {
  width: 63.3vw;
  margin-left: 1.67vw;
}
.title-font {
  font-family: "Source Han Sans CN";
  font-weight: 700;
  font-size: 24px;
  color: white;
}

.small-font {
  font-family: "Source Han Sans CN";
  font-weight: 400;
  font-size: 14px;
  color: white;
}

.device-section {
  display: flex;
}

.device-section .manufacture-speed {
  text-align: center;
  width: 15vw;
}

.device-section .device-speed {
  width: 25vw;
}

.top-bar {
  height: 64px;
  width: 100%;
  background-color: #133b5e;
  display: flex;
}

.logo {
  margin-left: 1.5vw;
  align-self: center;
}

.system-name {
  margin-left: 100px;
  align-self: center;
}

.clock {
  margin-left: 73vw;
  align-self: center;
  text-align: right;
}

.clock .time {
  font-size: 24px;
}

.clock .date {
  font-size: 12px;
}
</style>

<style>
.el-table .table-row-odd {
  --el-table-tr-bg-color: #081623;
  color: white;
}

.el-table .table-row-even {
  --el-table-tr-bg-color: #172437;
  color: white;
}

.scrollbar[data-v-472cff63] {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  text-align: center;
  border-radius: 4px;
  background: #ffffff;
  color: #ffffff;
  font-size: 15px;
  margin-right: 30px;
}
</style>

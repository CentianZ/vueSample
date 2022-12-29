import axios from 'axios'

const baseURL = "http://localhost:5000"

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: baseURL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
})

// 导出 axios 实例
export default service;
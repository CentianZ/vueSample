import request from '@/utils/request'


export function useAiDefectDetectionAdminApi() {
    return {
        getDefectHistory: (params?: object) => {
            return request({
                url: "/api/getDefectHistory",
                method: "get",
                params
            })
        }
    }
}
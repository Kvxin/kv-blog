import request from '@/utils/request'

export interface UploadResponse {
    filename: string
    originalName: string
    url: string
    size: number
    mimeType: string
}

// 上传图片
export const uploadImage = (formData: FormData): Promise<UploadResponse> => {
    return request.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 上传多个图片
export const uploadImages = (formData: FormData): Promise<UploadResponse[]> => {
    return request.post('/upload/images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 上传文档
export const uploadDocument = (formData: FormData): Promise<UploadResponse> => {
    return request.post('/upload/document', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 上传视频
export const uploadVideo = (formData: FormData): Promise<UploadResponse> => {
    return request.post('/upload/video', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 删除文件
export const deleteFile = (filename: string): Promise<void> => {
    return request.delete(`/upload/file/${filename}`)
}
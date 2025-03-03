// videoAPI.js (Frontend)
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/video';

export const fetchVideos = async (params) => {
    const options = {
        method: 'GET',
        url: `${BASE_URL}/getVideos`,
        params,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };

    try {
        const response = await axios.request(options);
        const videos = response.data.videos || [];
        
        return videos.map(video => ({
            ...video,
            thumbnailUrl: `${BASE_URL}/file/${video.thumbnailFileId}`,
            videoUrl: `${BASE_URL}/file/${video.videoFileId}`
        }));
    } catch (error) {
        console.error('Error fetching videos:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return [];
    }
};
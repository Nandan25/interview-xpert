export const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

export const API_PATHS = {
    PROFILE: {
        GetUserProfile: `/profile/profile`,
        LOGIN: `${API_BASE_URL}/auth/google`,
        REGISTER: `/profile/register`,

    },
    AUTH: {
        GetUserProfile: `/profile/profile`,
        LOGIN: `/profile/login`,
        REGISTER: `/profile/register`,

    },
    SESSION: {
        GET_ALL: `/sessions/my-sessions`,
        GET_ONE: `/sessions/`,
        CREATE: `/sessions/create`,
        DELETE: `/sessions/`,
    },
    QUESTION: {
        PIN: `/questions/pin/`,
        ADD_NOTE: `/questions/note/`,
        GENERATE_MORE_QUESTIONS: `/questions/generate-more/`,
    }
    , AI: {
        Generate_Questions: `/ai/generate-questions`,
        Generate_Explanation: `/ai/generate-explanation`,
    }
}








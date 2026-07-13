import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // Direct path to local backend

// Helper to get token authorization headers
const getHeaders = () => {
  const token = localStorage.getItem('lumen_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Axios client to make requests to backend endpoints
const client = axios.create();

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err);
    throw new Error(err.response?.data?.message || err.response?.data?.detail || 'An error occurred');
  }
);

// Global mock/adapter for local development execution
const localDb = {
  auth: {
    isAuthenticated: async () => {
      const token = localStorage.getItem('lumen_token');
      return !!token;
    },
    me: async () => {
      try {
        const res = await client.get(`${API_BASE}/users/profile`, { headers: getHeaders() });
        const profile = res.data.data;
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.name,
          onboarding_role: profile.role || 'Student',
        };
      } catch (e) {
        return null;
      }
    },
    loginViaEmailPassword: async (email, password) => {
      const res = await client.post(`${API_BASE}/auth/login`, { email, password });
      const token = res.data.data.access_token;
      localStorage.setItem('lumen_token', token);
      return res.data.data;
    },
    register: async ({ email, password }) => {
      // Map user registration to backend auth flow
      const res = await client.post(`${API_BASE}/auth/register`, {
        email,
        password,
        name: email.split('@')[0],
      });
      // Store temporary token for OTP verification bypass
      if (res.data.data?.access_token) {
        localStorage.setItem('lumen_register_token', res.data.data.access_token);
      }
      return res.data;
    },
    verifyOtp: async ({ email, otpCode }) => {
      // Local dev OTP verification bypass
      const regToken = localStorage.getItem('lumen_register_token');
      if (regToken) {
        localStorage.setItem('lumen_token', regToken);
        localStorage.removeItem('lumen_register_token');
        return { access_token: regToken };
      }
      // Return a dummy token if registering was not in progress
      return { access_token: 'mock-local-token' };
    },
    resendOtp: async (email) => {
      return true;
    },
    setToken: (token) => {
      localStorage.setItem('lumen_token', token);
    },
    logout: () => {
      localStorage.removeItem('lumen_token');
      window.location.href = '/login';
    },
    updateMe: async ({ onboarding_role }) => {
      const res = await client.put(`${API_BASE}/users/role`, { role_name: onboarding_role }, { headers: getHeaders() });
      return res.data;
    },
    resetPassword: async () => true,
    resetPasswordRequest: async () => true,
    loginWithProvider: (provider, redirectUrl) => {
      window.location.href = redirectUrl || '/';
    },
    redirectToLogin: () => {
      window.location.href = '/login';
    }
  },
  entities: {
    Experience: {
      list: async () => {
        try {
          const res = await client.get(`${API_BASE}/stories`, { headers: getHeaders() });
          // Map backend stories list format to frontend Experience model
          return (res.data.data || res.data).map(story => ({
            id: story.id,
            title: story.title,
            description: story.description,
            category: story.target_role || 'General',
            scenes: (story.scenes || []).map(scene => ({
              title: scene.learning_objective || `Scene ${scene.scene_number + 1}`,
              narrative: scene.scenario_text,
              context: scene.character_information || 'Pay close attention to details.',
              choices: scene.choices_json || []
            }))
          }));
        } catch (e) {
          return [];
        }
      },
      get: async (id) => {
        try {
          const res = await client.get(`${API_BASE}/stories`, { headers: getHeaders() });
          const stories = res.data.data || res.data;
          const story = stories.find(s => s.id === parseInt(id));
          if (!story) return null;
          return {
            id: story.id,
            title: story.title,
            description: story.description,
            category: story.target_role || 'General',
            scenes: (story.scenes || []).map(scene => ({
              title: scene.learning_objective || `Scene ${scene.scene_number + 1}`,
              narrative: scene.scenario_text,
              context: scene.character_information || 'Pay close attention to details.',
              choices: scene.choices_json || []
            }))
          };
        } catch (e) {
          return null;
        }
      }
    },
    UserProgress: {
      list: async () => {
        try {
          const res = await client.get(`${API_BASE}/stories`, { headers: getHeaders() });
          return [];
        } catch (e) {
          return [];
        }
      },
      filter: async ({ experience_id }) => {
        return [];
      },
      create: async ({ experience_id }) => {
        try {
          const res = await client.post(`${API_BASE}/story/start`, { story_id: parseInt(experience_id) }, { headers: getHeaders() });
          const data = res.data.data;
          return {
            id: data.progress_id || 1,
            experience_id,
            status: 'in_progress',
            current_scene: 0,
            progress_percent: 0,
          };
        } catch (e) {
          return { experience_id, status: 'in_progress' };
        }
      },
      update: async (id, updateFields) => {
        return { id, ...updateFields };
      }
    },
    Achievement: {
      list: async () => []
    },
    Resource: {
      list: async () => {
        try {
          const res = await client.get(`${API_BASE}/recommendations`, { headers: getHeaders() });
          return (res.data.data || []).map((text, idx) => ({
            id: idx,
            title: text,
            description: 'Actionable guidance recommendations.',
            category: 'Safety Guidelines',
            created_date: new Date().toISOString()
          }));
        } catch (e) {
          return [];
        }
      }
    },
    Reflection: {
      list: async () => [],
      create: async ({ experience_id, rating, answers }) => {
        try {
          const res = await client.post(`${API_BASE}/ai/reflection`, {
            story_id: parseInt(experience_id),
            what_you_learned: answers?.learned || 'Identify indicators and signs.',
            signs_noticed: answers?.signs || 'Isolation or controlled movements.',
            action_taken: answers?.action || 'Report to safety helplines.'
          }, { headers: getHeaders() });
          return res.data;
        } catch (e) {
          return {};
        }
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' }),
      InvokeLLM: async ({ prompt, response_json_schema }) => {
        // Direct mapping for reflection analysis call to FastAPI reflection endpoint
        // Look for parameters inside prompt
        const matchL = prompt.match(/1\. What did you learn\?\n([\s\S]*?)\n\n2\./);
        const matchS = prompt.match(/2\. What signs did you notice\?\n([\s\S]*?)\n\n3\./);
        const matchA = prompt.match(/3\. What action would you take\?\n([\s\S]*?)\n\nBased/);

        const what_you_learned = matchL ? matchL[1].trim() : "Observe control patterns.";
        const signs_noticed = matchS ? matchS[1].trim() : "Closely monitored movement.";
        const action_taken = matchA ? matchA[1].trim() : "Notify authorities.";

        try {
          const res = await client.post(`${API_BASE}/ai/reflection`, {
            story_id: 1,
            what_you_learned,
            signs_noticed,
            action_taken
          }, { headers: getHeaders() });
          return res.data.data;
        } catch (e) {
          // Local fallback mock matching schema
          return {
            summary: "Your reflection shows a strong awareness of indicators.",
            key_lessons: [
              "Recognize control in communication.",
              "Use verified reporting channels.",
              "Keep safety as the highest priority."
            ],
            personal_insight: "You demonstrate a proactive safety mindset."
          };
        }
      }
    }
  }
};

globalThis.__B44_DB__ = localDb;

// Globals injection mock for Base44 local runner environment
globalThis.createAxiosClient = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((reqConfig) => {
    if (reqConfig.url.includes('/public-settings/')) {
      reqConfig.adapter = async () => ({
        data: { id: 'lumen-app', public_settings: {} },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: reqConfig
      });
    }
    return reqConfig;
  });
  instance.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
  );
  return instance;
};

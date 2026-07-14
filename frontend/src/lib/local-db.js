import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // Direct path to local backend

// Synchronize tokens on initialization to support existing sessions
const existingToken = localStorage.getItem('lumen_token');
if (existingToken && !localStorage.getItem('base44_access_token')) {
  localStorage.setItem('base44_access_token', existingToken);
}

// Helper to get token authorization headers
const getHeaders = () => {
  const token = localStorage.getItem('base44_access_token') || localStorage.getItem('lumen_token');
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
      const token = localStorage.getItem('base44_access_token') || localStorage.getItem('lumen_token');
      return !!token;
    },
    me: async () => {
      try {
        const res = await client.get(`${API_BASE}/users/profile`, { headers: getHeaders() });
        const profile = res.data.data;
        const roleMapReverse = {
          'Student': 'student',
          'Parent': 'parent',
          'Hotel Staff': 'hotel_staff',
          'Volunteer': 'volunteer'
        };
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.name,
          onboarding_role: roleMapReverse[profile.role_name] || 'student',
        };
      } catch (e) {
        return null;
      }
    },
    loginViaEmailPassword: async (email, password) => {
      const res = await client.post(`${API_BASE}/auth/login`, { email, password });
      const token = res.data.data.access_token;
      localStorage.setItem('lumen_token', token);
      localStorage.setItem('base44_access_token', token);
      try {
        const { appParams } = await import('@/lib/app-params');
        appParams.token = token;
      } catch (e) {}
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
        localStorage.setItem('base44_access_token', regToken);
        localStorage.removeItem('lumen_register_token');
        try {
          const { appParams } = await import('@/lib/app-params');
          appParams.token = regToken;
        } catch (e) {}
        return { access_token: regToken };
      }
      return { access_token: 'mock-local-token' };
    },
    resendOtp: async (email) => {
      return true;
    },
    setToken: (token) => {
      localStorage.setItem('lumen_token', token);
      localStorage.setItem('base44_access_token', token);
      try {
        import('@/lib/app-params').then(({ appParams }) => {
          appParams.token = token;
        });
      } catch (e) {}
    },
    logout: () => {
      localStorage.removeItem('lumen_token');
      localStorage.removeItem('base44_access_token');
      try {
        import('@/lib/app-params').then(({ appParams }) => {
          appParams.token = null;
        });
      } catch (e) {}
      window.location.href = '/login';
    },
    updateMe: async ({ onboarding_role }) => {
      const roleMap = {
        'student': 'Student',
        'parent': 'Parent',
        'hotel_staff': 'Hotel Staff',
        'volunteer': 'Volunteer'
      };
      const backendRoleName = roleMap[onboarding_role] || onboarding_role;
      const res = await client.put(`${API_BASE}/users/role`, { role_name: backendRoleName }, { headers: getHeaders() });
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
          const res = await client.get(`${API_BASE}/story/progress`, { headers: getHeaders() });
          return (res.data.data || []).map(p => ({
            id: p.id,
            experience_id: p.story_id.toString(),
            status: p.completed ? 'completed' : 'in_progress',
            current_scene: p.current_scene,
            progress_percent: Math.round(p.completion_percentage || 0)
          }));
        } catch (e) {
          return [];
        }
      },
      filter: async ({ experience_id }) => {
        try {
          const list = await localDb.entities.UserProgress.list();
          return list.filter(p => p.experience_id === experience_id.toString());
        } catch (e) {
          return [];
        }
      },
      create: async ({ experience_id }) => {
        try {
          const profileRes = await client.get(`${API_BASE}/users/profile`, { headers: getHeaders() });
          const userId = profileRes.data?.data?.id;
          const res = await client.post(`${API_BASE}/story/start`, {
            user_id: userId,
            story_id: parseInt(experience_id)
          }, { headers: getHeaders() });
          const data = res.data.data;
          return {
            id: data.progress_id || 1,
            experience_id: experience_id.toString(),
            status: 'in_progress',
            current_scene: 0,
            progress_percent: 0,
          };
        } catch (e) {
          return { id: 1, experience_id: experience_id.toString(), status: 'in_progress', current_scene: 0, progress_percent: 0 };
        }
      },
      update: async (id, updateFields) => {
        try {
          const completed = updateFields.status === 'completed' || updateFields.progress_percent === 100;
          await client.put(`${API_BASE}/story/progress/${id}`, {
            current_scene: updateFields.current_scene || 0,
            completed: completed,
            completion_percentage: updateFields.progress_percent || 0.0
          }, { headers: getHeaders() });
          return { id, ...updateFields };
        } catch (e) {
          return { id, ...updateFields };
        }
      }
    },
    Achievement: {
      list: async () => []
    },
    Resource: {
      list: async () => {
        try {
          const res = await client.get(`${API_BASE}/recommendations`, { headers: getHeaders() });
          return (res.data.data || []).map((item, idx) => {
            const isObj = item && typeof item === 'object';
            return {
              id: isObj ? (item.id || idx) : idx,
              title: isObj ? (item.title || '') : item,
              desc: isObj ? (item.description || 'Actionable guidance recommendations.') : 'Actionable guidance recommendations.',
              description: isObj ? (item.description || 'Actionable guidance recommendations.') : 'Actionable guidance recommendations.',
              category: isObj ? (item.category || 'Safety Guidelines') : 'Safety Guidelines',
              type: isObj ? (item.type || 'Guide') : 'Guide',
              duration: isObj ? (item.duration || '5 min read') : '5 min read',
              url: isObj ? (item.resource_url || '') : '',
              created_date: new Date().toISOString()
            };
          });
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
  },
  settings: {
    get: async () => {
      try {
        const res = await client.get(`${API_BASE}/settings`, { headers: getHeaders() });
        return res.data;
      } catch (e) {
        return { dark_mode: false, email_notifications: true, profile_visible: true };
      }
    },
    update: async (settingsData) => {
      try {
        const res = await client.put(`${API_BASE}/settings`, settingsData, { headers: getHeaders() });
        return res.data;
      } catch (e) {
        return settingsData;
      }
    }
  },
  dashboard: {
    getStats: async () => {
      try {
        const res = await client.get(`${API_BASE}/dashboard`, { headers: getHeaders() });
        return res.data;
      } catch (e) {
        return {
          completed_stories_count: 0,
          in_progress_stories_count: 0,
          saved_resources_count: 0,
          achievements_count: 0,
          overall_progress_percentage: 0
        };
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

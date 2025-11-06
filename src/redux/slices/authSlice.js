import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

// Async thunks cho các action bất đồng bộ

/**
 * Đăng ký tài khoản
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Đăng nhập
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Lấy thông tin profile
 */
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (uniqueId, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile(uniqueId)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Kiểm tra session
 */
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (uniqueId, { rejectWithValue }) => {
    try {
      const response = await authService.checkSession(uniqueId)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Gia hạn session
 */
export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (uniqueId, { rejectWithValue }) => {
    try {
      const response = await authService.refreshSession(uniqueId)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Lấy thông tin user từ token
 */
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Verify token
 */
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.verifyToken(token)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial state
const initialState = {
  user: authService.getCurrentUser(),
  uniqueId: localStorage.getItem('uniqueId'),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  profile: null,
  session: null,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Đăng xuất
    logout: (state) => {
      authService.logout()
      state.user = null
      state.uniqueId = null
      state.token = null
      state.isAuthenticated = false
      state.profile = null
      state.session = null
      state.error = null
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Set user from localStorage (khi refresh page)
    setUserFromStorage: (state) => {
      state.user = authService.getCurrentUser()
      state.uniqueId = localStorage.getItem('uniqueId')
      state.token = authService.getToken()
      state.isAuthenticated = authService.isAuthenticated()
    }
  },
  extraReducers: (builder) => {
    // Register cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.uniqueId = action.payload.uniqueId
        state.token = action.payload.token || state.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user || action.payload
        state.uniqueId = action.payload.user?.uniqueId || action.payload.uniqueId
        state.token = action.payload.token || state.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
    // Fetch profile cases
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
    // Check session cases
    builder
      .addCase(checkSession.fulfilled, (state, action) => {
        state.session = action.payload
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.error = action.payload
        // Nếu session không hợp lệ, đăng xuất user
        if (action.payload.includes('Session')) {
          authService.logout()
          state.user = null
          state.uniqueId = null
          state.token = null
          state.isAuthenticated = false
        }
      })
      
    // Refresh session cases
    builder
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.session = action.payload
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.error = action.payload
      })
      
    // Fetch me cases
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.profile = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
    // Verify token cases
    builder
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isValid || false
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.error = action.payload
        state.isAuthenticated = false
        // Nếu token không hợp lệ, đăng xuất user
        if (action.payload.includes('Token')) {
          authService.logout()
          state.user = null
          state.uniqueId = null
          state.token = null
        }
      })
  }
})

// Export actions
export const { logout, clearError, setUserFromStorage } = authSlice.actions

// Export selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsLoading = (state) => state.auth.isLoading
export const selectError = (state) => state.auth.error
export const selectProfile = (state) => state.auth.profile
export const selectSession = (state) => state.auth.session

// Export reducer
export default authSlice.reducer

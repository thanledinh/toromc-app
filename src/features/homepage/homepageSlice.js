import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiEndPoints } from '../../router/endPoints'

const sortByDisplayOrder = (collection) => {
  if (!Array.isArray(collection)) {
    return []
  }
  return [...collection].sort((a, b) => {
    const orderA = typeof a?.display_order === 'number' ? a.display_order : Number.MAX_SAFE_INTEGER
    const orderB = typeof b?.display_order === 'number' ? b.display_order : Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })
}

const prepareHomepagePayload = (payload = {}) => {
  const {
    navLinks = [],
    stats = [],
    ipAddresses = [],
    featureCards = [],
    modes = [],
    steps = [],
    faqs = [],
    contactCards = [],
    upcomingEvents = [],
  } = payload

  return {
    navLinks: sortByDisplayOrder(navLinks).map(({ id, anchor_id, label }) => ({
      id,
      anchorId: anchor_id,
      label,
    })),
    stats: sortByDisplayOrder(stats).map(({ id, key, label, value, suffix, subLabel }) => ({
      id,
      key,
      label,
      value,
      suffix,
      subLabel,
    })),
    ipAddresses: sortByDisplayOrder(ipAddresses).map(({ id, label, address, description, note }) => ({
      id,
      label,
      value: address,
      description,
      note,
    })),
    featureCards: sortByDisplayOrder(featureCards).map(({ display_order, ...rest }) => rest),
    modes: sortByDisplayOrder(modes).map(({ display_order, ...rest }) => rest),
    steps: sortByDisplayOrder(steps).map(({ display_order, ...rest }) => rest),
    faqs: sortByDisplayOrder(faqs).map(({ display_order, ...rest }) => rest),
    contactCards: sortByDisplayOrder(contactCards).map(({ display_order, ...rest }) => rest),
    upcomingEvents: sortByDisplayOrder(upcomingEvents).map(({ display_order, ...rest }) => rest),
  }
}

const toAbsoluteUrl = (maybeUrl) => {
  if (!maybeUrl || typeof maybeUrl !== 'string') {
    return ''
  }
  try {
    // If already absolute
    const url = new URL(maybeUrl, new URL(apiEndPoints.SETTINGS).origin)
    return url.toString()
  } catch (_) {
    return ''
  }
}

const prepareSettingsPayload = (payload = {}) => {
  const backgroundImage = toAbsoluteUrl(payload.background_image)
  const logoUrl = toAbsoluteUrl(payload.logo_url)
  const welcomeTitle = typeof payload.welcome_title === 'string' ? payload.welcome_title : ''
  return { backgroundImage, logoUrl, welcomeTitle }
}

export const fetchHomepage = createAsyncThunk('homepage/fetchHomepage', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(apiEndPoints.HOMEPAGE)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Không thể tải dữ liệu trang chủ')
    }

    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Không thể kết nối đến máy chủ')
  }
})

export const fetchSettings = createAsyncThunk('homepage/fetchSettings', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(apiEndPoints.SETTINGS)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Không thể tải cấu hình')
    }
    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Không thể kết nối đến máy chủ')
  }
})

const initialState = {
  data: {
    navLinks: [],
    stats: [],
    ipAddresses: [],
    featureCards: [],
    modes: [],
    steps: [],
    faqs: [],
    contactCards: [],
    upcomingEvents: [],
  },
  status: 'idle',
  error: null,
  lastUpdated: null,
  settings: {
    backgroundImage: '',
    logoUrl: '',
    welcomeTitle: '',
  },
  settingsStatus: 'idle',
  settingsError: null,
}

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepage.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchHomepage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = prepareHomepagePayload(action.payload)
        state.error = null
        state.lastUpdated = Date.now()
      })
      .addCase(fetchHomepage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error?.message || 'Đã xảy ra lỗi' 
      })
      .addCase(fetchSettings.pending, (state) => {
        state.settingsStatus = 'loading'
        state.settingsError = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settingsStatus = 'succeeded'
        state.settings = prepareSettingsPayload(action.payload)
        state.settingsError = null
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsStatus = 'failed'
        state.settingsError = action.payload || action.error?.message || 'Đã xảy ra lỗi'
      })
  },
})

export const selectHomepageData = (state) => state.homepage.data
export const selectHomepageStatus = (state) => state.homepage.status
export const selectHomepageError = (state) => state.homepage.error
export const selectHomepageLastUpdated = (state) => state.homepage.lastUpdated
export const selectHomepageSettings = (state) => state.homepage.settings
export const selectHomepageSettingsStatus = (state) => state.homepage.settingsStatus
export const selectHomepageSettingsError = (state) => state.homepage.settingsError

export default homepageSlice.reducer


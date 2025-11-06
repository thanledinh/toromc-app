# ToroMC App - Cấu trúc dự án

## 📁 Cấu trúc thư mục

```
src/
├── assets/          # Tài nguyên tĩnh (hình ảnh, styles)
│   ├── images/      # Hình ảnh
│   └── styles/      # CSS files
├── components/      # React components
│   ├── common/      # Components dùng chung
│   ├── forms/       # Form components
│   ├── icons/       # Icon components
│   └── ui/          # UI components (Button, Toast, etc.)
├── configs/         # Cấu hình ứng dụng
│   ├── api.js       # API endpoints và config
│   └── constants.js # Constants và enums
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
├── pages/           # Page components
├── redux/           # Redux store và slices
│   ├── slices/      # Redux slices
│   └── store/       # Store configuration
├── routers/         # Routing configuration
├── services/        # API services
└── utils/           # Utility functions
```

## 🎯 Lợi ích của cấu trúc mới

### 1. **Tách biệt rõ ràng (Separation of Concerns)**
- **Components**: Chỉ chứa UI logic
- **Services**: Xử lý API calls
- **Utils**: Helper functions
- **Configs**: Cấu hình tập trung

### 2. **Dễ bảo trì (Maintainability)**
- Code được tổ chức theo chức năng
- Dễ tìm và sửa lỗi
- Tái sử dụng code hiệu quả

### 3. **Scalability**
- Dễ thêm features mới
- Không bị conflict khi nhiều dev làm việc
- Cấu trúc chuẩn cho dự án lớn

### 4. **Performance**
- Tree shaking hiệu quả với index.js exports
- Lazy loading dễ dàng implement
- Bundle size được tối ưu

## 🔧 Cách sử dụng

### Import Components
```javascript
// Thay vì import từ nhiều file
import { MenuIcon } from '../components/icons/MenuIcon'
import { Toast } from '../components/ui/Toast'

// Chỉ cần import từ index
import { MenuIcon, Toast } from '../components'
```

### Import Configs
```javascript
import { API_ENDPOINTS, ROUTES, ANIMATION } from '../configs'
```

### Import Services
```javascript
import { homepageService, apiService } from '../services'
```

### Import Utils
```javascript
import { copyToClipboard, scrollToElement } from '../utils'
```

## 📋 Quy tắc đặt tên

- **Components**: PascalCase (VD: `AnimatedCounter.jsx`)
- **Hooks**: camelCase với prefix "use" (VD: `useToast.js`)
- **Services**: camelCase với suffix "Service" (VD: `homepageService.js`)
- **Utils**: camelCase (VD: `copyToClipboard.js`)
- **Constants**: UPPER_SNAKE_CASE (VD: `API_ENDPOINTS`)

## 🚀 Best Practices

1. **Luôn tạo index.js** cho mỗi thư mục để export
2. **Tách logic phức tạp** thành custom hooks
3. **Sử dụng constants** thay vì hard-code values
4. **Tạo reusable components** trong thư mục common
5. **Kiểm tra linter errors** thường xuyên

## 📦 Thêm features mới

### Thêm Component mới:
1. Tạo component trong thư mục phù hợp
2. Export trong index.js của thư mục đó
3. Import và sử dụng

### Thêm API Service:
1. Tạo service trong `src/services/`
2. Export trong `src/services/index.js`
3. Sử dụng trong Redux slices hoặc components

### Thêm Redux Slice:
1. Tạo slice trong `src/redux/slices/`
2. Export trong `src/redux/slices/index.js`
3. Thêm vào store configuration

Cấu trúc này đảm bảo dự án có thể scale từ MVP đến enterprise-level application! 🎉

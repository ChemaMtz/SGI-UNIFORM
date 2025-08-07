# 🎓 Sistema de Inventario Universitario

Sistema de gestión de inventario para equipos de protección personal (EPP) desarrollado en React con Firebase.

## 📋 Características

- ✅ Gestión completa de inventario (CRUD)
- 🔍 Búsqueda y filtrado avanzado
- 📱 Diseño responsive para móviles y desktop
- 🎨 Interfaz moderna con paleta de colores personalizada
- 🔒 Autenticación segura con Firebase
- 📊 Control de stock en tiempo real
- 🚀 Navegación horizontal en tablas

## 🛠️ Tecnologías Utilizadas

- **React** 18+ - Framework de JavaScript
- **Firebase** - Backend como servicio (BaaS)
- **Material Design Icons** - Iconografía
- **CSS Modules** - Estilos modularizados

## 📦 Inventario Gestionado

- **Lentes de Seguridad** (GOG-XXX)
- **Botas Dieléctricas** (BDI-XXX)  
- **Cascos de Seguridad** (CAS-XXX)
- **Uniformes** (PMC-XXX, PML-XXX, CAM-XXX)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd int-uni
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Firestore Database
3. Copia el archivo `.env.example` a `.env`
4. Completa las variables de entorno con tu configuración de Firebase:

```env
REACT_APP_FIREBASE_API_KEY=tu_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Ejecutar la aplicación
```bash
npm start
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

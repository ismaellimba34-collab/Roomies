# RoomieCBA — Contexto del proyecto

## Qué es
App móvil nativa para que **estudiantes universitarios de Córdoba, Argentina** encuentren roomies compatibles para compartir departamento. Es "Tinder + plataforma inmobiliaria": cada usuario tiene un perfil verificado (carrera, universidad, presupuesto, zona preferida, hábitos de convivencia), hace swipe (Like/Dislike) sobre otros perfiles y, cuando hay match mutuo, se abre un chat en tiempo real para coordinar la búsqueda.

**Problema que resuelve**
- Alquilar solo es impagable para estudiantes del interior.
- Las inmobiliarias piden garantías inalcanzables para jóvenes sin historial crediticio.
- No hay una plataforma confiable para encontrar compañeros de departamento.
- La desconfianza entre desconocidos es el mayor freno para compartir vivienda.

## Cómo trabajamos
- Ismael (dueño del proyecto) trabaja solo. Comunicate en **español rioplatense**, con explicaciones claras y pasos concretos, incluyendo los comandos que tenga que correr en su Mac.
- Ismael prueba la app en su **celular con Expo Go**. No tiene emulador. Vos no podés ejecutar la app en un dispositivo: no asumas pruebas visuales, y decile qué revisar en el celu después de cada cambio.
- Su Mac es un MacBook Pro 2012 con macOS Catalina (Node 20 como máximo). Mantené las dependencias livianas.
- **Un módulo por tarea.** Cambios chicos y revisables, en su propia rama, con commits claros.
- Antes de cambiar algo grande (estructura de carpetas, esquema de Firestore, dependencias), explicá el plan y esperá el OK.

## Stack
- React Native + **Expo SDK 57** con **Expo Router** (las rutas van en `src/app/`, los componentes en `src/components/`).
- TypeScript (viene de la plantilla).
- Estilos con `StyleSheet` nativo de React Native.
- Backend: **Firebase** — Authentication (Email/Password), Cloud Firestore, Firebase Storage (fotos de perfil y departamentos).
  - Project ID: `roomiecba` · Auth domain: `roomiecba.firebaseapp.com` · Región Firestore: `nam5`.
  - Usar el **Firebase JS SDK** (`firebase`). No usar `react-native-firebase`: requiere dev build y no anda en Expo Go.
  - La sesión debe persistir entre cierres de la app (Auth con `@react-native-async-storage/async-storage`).
  - La config vive en `src/lib/firebase.ts`. Nunca inventes credenciales: usá placeholders hasta que Ismael pase el `firebaseConfig`.
- Instalá paquetes con `npx expo install <paquete>` para respetar las versiones compatibles con el SDK.
- Evitá librerías con código nativo propio que no vengan en Expo Go. Si algo futuro lo requiere (notificaciones push, Mercado Pago), avisá antes: implicaría un dev build.

## Diseño (tema oscuro)
| Uso | Color |
| --- | --- |
| Fondo principal | `#0f172a` |
| Superficie | `#1e293b` |
| Borde | `#334155` |
| Acento rosa neón | `#f43f5e` |
| Dorado | `#fbbf24` |
| Texto principal | `#f1f5f9` |
| Texto secundario | `#94a3b8` |

Centralizados en `src/theme/colors.ts`. Todos los textos de la interfaz van en español rioplatense (voseo).

## Esquema de Firestore
```
users/{uid} {
  uid, email, nombre, edad (number), carrera, universidad, ciudadOrigen,
  presupuesto (string), zonaPreferida, habitos (string[]), fotoPerfil (URL),
  pasaporteScore (0-5), pasaporteReviews (number), roomiePlus (boolean),
  creadoEn (timestamp)
}

swipes/{swipeId} { fromUserId, toUserId, direction: 'like' | 'dislike', timestamp }

matches/{matchId} { users: [uid1, uid2], creadoEn, ultimoMensaje, ultimoMensajeEn }
matches/{matchId}/messages/{msgId} { senderId, texto, timestamp }

ratings/{ratingId} {
  fromUserId, toUserId,
  limpieza (1-5), convivencia (1-5), pagoTermino (1-5),
  comentario, timestamp
}
```
No cambies este esquema sin avisar. Si hay que modificarlo, proponé el cambio primero.

## Estado de los módulos
- ✅ Scaffold inicial: Expo SDK 57 + Expo Router, estructura `src/app` / `src/components` / `src/lib` / `src/theme`, tema oscuro centralizado, `firebase.ts` con Auth (persistencia AsyncStorage), Firestore y Storage listos (con placeholders de config a completar).
- Pendiente, en este orden sugerido:
  1. Completar `firebaseConfig` real en `src/lib/firebase.ts` (Ismael lo pasa desde Firebase Console).
  2. `LoginScreen` conectado a Firebase Auth.
  3. Sesión persistente (AuthContext) y rutas separadas para login / app.
  4. Registro completo (paso 2: carrera, zona, hábitos) guardando en `users/{uid}`.
  5. `DiscoverScreen` con usuarios reales de Firestore.
  6. Swipe con gestos táctiles (`react-native-gesture-handler`).
  7. Chat en tiempo real (Firestore `onSnapshot`) entre usuarios con match.
  8. Pasaporte del Inquilino (calificaciones bidireccionales).
  9. Publicar departamento, filtros avanzados.
  10. Notificaciones push, suscripción Roomie Plus (Mercado Pago), panel B2B, build para Play Store.

## Modelo de negocio (para tener contexto de producto)
- **Freemium**: gratis con swipes limitados, chat con matches y perfil básico. **Roomie Plus** (pago con Mercado Pago): likes ilimitados, filtros avanzados y Boosts de perfil.
- **B2B** (inmobiliarias y dueños): publicaciones destacadas, badge "Aliado Fundador" en el lanzamiento (3 meses gratis), panel de propiedades y acceso al Pasaporte del Inquilino.
- **Pasaporte del Inquilino**: reputación bidireccional estilo Uber, en 3 dimensiones (limpieza, convivencia, pago a término). A largo plazo sirve como aval ante propietarios.

## Reglas
- Nunca subas secretos ni archivos `.env` al repo.
- No modifiques las reglas de seguridad de Firestore sin avisar. Están en modo de prueba durante el desarrollo y hay que endurecerlas antes de publicar.
- Al terminar cada tarea, resumí qué cambiaste, qué archivos tocaste y qué tiene que probar Ismael en el celu.

@AGENTS.md

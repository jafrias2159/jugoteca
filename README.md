# Jugoteca

Hub de juegos web con un solo código base para **web, iOS y Android**, construido con Expo Router y NativeWind (Tailwind para React Native).

## Stack

- [Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/) (rutas por archivo)
- React Native + [react-native-web](https://necolas.github.io/react-native-web/) (mismo código para las 3 plataformas)
- [NativeWind](https://www.nativewind.dev/) (clases de Tailwind sobre componentes RN)
- TypeScript

## Estructura

```
app/                  → rutas (expo-router)
  _layout.tsx          → layout raíz
  index.tsx            → catálogo
  juego/[gameId].tsx   → pantalla de juego dinámica
src/
  data/games.ts        → registro central de juegos
  components/          → WindowFrame, GameCard
  games/               → un componente por juego
```

## Desarrollo

```bash
npm install
npm run web       # navegador
npm run ios       # simulador iOS (requiere macOS)
npm run android   # emulador Android
```

## Agregar un juego nuevo

1. Crear el componente en `src/games/<nombre>/`.
2. Agregar una entrada en `src/data/games.ts` (id, título, descripción, emoji, componente).

El catálogo y la ruta `/juego/<id>` se generan solos.

# UT Austin Virtual AI-Guided Campus Tour + Productivity App

Prototype React Native (Expo) app scaffold for a UT Austin themed virtual campus tour with resources and schedule features.

Getting started

1. Install dependencies

```powershell
cd "c:/Users/ahnaf/Downloads/HackTX"
npm install
```

2. Start Expo

```powershell
npm start
```

Alternatively
```powershell
npx expo start tunnel
```
click a for android
```powershell
a
```


3. Run on a simulator or device using the Expo dev tools.

Project structure

- `App.js` - entry point, navigation
- `src/screens/*` - main screens (Home, Map, Resources, Schedule, Details)
- `src/components/*` - small UI components
- `data/*` - sample JSON data (map, resources, schedule)

Extending map / data

- Update `data/map.json` to add or edit buildings. Each feature is a GeoJSON Feature with properties: `id`, `name`, `description`, `category`.
- Resources and schedule JSON are in `data/resources.json` and `data/schedule.json`.

Assumptions

- Using Expo-managed workflow for fast prototyping.
- `react-native-maps` is used for mapping (requires native setup for some features; Expo provides compatibility via the managed workflow).
- AI-guided narration is mocked with scripted steps; real AI integration (OpenAI, Azure) is left as an integration step.

Notes on map data

- `data/map.json` is a GeoJSON-like FeatureCollection using Point geometries (centroids). To add a building, add a new Feature like:

```
{
	"type": "Feature",
	"geometry": { "type": "Point", "coordinates": [lng, lat] },
	"properties": { "id": "unique_id", "name": "Building Name", "description": "Short description" }
}
```

- For polygons, update the MapScreen parsing logic (currently reads coordinates as [lng, lat] for points). Polygons would have arrays of coordinate pairs.

Next steps you might want to do

- Add real building polygons (GeoJSON) for tappable zones.
- Integrate text-to-speech for the guided tour (Expo Speech or react-native-tts).
- Add persistent storage for user preferences and visited tracking (AsyncStorage or SQLite).

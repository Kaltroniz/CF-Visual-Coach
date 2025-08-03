# 💡 Codeforces Visual Coach

A full-stack analytics platform for competitive programmers.  
Analyze your Codeforces profile, visualize strengths and weaknesses, track your activity streaks, and receive smart problem recommendations tailored to your performance.



---

## 🚀 Live Demo

🌐 **Frontend:** [https://your-frontend-url.com](https://cf-visual-coach-9yz1.vercel.app/)  
🔗 **Backend API:** [https://your-backend-url.com/api/user/tourist](https://cf-visual-coach.onrender.com/api/user/tourist)

---

## 📌 Features

- 📊 **Tag & Rating Analytics** – Visualize problems solved by tags (e.g., DP, Graphs) and difficulty
- 🔥 **Streak Tracker** – Monitor your daily submissions and longest active streak
- 🧠 **Smart Recommendations** – Get practice problems based on your weak tags and average rating
- 📅 **Heatmap Calendar** – Track daily activity with solved/attempted submission counts
- ⚡ **Optimized Backend** – Uses in-memory caching for faster API responses
- 📱 **Fully Responsive UI** – Built with Material UI for seamless desktop/mobile experience

---

## 🧠 Tech Stack

### 💻 Frontend
- **React (v18+)**
- **Material-UI (v5+)** – UI components and responsive design
- **Recharts (v2+)** – For bar charts and performance graphs
- **Axios** – For API communication
- **date-fns** – Date calculations and calendar heatmap logic

### 🛠 Backend
- **Node.js (v18+)**
- **Express (v4+)** – API framework
- **Axios** – To fetch Codeforces user and problem data
- **CORS**, **express.json()** – Middleware

### 📡 APIs
- **Codeforces Public API**  
  - `/user.status?handle=...`  
  - `/problemset.problems`

---

## 📊 Key API Endpoint

### `GET /api/user/:handle`

Returns:

```json
{
  "solved": { "800": 10, "900": 8, ... },
  "unsolved": { "1000": 2, ... },
  "byTag": { "dp": 12, "greedy": 8, ... },
  "byRating": { "800": 15, "900": 12, ... },
  "maxStreak": 10,
  "recommendations": [
    {
      "name": "Two Buttons",
      "rating": 1100,
      "tags": ["math", "implementation"],
      "link": "https://codeforces.com/problemset/problem/520/A"
    }
  ],
  "heatmapData": {
    "2024-06-25": { "solved": 2, "attempts": 3 },
    ...
  }
}

```
## 🧑‍💻 Author
### Vivek C K
🎓 Electrical Engineering Undergraduate
🔗 GitHub: https://github.com/Kaltroniz
📫 Email: vivekck7404@gmail.com

# AI-Powered Yoga & Physiotherapy Pose Analysis Platform
## Phase-wise Development Plan — Senior Developer Blueprint (10 YOE)

> **Tech Stack Decision:** JavaScript/TypeScript (Next.js 14 + Node.js) for the web platform,
> MediaPipe Pose Landmarker (JS SDK) for real-time inference, Python (FastAPI) for
> the analytics microservice, PostgreSQL + TimescaleDB for time-series session data,
> Redis for real-time pub/sub, and WebSockets for live trainer dashboards.

---

## Executive Summary

This platform bridges a fitness trainer and their clients through an AI-powered pose analysis
system. A client opens the web app on their mobile, grants camera access, selects a session
(yoga / physiotherapy / stretching), and the system analyzes their body posture in real-time
using MediaPipe's 33-keypoint Pose Landmarker model. The system scores each pose, flags
mistakes with live audio/visual cues, and streams structured analytics to the trainer's dashboard.
After every session, a detailed PDF report is generated covering accuracy, common errors, improvement
trends, and recommendations.

---

## System Architecture Overview

```
CLIENT MOBILE (Browser)                     TRAINER DASHBOARD (Browser)
┌─────────────────────────┐                 ┌─────────────────────────────┐
│  Camera Feed            │                 │  Live Client View (tiles)   │
│  MediaPipe Inference    │                 │  Real-time skeleton overlay │
│  Pose Score UI          │                 │  Analytics + alerts panel   │
│  Audio/Visual Cues      │                 │  Session history + reports  │
└────────┬────────────────┘                 └──────────────┬──────────────┘
         │ WebSocket (pose data)                           │ WebSocket (analytics)
         ▼                                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS API LAYER                              │
│   Session Manager │ Auth (NextAuth) │ WebSocket Server │ REST APIs     │
└──────────────┬─────────────────────────────────────────────────────────┘
               │
      ┌────────┴──────────┐
      ▼                   ▼
┌──────────────┐   ┌─────────────────────────────────────────────┐
│  PostgreSQL  │   │  Python FastAPI Microservice                │
│  + Timescale │   │  (Pose Scoring Engine + Analytics Engine)   │
│  (session,   │   │  • Joint angle computation                  │
│   users,     │   │  • Pose classification & accuracy scoring   │
│   poses,     │   │  • Mistake detection & feedback generation  │
│   reports)   │   │  • Trend analysis & session summaries       │
└──────────────┘   └─────────────────────────────────────────────┘
               │
               ▼
          ┌─────────┐
          │  Redis  │ ← pub/sub for live multi-client trainer view
          └─────────┘
```

---

## Core Concepts Before Development Starts

### MediaPipe Pose Landmarker — What It Gives You

MediaPipe tracks 33 body landmarks. Each landmark has x, y, z coordinates and a visibility
score. As a senior developer you must deeply understand the landmark index map before writing
a single line of pose logic:

- Landmarks 0–10: Face (nose, eyes, ears, mouth corners)
- Landmarks 11–12: Shoulders (left, right)
- Landmarks 13–14: Elbows (left, right)
- Landmarks 15–16: Wrists (left, right)
- Landmarks 17–22: Hand edge points (pinky, index, thumb)
- Landmarks 23–24: Hips (left, right)
- Landmarks 25–26: Knees (left, right)
- Landmarks 27–28: Ankles (left, right)
- Landmarks 29–32: Foot edge points (heel, toe)

From these 33 points you can compute:
- **Joint angles** using vector dot products (e.g., elbow bend = angle between shoulder→elbow
  and elbow→wrist vectors)
- **Body alignment** (e.g., whether spine is straight = hip-shoulder-ear collinearity)
- **Symmetry** (left vs right side comparison)
- **Depth cues** using the z coordinate for front/back leaning

### Pose Reference Data Model

For every yoga or physiotherapy pose, you must define a reference object that describes
the ideal body configuration. Think of this as the "golden template" the AI compares
against. Each pose has:

- A list of critical joint angles with acceptable tolerance ranges
- A list of body alignment checks (e.g., "hips must be level within 5 degrees")
- Phase breakdown for multi-step exercises (e.g., "enter → hold → release")
- Scoring weights (not all joints are equally important for a given pose)
- Common mistake patterns with specific correction messages

---

## Phase 1: Foundation & Infrastructure
**Duration: 3–4 Weeks**
**Goal: Get the skeleton of the platform working with user auth, database schema, and basic
camera access**

### 1.1 Project Bootstrap

Start with a monorepo structure using a tool like Turborepo or Nx. Your repo should have
three workspaces from day one: `apps/web` (Next.js client + trainer dashboard), `apps/api`
(Python FastAPI for the pose scoring engine), and `packages/shared` (TypeScript types,
constants, pose reference data). This prevents the painful restructuring that always kills
projects that start as a single flat folder.

Use Docker Compose for local development immediately. You will regret not doing this from
the start the moment you add Redis and Postgres and need five people to run the same setup.

### 1.2 Database Schema Design

This is the most important architectural decision in Phase 1. Get this wrong and you'll
spend Phase 3 migrating data.

**Core Tables:**

The `users` table holds both trainers and clients. A `role` enum column distinguishes them.
Include `timezone`, `profile_photo_url`, and `onboarding_completed` boolean because these
matter for the UX later and retrofitting them is painful.

The `trainer_client_relationships` table is a join table between two users. It has `status`
(pending / active / archived), `invited_at`, `accepted_at`, and `notes` (trainer's private
notes about the client). This relationship is the backbone of permission checks — a trainer
can only see data for clients they're linked to.

The `session_templates` table stores the reusable plans a trainer creates. It has `name`,
`description`, `type` (yoga / physiotherapy / stretching), `difficulty` (beginner / intermediate
/ advanced), `duration_minutes`, and a JSONB column `pose_sequence` that holds the ordered
list of poses with their target durations and transition instructions.

The `sessions` table is where live sessions are recorded. It links to a `session_template_id`,
a `client_user_id`, and a `trainer_user_id`. It has `started_at`, `ended_at`, `status`
(scheduled / in_progress / completed / abandoned), and a JSONB `settings` column for things
like voice cues enabled/disabled, sensitivity thresholds, etc.

The `pose_attempts` table is the highest-volume table. Every few seconds during a session,
a snapshot is written here. It has `session_id`, `pose_id`, `timestamp` (use TimescaleDB
hypertable on this column), `overall_score` (0–100), `joint_scores` (JSONB — individual
score per joint), `detected_mistakes` (JSONB array of mistake codes), `landmark_data` (JSONB
storing the raw 33-point coordinates — only store this for mistake frames to save space),
and `phase` (which phase of the pose the client was in).

The `pose_library` table stores your canonical pose definitions. It has `name`, `type`,
`difficulty`, `description`, `reference_angles` (JSONB), `alignment_checks` (JSONB),
`common_mistakes` (JSONB), `thumbnail_url`, `video_guide_url`, and `coaching_cues` (JSONB).

The `reports` table stores generated post-session reports. It links to a `session_id`,
has `generated_at`, `status` (generating / ready / failed), `summary_stats` (JSONB), and
`pdf_url`. Reports are generated async after session end.

Use TimescaleDB for the `pose_attempts` table. A 30-minute session at 2 snapshots/second
is 3600 rows. A trainer with 20 active clients doing daily sessions generates 72,000 rows
per day. Timescale's chunking and compression will save you from slow analytical queries.

### 1.3 Authentication System

Use NextAuth.js v5 with credential provider (email + password) and magic link as a fallback.
JWT tokens with 7-day refresh cycles. Separate session tokens for the live camera sessions
because those WebSocket connections need to authenticate without cookies.

Implement role-based access control at the middleware level. A client user should never be
able to query another client's session data. A trainer can only access data for their linked
clients. Build a `usePermissions` hook for the frontend and a `checkPermissions` middleware
for the API.

### 1.4 Camera Access & MediaPipe Setup

On the client side, integrate MediaPipe's Pose Landmarker using the task-vision package.
The initialization is asynchronous and loads a ~6MB WASM model. You must handle the loading
state gracefully with a proper UI — the camera should stay paused on a preview screen while
the model loads, and a progress indicator should show "Preparing pose analysis..."

The model runs in one of three modes: IMAGE (single frame), VIDEO (streaming), or LIVE_STREAM.
For your use case, always use LIVE_STREAM mode. In this mode, you call `detectForVideo()`
on each animation frame using `requestAnimationFrame`, and results come back via a callback.
The model processes frames off the main thread using a Web Worker, so the UI stays smooth.

Camera constraints matter on mobile. Request `{ facingMode: 'user', width: 1280, height: 720 }`
but have a graceful fallback to 640x480. Always ask for camera permission before initializing
MediaPipe because the WASM binary is large and you don't want to load it just to hit a
permission denial.

---

## Phase 2: Pose Analysis Engine
**Duration: 4–5 Weeks**
**Goal: Build the intelligent heart of the platform — the engine that turns 33 keypoints
into meaningful feedback**

This is the most intellectually demanding phase and where senior judgment genuinely matters.
Junior developers treat this as "compare landmark positions to a reference." That produces
terrible results. You need to think like a biomechanics analyst.

### 2.1 Joint Angle Computation Module

Build a utility module (pure functions, no side effects, fully unit-testable) that computes
angles between body segments. The core function takes three landmark points — the proximal
joint, the vertex joint, and the distal joint — and returns the angle in degrees using the
dot product formula.

For example, computing elbow flexion takes the shoulder landmark as the proximal point,
the elbow as the vertex, and the wrist as the distal point. The resulting angle tells you
how bent the elbow is. 180° is fully extended; 90° is a right-angle bend.

**Key angle computations you need:**

Cervical alignment: nose → mid-shoulder line angle relative to vertical. This catches
forward head posture, which is critical for physiotherapy clients.

Shoulder flexion/abduction: the angle between the trunk and the upper arm. This tells you
how high the arm is raised.

Elbow flexion: already described above.

Wrist deviation: more complex because you need the z-axis. For basic detection, check if
the wrist landmark is significantly outside the line from elbow to fingertip.

Trunk inclination: the angle of the line from mid-hip to mid-shoulder relative to vertical.
This is your spine straightness check.

Hip flexion: the angle at the hip between the trunk and the thigh.

Knee flexion: the angle at the knee between the thigh and the shin. This is critical for
warrior poses and physiotherapy knee exercises. Flag if the knee angle during a squat
crosses below 90° for clients with knee conditions.

Ankle dorsiflexion: the angle between the shin and the foot. Important for balance poses.

Write unit tests for every one of these functions with known geometric inputs (e.g., three
points forming a perfect 90-degree angle must return exactly 90). These functions are your
ground truth — bugs here will silently corrupt every downstream score.

### 2.2 Pose Reference Library

Start with 30 poses across three categories. This is enough to build a real product and
validate the scoring engine.

**Yoga (10 poses for MVP):** Mountain Pose (Tadasana), Warrior I, Warrior II, Tree Pose,
Downward Dog, Child's Pose, Cobra Pose, Triangle Pose, Seated Forward Bend, Bridge Pose.

**Physiotherapy (10 poses for MVP):** Standing hip abduction, Clamshell exercise, Bird-dog,
Dead bug, Wall slide (shoulder), Chin tuck, Hip flexor stretch, Hamstring stretch, Quad stretch,
Thoracic extension.

**Stretching (10 poses for MVP):** Chest opener, Shoulder cross-body stretch, Neck lateral
flexion (both sides), Side bend, Seated spinal twist, Pigeon pose prep, Calf stretch, IT band
stretch, Wrist flexor stretch, Lunge hip flexor.

For each pose, define the reference object in a structured JSON file. The object has five
sections: metadata (name, category, difficulty, description, contraindications), joint targets
(the ideal angle for each relevant joint with a tolerance band — tight tolerance for critical
alignment, looser for aesthetics), alignment checks (Boolean checks like "hips level within
8 degrees," "weight centered between both feet," "shoulders not elevated"), phase definitions
(if the pose has stages, define entry criteria, hold criteria, and exit criteria), and mistake
patterns (named errors with detection logic and coaching messages).

Store these JSON files in the `packages/shared` directory so both the frontend and the Python
scoring engine can access them without duplication.

### 2.3 Scoring Engine (Python FastAPI Microservice)

Build this as a separate Python service for two reasons: Python has better biomechanics and
scientific computing libraries (NumPy, SciPy), and you may want to add an ML layer later
(scikit-learn or PyTorch for pose classification) without polluting your JavaScript codebase.

The service exposes one primary endpoint that receives a payload containing the 33 landmark
coordinates for a single frame, the pose ID being attempted, the session context (client
profile, injury flags, difficulty setting), and returns a structured score response.

The scoring logic works in three stages. First, validate that enough landmarks are visible —
if fewer than 20 of the 33 landmarks have visibility scores above 0.6, return a "low
confidence" result and don't attempt scoring. Second, run the joint angle computations and
compare each angle to the reference range for this pose. Each joint gets a sub-score based
on how far it is from the ideal, with scores dropping linearly toward the tolerance boundary
and more steeply beyond it. Third, aggregate sub-scores using the pose's defined weights to
produce an overall score from 0 to 100. A score above 85 is "Good Form," 70–84 is "Acceptable,"
50–69 is "Needs Correction," and below 50 triggers priority corrections.

The mistake detection layer runs in parallel with scoring. Each mistake pattern defined in
the pose reference has a detection function: a set of conditions (joint angle thresholds,
alignment check failures) that, when met, trigger the mistake. When a mistake is detected,
it returns the mistake code, severity (low / medium / high), a brief user-facing message
("Knee is caving inward — push it outward"), a detailed trainer-facing note ("Left knee
valgus detected, possible glute weakness or overpronation"), and the affected landmark indices
(so the frontend knows which joints to highlight).

Design the scoring endpoint to be stateless. The caller (your Next.js API layer) maintains
state. The Python service only needs the current frame data plus pose reference — it doesn't
need to remember previous frames. This keeps it fast and horizontally scalable.

However, build a separate trend analysis endpoint that accepts an array of historical score
snapshots and computes moving averages, improvement rates, and plateau detection. This runs
post-session and is latency-tolerant.

### 2.4 Real-time Feedback System

The feedback system has three output channels: visual overlay, audio cues, and dashboard alerts.

For visual overlay, render a skeleton over the camera feed on the canvas element. Use a
color-coded approach: green lines for joints in correct position, orange for joints approaching
the tolerance boundary, and red for joints out of range. Also add colored dot indicators at
specific landmark positions with a pulsing animation for high-priority mistakes. Show the
overall pose score as a large number in the top-right corner with smooth interpolation between
frames so it doesn't jump around.

For audio cues, use the Web Speech API with a synthesized voice at low volume. Prioritize
messages: only speak a correction when a mistake has persisted for more than 2 seconds (not
every frame), and wait at least 4 seconds between successive audio messages to avoid overwhelming
the user. Have a queue: if three mistakes are happening simultaneously, speak the highest-severity
one first. Let the user mute audio via a UI toggle.

For the hold timer, yoga and stretching poses often have a target hold duration. Show a circular
countdown timer on screen that starts when the pose score exceeds 70 and pauses if the score
drops below 60.

### 2.5 WebSocket Architecture for Real-time Data

Every 500ms, the client-side JavaScript aggregates the pose scores from the last 500ms of
frames (roughly 15 frames at 30fps) and sends a compressed snapshot over WebSocket to your
Next.js server. This snapshot contains the session ID, timestamp, current pose ID, aggregated
score for this interval, detected mistakes (with counts — not every frame mistake, but how many
frames in this window had each mistake), and the highest-confidence frame's landmark data.

On the server, this data is written to the `pose_attempts` table and simultaneously broadcast
via Redis pub/sub to any trainer who has this session open in their dashboard. The trainer's
dashboard receives these updates and renders a live view.

Never send raw video frames over WebSocket. Only send structured data. The bandwidth savings
are enormous, and the privacy implications of not streaming raw video to your servers are also
significant. All video processing happens on the client device.

---

## Phase 3: User Interfaces
**Duration: 4–5 Weeks**
**Goal: Build all three UI surfaces — client mobile experience, trainer dashboard, and
admin panel**

### 3.1 Client Mobile Experience

The client UI should feel like a personal AI fitness coach, not a medical tool. Design for
single-handed operation because the phone is likely propped up against something.

**Onboarding flow:** After signup, the client fills a short health profile. This includes
age, fitness level (beginner / intermediate / advanced), any injury or medical conditions from
a pre-defined list (knee injury, shoulder impingement, lower back pain, etc.), and their primary
goal (flexibility, strength, rehabilitation, stress relief). This data feeds into session
recommendations and scoring sensitivity adjustments.

**Session selection screen:** Shows upcoming scheduled sessions (from the trainer), a library
of available session templates, and recent session history. Each session card shows the pose
count, estimated duration, difficulty, and a color-coded category.

**Pre-session screen:** A setup wizard that guides camera placement. Show a silhouette of
where the client should stand relative to the camera for each session type. For standing yoga,
the phone should be placed at waist height 6–8 feet away. For mat work, it should be elevated
looking down. Give specific, visual instructions here — wrong camera placement is the number
one reason pose detection fails.

**Live session screen:** This is the most complex UI. The full-screen camera feed is the
background. A semi-transparent skeleton overlay sits on top. In the top portion, show the
current pose name, a hold timer, and the score badge. In the bottom 20% of the screen, show
the current mistake (if any) as a banner with the message. Keep the UI minimal — the person
is exercising and cannot interact with the screen. The only controls they need are pause,
end session, and mute audio.

Between poses, show a transition card that slides in from the bottom: the name and thumbnail
of the next pose, how long to hold it, and a 5-second countdown before the next pose begins.

**Post-session screen:** A simple summary showing total time, average score, best pose score,
number of mistakes, and a motivational message. A "View Full Report" button that links to the
detailed analytics.

### 3.2 Trainer Dashboard

This is where the platform's real power lives. The trainer dashboard is a web application
optimized for desktop use, though it should work on tablet.

**Overview page:** Shows today's scheduled sessions, a list of active clients with their
last session date and trend (improving / stable / declining), and a quick stats section showing
total sessions this week, average client score this week, and any flagged clients who need attention.

**Live monitoring view:** A grid of tiles, one per client currently in a live session. Each
tile shows the client's camera feed skeleton (reconstructed from landmark data, not actual video),
their current pose score, current mistake alerts, and how long they've been in the current pose.
The trainer can expand any tile to fullscreen to focus on one client. In the expanded view,
the trainer sees a panel with real-time joint angles compared to the reference ranges (a table
with colored rows), the mistake history for this session, and a text input to send a message
to the client's screen.

**Client profile page:** Detailed view for a single client. Shows their health profile, a
list of all sessions with dates and scores, and trend charts. The trend charts show: overall
session score over time (a line chart), per-pose accuracy improvement (a small multiples chart
with one sparkline per pose they've practiced), most common mistakes (a ranked bar chart), and
session frequency (a calendar heatmap).

**Session template builder:** A drag-and-drop interface for creating session templates. The
trainer selects poses from the library, drags them into sequence, sets the hold duration for
each, writes optional coaching notes that appear on the client's screen during that pose, and
saves the template. Templates can be assigned to individual clients or client groups.

**Report viewer:** After a session ends, the trainer can view and download a detailed PDF
report. The trainer can also add written notes to a report before sharing it with the client.

### 3.3 Pose Library Management

Build a pose library browser for the trainer with filtering by category, difficulty, and muscle
group. Each pose has a detail page showing the reference skeleton visualization (a static SVG
illustration, not a photo — because the skeleton overlay is what matters for consistency), the
joint angle targets, common mistakes, contraindications, and any sessions this pose appears in.

Eventually, allow trainers to create custom poses by recording themselves doing the pose and
having the system extract reference angles from that recording. That's a Phase 5 feature —
note it in the architecture but don't build it now.

---

## Phase 4: Analytics, Reporting, and Intelligence
**Duration: 3–4 Weeks**
**Goal: Turn the raw session data into actionable insights for trainers and clients**

### 4.1 Session Analytics Engine

The analytics engine is a Python module in your FastAPI service that runs post-session. It
receives the session ID, pulls all `pose_attempts` rows for that session from the database,
and produces a rich summary object.

**What it computes:**

Session-level stats: total active time (time spent in scoring mode, not transitions), average
overall score, score trajectory (did the score improve or decline over the session duration),
number of mistakes total, mistake-free percentage (what fraction of intervals had zero mistakes),
and the peak score with timestamp.

Per-pose stats: for each pose attempted in the session, compute mean score, standard deviation
(consistency), time-in-acceptable-form vs time-out-of-form, most frequent mistakes in that
pose, and whether the hold timer was completed.

Mistake analysis: for each mistake code that appeared, compute how many intervals it appeared
in, what percentage of the session, in which poses it most commonly occurred, and whether it
appeared more in the beginning or end (fatigue pattern).

Cross-session trends: compare this session to the client's previous 5 sessions for the same
template. Compute improvement rate per pose, and flag which poses are improving, stagnating,
or regressing. This is what allows the trainer to say "Your Warrior II has improved 15% over
the last two weeks but your Tree Pose is stagnating — let's focus on balance training."

### 4.2 Report Generation

Generate PDF reports using a Python library (WeasyPrint or ReportLab). Reports should be
professional enough to print and hand to a physiotherapy client or share with a referring doctor.

**Report sections:**

Cover page with the client's name, session date, session type, trainer name, and branding.

Executive summary: a one-paragraph narrative generated by calling your AI layer (Claude API)
with the session stats as input. Instruct the model to write a concise, encouraging summary
that highlights what went well and what needs work. Cap this at three sentences.

Session overview: a data table with key metrics, and a line chart of score over time
(the 500ms interval scores across the full session).

Pose-by-pose breakdown: for each pose, a small section with its name, a thumbnail illustration,
the mean score for this session vs. the running average, a list of mistakes detected with
frequency, and the coaching note the trainer attached.

Mistake patterns: a dedicated section listing the top 3–5 recurring mistakes with descriptions,
suggested corrections, and links to relevant exercises. This is where the report becomes a
training tool, not just a grade sheet.

Progress trends: charts showing improvement over time for the key poses in this program.
Include the "personal best" for each pose prominently.

Recommendations: another AI-generated section (2–3 bullet points) suggesting what to focus
on in the next session, based on the mistake patterns and trend analysis.

### 4.3 Notification System

Build a lightweight notification layer using database-backed notifications (not a third-party
service in MVP). Notifications are generated by background jobs:

After a session completes, notify the trainer that the report is ready.

If a client hasn't done a session in 7 days (and the trainer's plan calls for more frequent
practice), flag it on the trainer's overview.

If a client's score trend shows consistent decline over 3 sessions, send the trainer an alert
so they can check in.

On session start, notify the trainer so they can jump into the live monitoring view.

In Phase 5, wire these to email (SendGrid) and push notifications (via Web Push API for PWA).

---

## Phase 5: Advanced Features
**Duration: 4–6 Weeks**
**Goal: Polish, scale, and add differentiating features**

### 5.1 Progressive Web App (PWA)

Convert the client-side app to a PWA. This is critical for mobile fitness use. Add a service
worker that caches the MediaPipe WASM model after first load, so subsequent sessions start
instantly without a reload. Add the web app manifest so clients can install the app to their
home screen. Implement offline detection that gracefully pauses the session and queues data
if connectivity drops, then syncs when back online.

### 5.2 Multi-Camera and Better Camera Guidance

Add an AI-powered camera calibration step at session start. Capture 3 seconds of the client
doing a simple arm raise, analyze whether the required body landmarks are all visible and
within the frame, and give specific instructions if not ("Please step back 2 feet" or "Raise
the camera to hip height").

For physiotherapy clients doing floor exercises (bird-dog, dead bug), add a second camera mode
that processes a top-down or side-angle feed. This requires rethinking the coordinate system
for landmark analysis — document this complexity clearly and build it as a separate pose analysis
profile.

### 5.3 Group Sessions

Allow the trainer to create a session where multiple clients join simultaneously. The WebSocket
architecture already supports this conceptually — multiple clients write to the same session's
pub/sub channel. The trainer's live monitoring view shows all clients side by side. Add a
leaderboard mode (optional, trainer-controlled) that shows a friendly competition score ranking
among the group participants to motivate clients.

### 5.4 Exercise Program Builder

Build a curriculum planner that lets the trainer assign a week-by-week progression program
to a client. Each week has target sessions, and each session has a template. The system tracks
whether the client completed their assigned sessions and adjusts next week's targets based on
progress. This is essentially a lightweight periodization tool.

### 5.5 AI Coaching Suggestions for Trainers

Build a trainer-assistant feature that analyzes a client's historical mistake patterns and
suggests specific corrective exercises from the pose library. For example: "This client
consistently shows knee valgus in squatting poses. Consider adding clamshell exercises and
glute bridge work to their next two sessions." Generate these using the Claude API with the
client's mistake trend data as input.

---

## Phase 6: Production Readiness
**Duration: 3 Weeks**
**Goal: Performance, security, monitoring, and deployment**

### 6.1 Performance Optimization

The most critical performance concern is the MediaPipe inference loop on mobile. On low-end
Android devices, the model may struggle to run at 30fps. Implement an adaptive frame rate
system: start at 30fps, monitor the inference time per frame, and drop to 20fps or 15fps if
inference falls behind. The UX impact is invisible to the user, but the scoring consistency
is maintained.

For the database, add indexes on `pose_attempts` for the queries you run most: session ID +
timestamp for live session reads, client ID + session start time for history queries. The
TimescaleDB hypertable handles time-based partitioning automatically, but you still need
composite indexes on the dimensions you filter by.

Implement server-side caching for the pose library. These reference definitions don't change.
Cache them in Redis with a 24-hour TTL and serve them from there rather than hitting the
database on every session start.

For the PDF report generation, run it in a background job queue (use Bull with Redis). The
trainer's dashboard shows a "Generating report..." spinner and updates automatically via
WebSocket when the report is ready. Never block an HTTP request on PDF generation.

### 6.2 Security

Video never leaves the client device, but pose data (33 landmark coordinates) is still
biometric-adjacent data. Treat it with appropriate care. Encrypt all stored landmark data
at the database level using column encryption. Implement data retention policies — raw
landmark coordinates are deleted after 30 days, but aggregate scores and mistake summaries
are retained for the duration of the trainer-client relationship.

Implement rate limiting on all API endpoints. The WebSocket connections should be authenticated
and rate-limited to one connection per session ID per client device. Protect against replay
attacks by including a session token in every WebSocket message.

### 6.3 Observability

Instrument both the Next.js layer and the Python scoring service with structured logging.
Every scoring request should log: client ID (hashed for privacy), pose ID, inference time,
score, and number of mistakes detected. Use these logs to identify which poses have the
slowest scoring (optimization target) and which poses consistently return low scores (content
quality issue).

Add a real-time health dashboard for yourself showing: active WebSocket connections, messages
per second, scoring engine latency percentiles (P50, P95, P99), database query times, and
error rates. Use an open-source tool like Grafana with Prometheus metrics.

---

## Development Timeline Summary

| Phase | Focus | Duration | Team |
|-------|-------|----------|------|
| 1 | Foundation, Auth, DB, Camera | 3–4 weeks | 2 full-stack devs |
| 2 | Pose Analysis Engine | 4–5 weeks | 1 Python/ML dev + 1 full-stack |
| 3 | All Three UI Surfaces | 4–5 weeks | 2 frontend devs + 1 full-stack |
| 4 | Analytics & Reports | 3–4 weeks | 1 Python dev + 1 full-stack |
| 5 | Advanced Features | 4–6 weeks | Full team |
| 6 | Production Readiness | 3 weeks | Full team + DevOps |

Total for MVP (Phases 1–4): **~16 weeks** with a team of 3–4 engineers.

---

## Technology Decisions Justified

**Why Next.js over pure React + separate Express backend?**
API routes, server components, and middleware handle the routing layer cleanly. The alternative
is maintaining two separate services for what is largely BFF (backend for frontend) logic.
Reserve the Python service for compute-heavy work only.

**Why MediaPipe over alternatives (OpenPose, MoveNet)?**
MediaPipe's JS task-vision library runs entirely in the browser using WebAssembly and WebGL.
No server-side video processing, no latency, no bandwidth cost for video streams, and strong
privacy guarantees. MoveNet (TensorFlow.js) is faster but gives only 17 keypoints — insufficient
for detailed yoga analysis. OpenPose is Python-only and requires server-side processing.

**Why Python for the scoring engine?**
NumPy's vectorized operations make batch angle computations 10–50x faster than equivalent
JavaScript. The transition to ML-based pose classification in Phase 5+ is natural in Python's
ecosystem. And separating the scoring logic into its own microservice lets you swap the
implementation (pure math today, ML model tomorrow) without touching the Node.js layer.

**Why TimescaleDB over InfluxDB or MongoDB?**
TimescaleDB is PostgreSQL with time-series extensions. You already have PostgreSQL for your
relational data. Adding a second database technology for time-series data (InfluxDB) adds
operational complexity with limited benefit at your scale. TimescaleDB gives you hypertables,
continuous aggregates, and compression while keeping everything in one database system.

**Why Redis for pub/sub instead of Socket.io rooms?**
Socket.io rooms work only within a single server process. When you scale to multiple Next.js
instances behind a load balancer, Socket.io rooms break. Redis pub/sub is process-agnostic
and lets any server instance receive and forward messages to connected WebSocket clients.

---

## Key Risks and Mitigations

**Risk: Mobile browser performance too slow for real-time inference**
Mitigation: Test on the lowest-end devices your target users have (budget Android phones)
from day one of Phase 2. If MediaPipe is too slow, fall back to TensorFlow.js MoveNet with
17 keypoints for mobile and use MediaPipe only on desktop. Build the pose scoring engine
to handle both keypoint sets via an adapter pattern.

**Risk: Pose reference data is wrong and the scoring engine flags correct form as mistakes**
Mitigation: Before writing code, have a qualified yoga teacher and a physiotherapist review
and validate every pose reference JSON. The technical implementation is straightforward —
the content accuracy is the hard part and cannot be fixed by code.

**Risk: Camera placement variability makes landmark detection unreliable**
Mitigation: Implement the camera calibration wizard early (Phase 3 MVP, not Phase 5). Bad
camera placement is the most common cause of poor detection. Also add a "landmark confidence
monitor" that continuously checks visibility scores and shows a gentle warning if too many
landmarks fall below the threshold.

**Risk: Physiotherapy clients may misuse AI feedback as medical advice**
Mitigation: Add legal disclaimers at multiple points: during onboarding, at the start of
every physiotherapy session, and in every generated report. The system provides "form analysis
for guidance" and is not a substitute for in-person clinical assessment. Work with a legal
advisor before launch.

---

## What Success Looks Like at Each Phase

After Phase 1: A trainer can log in, create a session template, invite a client, and the
client can open the app on their phone and see a live camera feed with landmark overlay.
Nothing is scored yet — just the camera is working and data is flowing to the server.

After Phase 2: A client doing a Warrior II pose gets real-time scoring and at least two
meaningful mistake detections (knee over toe, front arm drooping). A trainer watching the
dashboard sees the score updating live.

After Phase 3: A trainer can build a full yoga session, assign it to a client, watch 5 clients
live on their dashboard, and click into any one for detailed joint analysis. A client gets a
polished session experience from start to finish.

After Phase 4: A trainer can view a client's progress over 4 weeks, see which poses have
improved, download a professionally designed PDF report, and make informed decisions about
adjusting the client's program.

After Phase 5: The product is differentiated from basic fitness apps by group sessions, AI
coaching suggestions, and curriculum planning. A trainer with 30+ clients would find genuine
time savings using this versus manual observation.

After Phase 6: The system handles 200 concurrent live sessions without degradation, has
documented security practices, and a monitoring setup that catches issues before users
report them.

# OptiManufact AI: Autonomous Production Planning, Scheduling & Shortage Mitigation System

> **A Complete AI & Automation Frontend Suite for Small Manufacturing Enterprises (SMEs)**  
> Designed to address disconnected customer orders, raw material shortages, machine capacity constraints, and delivery deadlines.

---

## 🏭 1. Problem Statement

Manufacturing companies often struggle to plan production efficiently because **customer orders**, **raw material availability**, **machine capacity**, and **delivery deadlines** are maintained in separate silos (Excel sheets, paper slips, whiteboards, disjointed accounting software).

This disconnection causes:
- **Production Delays:** Jobs stall midway through assembly due to missing parts or overloaded machines.
- **Material Shortages:** Raw material deficits are discovered only when the operator is already at the workcenter.
- **Missed Delivery Commitments & Penalties:** Supervisors lack real-time visibility into order urgency, leading to customer SLA penalties and damaged relationships.

### Core Question:
*How might we use AI and automation to help small manufacturing companies plan production, identify material shortages, and prioritise orders based on delivery deadlines and available resources?*

---

## 🔐 User Registration & Authentication (Role-Based Access)

The application includes a fully functional client-side authentication system with session persistence, user registration, and demo role profiles:

### 1. Default Demo Accounts (1-Click Login available on login screen):
- **Plant Operations Manager:** `manager@apexengineering.com` / `password123`
- **Lead Production Planner:** `planner@apexengineering.com` / `password123`
- **Shop-Floor CNC Specialist:** `operator@apexengineering.com` / `password123`

### 2. Register New Factory Account:
- Click **"Register New Account"** on the login screen.
- Provide Full Name, Work Email, Password, Factory/Company Name, and select your operational role.
- Upon creation, the dashboard immediately customizes itself with your factory name, assigned plant code, and role permissions!

### 3. User Profile Dropdown:
- Click the user avatar in the top right header to inspect your factory plant code, switch demo roles on the fly, or **Sign Out / Lock Session**.

---

## 🚀 Quick Start Guide (How to Run the Application)

You do **NOT** need Node.js or complex build steps. The frontend is built as a responsive Single Page Application (SPA) using HTML5, modern CSS, Tailwind CSS, Chart.js, and Lucide icons.

### Option 1: 1-Click Launch (Windows)
Double-click **`start.bat`** in this folder. It will launch the local Python server and open the app automatically in your default browser.

### Option 2: Command Line
```powershell
python start_server.py
```
Then visit: **`http://localhost:8080`**

### Option 3: Direct Browser Launch
Simply double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Opera, or Firefox.

---

## 🌐 How to Share This Website Link with Your Friends

### 1. If your friend is on the same Wi-Fi / Mobile Hotspot (Instant)
While your server is running, your friend can open their browser on their phone or laptop and go directly to:
👉 **`http://192.168.160.107:8080`**

### 2. If you want a 24/7 permanent link to share on WhatsApp / Email (Worldwide)
You can deploy it in **30 seconds for free** on Netlify:
1. Open **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag and drop this **`frontend`** folder into the drop zone.
3. It will give you a permanent public URL like **`https://optimanufact-ai.netlify.app`** that your friend can open anytime from anywhere in the world!

### 3. Instant Live Tunnel from your Computer
Double-click **`share_publicly.bat`** in this folder. It creates an instant live HTTPS link directly from your laptop without requiring any account or signup.

---

## 🎯 How This App Answers Every Question from the Problem Statement

The frontend includes dedicated, interactive modules designed to answer and demonstrate each question:

| # | Question from Problem Statement | Feature in App | Theoretical & Technical Solution |
|---|---|---|---|
| **Q1** | **How do small manufacturing companies currently manage customer orders and production schedules?** | **Executive Overview Tab** (`Q1` Badge) | Interactive comparison matrix contrasting traditional manual methods (siloed spreadsheets, physical whiteboards, WhatsApp phone calls) against unified AI orchestration, highlighting an 82% drop in stockouts. |
| **Q2** | **How can AI automatically create an efficient production schedule?** | **AI Production Schedule Tab** (`Q2` Badge) | Formulates the problem as a **Resource-Constrained Job Shop Scheduling Problem (RCJSSP)**. Employs Hybrid Genetic Algorithms and Constraint Satisfaction to generate an interactive visual Gantt chart with 1-click re-optimization. |
| **Q3** | **How should customer orders be prioritised based on delivery deadlines and urgency?** | **Order Priority & SLA Tab** (`Q3` Badge) | Implements the **Critical Ratio (CR)** formula: $$CR = \frac{\text{Due Date} - \text{Current Date}}{\text{Remaining Production Lead Time}}$$. Orders with $CR < 1.0$ (emergency) are automatically elevated to top priority, weighted by customer tier and daily SLA penalties. |
| **Q4** | **How can we monitor machine availability and production capacity in real time?** | **Machine Telemetry & OEE Tab** (`Q4` Badge) | Simulates low-cost IoT / tablet operator kiosks. Displays live status (Running, Idle, Maintenance), Overall Equipment Effectiveness ($$OEE = \text{Availability} \times \text{Performance} \times \text{Quality}$$), spindle temperature, vibration, and shift capacity gauges. |
| **Q5** | **How can AI predict possible production delays?** | **Material Shortages & Radar Tab** (`Q5` Badge) | Detects upcoming delays using queue congestion modeling, historical vendor lead-time variance, and buffer slack degradation. Displays predictive risk percentages and bottleneck stages. |
| **Q6** | **How can the system automatically notify managers about material shortages and approaching deadlines?** | **Smart Notification Drawer & Toasts** (`Q6` Badge) | Event-driven alert system triggering multi-channel notifications (in-app banners, push alerts, simulated WhatsApp and Email dispatches) with 1-click actions like "Auto-Draft Expedited PO". |
| **Q7** | **How can the system adjust production schedules when unexpected problems occur?** | **What-If Disruption Simulator Tab** (`Q7` Badge) | Interactive sandbox simulating 3 real-world disruptions: (1) Machine breakdown, (2) Supplier steel delivery delay, and (3) Sudden emergency rush order. The AI dynamically reallocates operations to alternate machines in 1.2s. |
| **Q8** | **What data is required to make accurate production plans?** | **Data Requirements Audit Tab** (`Q8` Badge) | Details the **4 Core Data Pillars**: (1) Customer Orders Master, (2) Bill of Materials (BOM) & Routing, (3) Machine & Workcenter Specs, and (4) Live Warehouse Inventory. Includes sample CSV template download. |
| **Q9** | **How can we make the system affordable and easy to use for small manufacturing companies?** | **SME Affordability & Setup Tab** (`Q9` Badge) | Outlines the SME-friendly model: zero server overhead (browser-based), $50 Android tablet kiosks, drag-and-drop Excel compatibility, and micro-SaaS pricing ($49/month) instead of $100k ERPs. |
| **Q10** | **How can we integrate the system with existing inventory and order management software?** | **ERP & Software Connectors Tab** (`Q10` Badge) | Non-invasive Integration Hub featuring connectors for TallyPrime (XML/ODBC), QuickBooks, Excel folder auto-watchers, Zoho Books, and live JSON webhook endpoints. |
| **Q11** | **How can we measure whether the system reduces production delays, costs, and material wastage?** | **KPIs, Waste & ROI Impact Tab** (`Q11` Badge) | Executive KPI dashboard tracking On-Time In-Full (OTIF: 68% -> 96%), lead time reduction (-38%), scrap reduction (-70%), and an interactive ROI slider calculating annual dollar savings. |

---

## 🎓 College Viva / Project Presentation Feature

When presenting to evaluators, professors, or clients:
1. Click the **"Project Q&A Guide (11 Answers)"** button in the top navigation bar.
2. A comprehensive evaluation modal appears with concise summaries, technical proofs, and direct links to each answering component in the app.

---

## 🛠 Project Structure

```
d:\College Projects\frontend\
├── index.html           # Main Single Page Application container
├── start.bat            # 1-click Windows batch launcher
├── start_server.py      # Python HTTP server script with auto-browser opening
├── README.md            # Complete documentation & question answers
├── css\
│   └── styles.css       # Custom industrial design system, Gantt styles & themes
└── js\
    ├── data.js          # Grounded manufacturing dataset (BOM, Orders, Machines)
    ├── scheduler.js     # AI scheduling engine, Critical Ratio & What-If simulator
    ├── charts.js        # Chart.js visual analytics (Capacity, Radar, Burn curves)
    └── app.js           # Reactive UI controller, tab router, toast & modal manager
```

---

## 📊 Key Mathematical Formulas Implemented

### 1. Critical Ratio (CR) for Order Prioritization:
$$CR = \frac{T_{\text{due}} - T_{\text{current}}}{T_{\text{remaining cycle}}}$$
- **$CR < 1.0$**: Order is behind schedule and will breach delivery deadline unless accelerated immediately.
- **$1.0 \le CR \le 1.3$**: Tight buffer. Vulnerable to machine bottlenecks.
- **$CR > 1.3$**: Safe schedule slack.

### 2. Multi-Factor Priority Score:
$$\text{Priority Score} = w_1 \cdot \text{TierWeight} + w_2 \cdot (2.0 - CR) + w_3 \cdot \text{DailyPenalty} + w_4 \cdot \text{MaterialReadiness}$$

### 3. Overall Equipment Effectiveness (OEE):
$$\text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality}$$
$$\text{Availability} = \frac{\text{Operating Time}}{\text{Planned Production Time}}$$
$$\text{Performance} = \frac{\text{Ideal Cycle Time} \times \text{Total Count}}{\text{Operating Time}}$$
$$\text{Quality} = \frac{\text{Good Count}}{\text{Total Count}}$$

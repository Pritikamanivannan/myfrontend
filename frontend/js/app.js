/**
 * OptiManufact AI - Application Controller & Reactive UI
 * Connects data, scheduling algorithms, interactive views, and student viva answers.
 */

const App = {
  currentTab: "overview",
  currentAlgorithm: "algo-hybrid",
  currentOptimizationGoal: "balanced",
  notifications: [...ManufacturingData.alerts],
  isKioskMode: false,
  currentUser: null,

  init() {
    this.setupTheme();
    AuthManager.init();
    this.currentUser = AuthManager.getCurrentUser();

    this.setupAuthUI();
    this.setupEventListeners();

    if (this.currentUser) {
      this.enterDashboard();
    } else {
      this.showAuthScreen();
    }
  },

  showAuthScreen() {
    document.getElementById("authScreen")?.classList.remove("hidden");
    document.getElementById("appLayout")?.classList.add("hidden");
    this.switchAuthTab("login");
    if (window.lucide) lucide.createIcons();
  },

  enterDashboard() {
    document.getElementById("authScreen")?.classList.add("hidden");
    document.getElementById("appLayout")?.classList.remove("hidden");

    if (this.currentUser && this.currentUser.factoryName) {
      ManufacturingData.meta.factoryName = this.currentUser.factoryName;
    }

    this.renderHeader();
    this.renderSidebar();
    this.renderTab(this.currentTab);
    this.initNotifications();

    if (window.lucide) lucide.createIcons();
  },

  setupTheme() {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    ChartsManager.refreshAll();
  },

  renderHeader() {
    const headerEl = document.getElementById("mainHeader");
    if (!headerEl) return;
    
    const unreadAlerts = this.notifications.filter(a => !a.resolved).length;

    headerEl.innerHTML = `
      <div class="flex items-center justify-between w-full px-4 lg:px-6 py-3">
        <!-- Brand & Context -->
        <div class="flex items-center space-x-3">
          <button id="mobileMenuBtn" class="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
          <div class="flex items-center space-x-2">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
              <i data-lucide="cpu" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">${ManufacturingData.meta.systemName}</span>
                <span class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">SME Edition</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">${ManufacturingData.meta.factoryName}</p>
            </div>
          </div>
        </div>

        <!-- Shift & Telemetry Badge -->
        <div class="hidden md:flex items-center space-x-4 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <div class="flex items-center space-x-2 pl-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-medium text-slate-700 dark:text-slate-300">${ManufacturingData.meta.currentShift}</span>
          </div>
          <span class="text-slate-300 dark:text-slate-600">|</span>
          <div class="text-xs text-slate-600 dark:text-slate-400">
            <span class="font-semibold text-slate-900 dark:text-white">${ManufacturingData.meta.activeOperators}</span> Active Operators
          </div>
        </div>

        <!-- Action Tools, User Profile & Presentation Guide -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- College Viva / Project Explorer Pill -->
          <button id="openVivaBtn" class="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-semibold hover:from-amber-600 hover:to-orange-600 shadow-sm transition">
            <i data-lucide="graduation-cap" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Project Q&A Guide (11 Answers)</span>
            <span class="sm:hidden">Q&A Guide</span>
          </button>

          <!-- Notification Bell -->
          <button id="notificationToggleBtn" class="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <i data-lucide="bell" class="w-5 h-5"></i>
            ${unreadAlerts > 0 ? `
              <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                ${unreadAlerts}
              </span>
            ` : ""}
          </button>

          <!-- Share Website Button -->
          <button id="openShareBtn" class="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold shadow-sm transition">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Share Link</span>
          </button>

          <!-- Theme Toggle -->
          <button id="themeToggleBtn" class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
            <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
          </button>

          <!-- Operator Kiosk Mode Toggle -->
          <button id="kioskToggleBtn" title="Toggle Shop Floor Kiosk View" class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden lg:block">
            <i data-lucide="maximize" class="w-5 h-5"></i>
          </button>

          <!-- User Profile & Account Dropdown -->
          <div class="relative">
            <button id="userProfileBtn" class="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition">
              <div class="w-7 h-7 rounded-lg ${this.currentUser?.avatarBg || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shadow-sm">
                ${this.getUserInitials(this.currentUser?.name || "Rajesh Kumar")}
              </div>
              <div class="text-left hidden sm:block">
                <span class="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px] leading-tight">${this.currentUser?.name || 'User'}</span>
                <span class="block text-[10px] text-slate-400 truncate max-w-[110px]">${this.currentUser?.role || 'Manager'}</span>
              </div>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("userProfileBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleProfileMenu();
    });
  },

  renderSidebar() {
    const sidebarEl = document.getElementById("mainSidebar");
    if (!sidebarEl) return;

    const navItems = [
      { id: "overview", label: "Executive Overview", icon: "layout-dashboard", tag: "Q1" },
      { id: "schedule", label: "AI Production Schedule", icon: "calendar-clock", tag: "Q2" },
      { id: "orders", label: "Order Priority & SLA", icon: "list-ordered", tag: "Q3" },
      { id: "machines", label: "Machine Telemetry & OEE", icon: "activity", tag: "Q4" },
      { id: "inventory", label: "Material Shortages & Radar", icon: "boxes", tag: "Q5, Q6" },
      { id: "disruptions", label: "What-If Disruption Simulator", icon: "shuffle", tag: "Q7" },
      { id: "datareadiness", label: "Data Requirements Audit", icon: "database", tag: "Q8" },
      { id: "affordability", label: "SME Affordability & Setup", icon: "sparkles", tag: "Q9" },
      { id: "integrations", label: "ERP & Inventory Connectors", icon: "network", tag: "Q10" },
      { id: "analytics", label: "KPIs, Waste & ROI Impact", icon: "trending-up", tag: "Q11" }
    ];

    sidebarEl.innerHTML = `
      <div class="py-4 flex flex-col h-full justify-between">
        <div class="px-3 space-y-1">
          <div class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Factory Control Suite
          </div>
          ${navItems.map(item => `
            <button 
              data-tab="${item.id}" 
              class="nav-tab-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition group ${
                this.currentTab === item.id 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
              }"
            >
              <div class="flex items-center space-x-2.5">
                <i data-lucide="${item.icon}" class="w-4 h-4 ${this.currentTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}"></i>
                <span>${item.label}</span>
              </div>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
                this.currentTab === item.id 
                  ? "bg-white/20 text-white" 
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }">${item.tag}</span>
            </button>
          `).join("")}
        </div>

        <!-- Quick AI System Status -->
        <div class="p-3 mx-3 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg border border-indigo-900/50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-indigo-300">AI Engine Status</span>
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p class="text-xs text-slate-300 leading-snug">Hybrid Genetic Solver active. 100% constraints satisfied.</p>
          <div class="mt-3 pt-2 border-t border-indigo-900/70 flex items-center justify-between text-[11px] text-indigo-300">
            <span>Cycle SLA Risk:</span>
            <span class="font-bold text-emerald-400">Low (97.4% OTIF)</span>
          </div>
        </div>
      </div>
    `;

    // Reattach listeners
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    this.renderSidebar();
    this.renderTab(tabId);
    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderTab(tabId) {
    const container = document.getElementById("tabContentContainer");
    if (!container) return;

    switch (tabId) {
      case "overview":
        this.renderOverviewTab(container);
        break;
      case "schedule":
        this.renderScheduleTab(container);
        break;
      case "orders":
        this.renderOrdersTab(container);
        break;
      case "machines":
        this.renderMachinesTab(container);
        break;
      case "inventory":
        this.renderInventoryTab(container);
        break;
      case "disruptions":
        this.renderDisruptionsTab(container);
        break;
      case "datareadiness":
        this.renderDataReadinessTab(container);
        break;
      case "affordability":
        this.renderAffordabilityTab(container);
        break;
      case "integrations":
        this.renderIntegrationsTab(container);
        break;
      case "analytics":
        this.renderAnalyticsTab(container);
        break;
      default:
        this.renderOverviewTab(container);
    }

    if (window.lucide) lucide.createIcons();
  },

  // ================= TAB 1: EXECUTIVE OVERVIEW (Q1) =================
  renderOverviewTab(container) {
    const kpi = ManufacturingData.kpiMetrics;
    const criticalOrders = ManufacturingData.orders.filter(o => o.riskLevel === "Critical" || o.riskLevel === "High").length;
    const runningMachines = ManufacturingData.machines.filter(m => m.status === "Running").length;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Banner Alert / Problem Formulation Context -->
        <div class="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="max-w-3xl space-y-2">
              <div class="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                <span>Problem Statement Formulation & Solution Engine</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Autonomous Production Planning & Dispatch</h1>
              <p class="text-slate-300 text-sm leading-relaxed">
                Small manufacturers historically lose 20-35% productivity because customer delivery deadlines, machine capacities, and raw material availability are tracked in separate silos. OptiManufact AI unifies these into a single dynamic constraint solver.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="App.switchTab('schedule')" class="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 transition flex items-center space-x-1.5">
                <i data-lucide="play" class="w-4 h-4"></i>
                <span>Generate Production Schedule</span>
              </button>
              <button onclick="App.openVivaModal('Q1')" class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5">
                <i data-lucide="help-circle" class="w-4 h-4"></i>
                <span>How SMEs Manage Today (Q1)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">On-Time Delivery (OTIF)</span>
              <div class="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${kpi.otif.after}%</span>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">${kpi.otif.improvement}</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">Up from traditional 68.4% manual baseline</p>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Active Capacity (OEE)</span>
              <div class="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <i data-lucide="activity" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${kpi.machineUtilization.after}%</span>
              <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">${runningMachines}/${ManufacturingData.machines.length} active</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">Idle starvation cut from 34% to 11%</p>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">At-Risk Orders</span>
              <div class="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-extrabold text-amber-600 dark:text-amber-400">${criticalOrders}</span>
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">of ${ManufacturingData.orders.length} total</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">1 shortage alert (Bronze) & 1 SLA alert</p>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Scrap & Cost Saved</span>
              <div class="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                <i data-lucide="dollar-sign" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${kpi.costSavings.improvement}</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">Scrap rate reduced from 7.8% -> 2.3%</p>
          </div>
        </div>

        <!-- Comparative Analysis: How Small Manufacturers Manage Today vs AI (Answers Q1) -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Answer to Question 1</span>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Current Traditional Management vs. OptiManufact AI</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">How small manufacturing companies currently operate vs. how automated orchestration transforms them.</p>
            </div>
            <button onclick="App.openVivaModal('Q1')" class="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1">
              <span>Read Viva Answer</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                  <th class="py-3 px-3 font-semibold uppercase">Operational Dimension</th>
                  <th class="py-3 px-3 font-semibold uppercase text-red-500 dark:text-red-400">Current Traditional Way (Manual/Excel)</th>
                  <th class="py-3 px-3 font-semibold uppercase text-emerald-600 dark:text-emerald-400">OptiManufact AI Automated Approach</th>
                  <th class="py-3 px-3 font-semibold uppercase text-blue-600 dark:text-blue-400">Measured Impact</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                ${ManufacturingData.currentVsFuture.map(row => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                    <td class="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">${row.dimension}</td>
                    <td class="py-3 px-3 text-red-600/90 dark:text-red-300/80">${row.traditional}</td>
                    <td class="py-3 px-3 text-emerald-700 dark:text-emerald-300 font-medium">${row.aiPowered}</td>
                    <td class="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">${row.benefit}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Radar Benchmark Chart & Fast Action Links -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Multi-Dimensional Performance Radar</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Benchmarking manual production control vs AI autonomous scheduling</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">6 KPI Axes</span>
            </div>
            <div class="h-72 w-full">
              <canvas id="beforeAfterKpiChart"></canvas>
            </div>
          </div>

          <!-- Quick Interactive Jump-points -->
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
            <div class="space-y-3">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Explore Project Solutions</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Directly test how this app answers every question in your project rubric:</p>
              
              <div class="space-y-2">
                <button onclick="App.switchTab('schedule')" class="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">Q2</span>
                    <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">AI Gantt Schedule Generator</span>
                  </div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
                </button>

                <button onclick="App.switchTab('orders')" class="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs">Q3</span>
                    <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">Order Critical Ratio Priority Matrix</span>
                  </div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
                </button>

                <button onclick="App.switchTab('disruptions')" class="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs">Q7</span>
                    <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">What-If Machine Breakdown Sandbox</span>
                  </div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
                </button>

                <button onclick="App.switchTab('integrations')" class="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">Q10</span>
                    <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">Tally & Excel Connectors</span>
                  </div>
                  <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
                </button>
              </div>
            </div>

            <button onclick="App.openVivaModal('ALL')" class="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>Launch Full Presentation Review</span>
            </button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => ChartsManager.initBeforeAfterChart("beforeAfterKpiChart"), 50);
  },

  // ================= TAB 2: AI PRODUCTION SCHEDULE (Q2) =================
  renderScheduleTab(container) {
    const scheduleResult = SchedulerEngine.generateSchedule(this.currentAlgorithm, this.currentOptimizationGoal);
    const lanes = scheduleResult.machineLanes;
    const metrics = scheduleResult.metrics;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Algorithm Controls -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Answer to Question 2</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">AI Production Scheduling Engine & Gantt Timeline</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">Automated multi-constraint optimization resolving order deadlines, machine speeds, setup changeover, and BOM material readiness.</p>
            </div>
            <div class="flex items-center space-x-3">
              <button onclick="App.openVivaModal('Q2')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
                <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                <span>How AI Solves This</span>
              </button>
              <button id="recalculateScheduleBtn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition flex items-center space-x-2">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                <span>Re-Optimize Schedule</span>
              </button>
            </div>
          </div>

          <!-- Optimization Configuration Selector -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${ManufacturingData.algorithms.map(algo => `
              <div 
                onclick="App.setScheduleAlgorithm('${algo.id}')"
                class="cursor-pointer p-4 rounded-2xl border-2 transition relative ${
                  this.currentAlgorithm === algo.id 
                    ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm" 
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold ${this.currentAlgorithm === algo.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}">${algo.name}</span>
                  ${this.currentAlgorithm === algo.id ? `<i data-lucide="check" class="w-4 h-4 text-blue-600"></i>` : ""}
                </div>
                <div class="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                  <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold">${algo.badge}</span>
                  <span>Latency: ${algo.speed}</span>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">${algo.description}</p>
              </div>
            `).join("")}
          </div>

          <!-- Real-Time Metrics Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700">
              <span class="text-[11px] text-slate-500">Total Makespan:</span>
              <div class="text-base font-extrabold text-slate-900 dark:text-white">${metrics.totalMakespanHours} Hours</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700">
              <span class="text-[11px] text-slate-500">Average Delay:</span>
              <div class="text-base font-extrabold text-emerald-600">${metrics.averageTardinessHours} Hrs</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700">
              <span class="text-[11px] text-slate-500">Machine Idle Time:</span>
              <div class="text-base font-extrabold text-blue-600">${metrics.idleTimePercent}%</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700">
              <span class="text-[11px] text-slate-500">Projected On-Time:</span>
              <div class="text-base font-extrabold text-emerald-600">${metrics.onTimeRatePercent}%</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700">
              <span class="text-[11px] text-slate-500">Tool Setup Savings:</span>
              <div class="text-base font-extrabold text-purple-600">${metrics.changeoverSavingsPercent}%</div>
            </div>
          </div>
        </div>

        <!-- Interactive Visual Gantt Timeline -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i data-lucide="clock" class="w-5 h-5 text-blue-600"></i>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Shop-Floor Interactive Gantt Chart (3-Shift Horizon)</h3>
            </div>
            <!-- Legend -->
            <div class="flex items-center space-x-4 text-xs">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded bg-red-100 border border-red-500"></span>
                <span class="text-slate-600 dark:text-slate-300">Urgent (CR < 1.0)</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded bg-amber-100 border border-amber-500"></span>
                <span class="text-slate-600 dark:text-slate-300">Tight Buffer</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded bg-blue-100 border border-blue-500"></span>
                <span class="text-slate-600 dark:text-slate-300">Standard Job</span>
              </div>
            </div>
          </div>

          <!-- Gantt View Box -->
          <div class="gantt-container rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <!-- Timeline hours header -->
            <div class="gantt-timeline-track mb-3 text-slate-400 font-mono-code font-semibold">
              <div class="w-56 flex-shrink-0 text-xs text-slate-700 dark:text-slate-300">Workcenter Lane</div>
              ${Array.from({ length: 14 }).map((_, i) => `
                <div class="gantt-hour-marker font-mono-code">
                  ${(i * 2).toString().padStart(2, '0')}:00h
                </div>
              `).join("")}
            </div>

            <!-- Machine Lanes -->
            <div class="space-y-3">
              ${Object.values(lanes).map(lane => `
                <div class="flex items-center">
                  <!-- Machine Label Column -->
                  <div class="w-56 flex-shrink-0 pr-4">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${lane.machine.name}</span>
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        lane.machine.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                        lane.machine.status === 'Maintenance' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }">${lane.machine.status}</span>
                    </div>
                    <div class="text-[11px] text-slate-400 font-mono-code">${lane.machine.id} · OEE: ${lane.machine.oee}%</div>
                  </div>

                  <!-- Timeline Bar Lane -->
                  <div class="gantt-lane flex-1 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    ${lane.timelineSlots.map(slot => {
                      const leftPx = Math.round(slot.startHour * 40); // 40px per hour
                      const widthPx = Math.max(90, Math.round((slot.durationHours + slot.setupHours) * 40));
                      return `
                        <div 
                          class="gantt-job-block ${slot.colorClass}"
                          style="left: ${leftPx}px; width: ${widthPx}px;"
                          onclick="App.showJobDetailModal('${slot.orderId}')"
                          title="Click to view order details & BOM"
                        >
                          <div class="flex items-center justify-between text-[11px] font-bold truncate">
                            <span class="truncate">${slot.orderId}: ${slot.customer}</span>
                            <span class="text-[10px] opacity-80">${slot.durationHours}h</span>
                          </div>
                          <div class="text-[10px] text-slate-600 dark:text-slate-300 truncate">
                            ${slot.productName}
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <p class="text-xs text-slate-400 italic">Click on any job block to inspect real-time Bill of Materials, customer SLA penalties, and machine routing.</p>
        </div>
      </div>
    `;

    document.getElementById("recalculateScheduleBtn").addEventListener("click", () => {
      this.showToast("Optimizing production schedule using " + this.currentAlgorithm + "...", "info");
      setTimeout(() => {
        this.renderScheduleTab(container);
        this.showToast("Schedule updated! 100% constraints solved with 0 late penalties.", "success");
      }, 400);
    });
  },

  setScheduleAlgorithm(algoId) {
    this.currentAlgorithm = algoId;
    this.renderScheduleTab(document.getElementById("tabContentContainer"));
  },

  // ================= TAB 3: ORDER PRIORITY & SLA (Q3) =================
  renderOrdersTab(container) {
    const orders = ManufacturingData.orders.map(o => {
      const calc = SchedulerEngine.calculateOrderPriority(o);
      return { ...o, ...calc };
    });

    // Sort by priority score descending
    orders.sort((a, b) => b.priorityScore - a.priorityScore);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Answer to Question 3</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Customer Order Prioritization & Critical Ratio (CR) Matrix</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Formula: <code class="font-mono-code bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-300">CR = (Delivery Due Date - Now) / Remaining Lead Time</code>. Combined with Customer Tier Weight & Daily Penalty.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q3')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q3)</span>
            </button>
          </div>

          <!-- Priority Legend -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center space-x-3">
              <span class="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <div>
                <span class="font-bold text-red-700 dark:text-red-300">Critical Ratio < 1.0 (Emergency)</span>
                <p class="text-[11px] text-red-600/80 dark:text-red-400">Job is mathematically late unless prioritized immediately.</p>
              </div>
            </div>
            <div class="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center space-x-3">
              <span class="w-3 h-3 rounded-full bg-amber-500"></span>
              <div>
                <span class="font-bold text-amber-700 dark:text-amber-300">Critical Ratio 1.0 - 1.3 (Tight Slack)</span>
                <p class="text-[11px] text-amber-600/80 dark:text-amber-400">Moderate buffer. Any machine fault causes slippage.</p>
              </div>
            </div>
            <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-3">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div>
                <span class="font-bold text-emerald-700 dark:text-emerald-300">Critical Ratio > 1.3 (Safe Buffer)</span>
                <p class="text-[11px] text-emerald-600/80 dark:text-emerald-400">Ample slack. Can be safely deferred to absorb disruptions.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Active Order Dispatch Queue (${orders.length} Orders)</h3>
            <button onclick="App.showNewOrderModal()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Simulate New Order Ingestion</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                  <th class="py-3 px-3 font-semibold uppercase">Priority Rank</th>
                  <th class="py-3 px-3 font-semibold uppercase">Order & Customer</th>
                  <th class="py-3 px-3 font-semibold uppercase">SKU / Product</th>
                  <th class="py-3 px-3 font-semibold uppercase">Due Date & SLA</th>
                  <th class="py-3 px-3 font-semibold uppercase">Critical Ratio (CR)</th>
                  <th class="py-3 px-3 font-semibold uppercase">Material Status</th>
                  <th class="py-3 px-3 font-semibold uppercase">Assigned Line</th>
                  <th class="py-3 px-3 font-semibold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                ${orders.map((ord, idx) => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${ord.criticalRatio < 1.0 ? 'bg-red-50/40 dark:bg-red-950/20' : ''}">
                    <!-- Rank & Score -->
                    <td class="py-3.5 px-3">
                      <div class="flex items-center space-x-2">
                        <span class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                          #${idx + 1}
                        </span>
                        <div class="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                          Score: ${ord.priorityScore}
                        </div>
                      </div>
                    </td>

                    <!-- Order & Customer -->
                    <td class="py-3.5 px-3">
                      <div class="font-bold text-slate-900 dark:text-white">${ord.id}</div>
                      <div class="text-slate-500 flex items-center space-x-1.5">
                        <span>${ord.customer}</span>
                        <span class="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-semibold">${ord.tier}</span>
                      </div>
                    </td>

                    <!-- SKU -->
                    <td class="py-3.5 px-3">
                      <div class="font-semibold">${ord.productName}</div>
                      <div class="text-slate-400 font-mono-code">${ord.sku} (Qty: ${ord.quantity})</div>
                    </td>

                    <!-- Due Date & Delay Penalty -->
                    <td class="py-3.5 px-3">
                      <div class="font-bold ${ord.diffDays <= 2 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}">
                        ${ord.dueDate} (${ord.diffDays} days left)
                      </div>
                      <div class="text-slate-400">Penalty: $${ord.penaltyPerDay}/day late</div>
                    </td>

                    <!-- Critical Ratio -->
                    <td class="py-3.5 px-3">
                      <div class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold ${ord.badgeClass}">
                        <span>CR: ${ord.criticalRatio}</span>
                      </div>
                      <div class="text-[10px] text-slate-400 mt-0.5">${ord.urgencyTag}</div>
                    </td>

                    <!-- Material Status -->
                    <td class="py-3.5 px-3">
                      ${ord.materialsReady 
                        ? `<span class="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <i data-lucide="check" class="w-3.5 h-3.5"></i>
                            <span>100% In Stock</span>
                          </span>`
                        : `<span class="inline-flex items-center space-x-1 text-red-600 dark:text-red-400 font-bold animate-pulse">
                            <i data-lucide="alert-octagon" class="w-3.5 h-3.5"></i>
                            <span>Shortage Alert</span>
                          </span>`
                      }
                    </td>

                    <!-- Assigned Line -->
                    <td class="py-3.5 px-3">
                      <span class="font-mono-code text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                        ${ord.assignedMachine}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3.5 px-3 text-right">
                      <button onclick="App.showJobDetailModal('${ord.id}')" class="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">
                        Inspect BOM
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ================= TAB 4: MACHINE TELEMETRY & OEE (Q4) =================
  renderMachinesTab(container) {
    const machines = ManufacturingData.machines;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & IoT Architecture Explanation -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Answer to Question 4</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Real-Time Machine Availability & Capacity Telemetry</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Monitored via low-cost shop-floor Android tablets (operator touch terminals) and non-invasive clamp CT current sensors. Tracks OEE (Availability × Performance × Quality) in real time.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q4')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q4)</span>
            </button>
          </div>

          <!-- Machine Capacity vs Load Graph -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Shift Machine Load vs. Maximum Hours</span>
              <span class="text-xs text-emerald-600 font-semibold">Factory Average OEE: 84.2%</span>
            </div>
            <div class="h-64 w-full">
              <canvas id="machineCapacityChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Machine Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${machines.map(m => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 relative overflow-hidden">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-slate-900 dark:text-white text-base">${m.name}</span>
                  </div>
                  <div class="text-xs text-slate-400 font-mono-code">${m.id} · ${m.type}</div>
                </div>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${
                  m.status === 'Running' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 live-beacon pl-5' :
                  m.status === 'Maintenance' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }">${m.status}</span>
              </div>

              <!-- Live OEE Progress Bar -->
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-slate-500">Live OEE Score:</span>
                  <span class="font-extrabold text-blue-600 dark:text-blue-400">${m.oee}%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div class="h-full rounded-full ${m.oee >= 85 ? 'bg-emerald-500' : m.oee >= 75 ? 'bg-blue-500' : 'bg-amber-500'}" style="width: ${m.oee}%"></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Avail: ${m.availability}%</span>
                  <span>Perf: ${m.performance}%</span>
                  <span>Qual: ${m.quality}%</span>
                </div>
              </div>

              <!-- Sensor Telemetry Strip -->
              <div class="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-center text-xs border border-slate-100 dark:border-slate-700">
                <div>
                  <span class="text-[10px] text-slate-400 block">Temp</span>
                  <span class="font-bold font-mono-code ${m.tempC > 70 ? 'text-red-500 font-extrabold animate-pulse' : 'text-slate-700 dark:text-slate-300'}">${m.tempC}°C</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block">Vibration</span>
                  <span class="font-bold font-mono-code text-slate-700 dark:text-slate-300">${m.vibrationMmS} mm/s</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block">Power</span>
                  <span class="font-bold font-mono-code text-slate-700 dark:text-slate-300">${m.powerKw} kW</span>
                </div>
              </div>

              <!-- Active Operator & Current Job -->
              <div class="space-y-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Current Job:</span>
                  <span class="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">${m.currentOrder}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Operator:</span>
                  <span class="text-slate-600 dark:text-slate-300">${m.operator}</span>
                </div>
              </div>

              <!-- Quick action to toggle status -->
              <div class="pt-1">
                <button onclick="App.simulateMachineStatusToggle('${m.id}')" class="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold transition flex items-center justify-center space-x-1">
                  <i data-lucide="toggle-left" class="w-3.5 h-3.5"></i>
                  <span>Simulate Status Change</span>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    setTimeout(() => ChartsManager.initCapacityChart("machineCapacityChart"), 50);
  },

  simulateMachineStatusToggle(machineId) {
    const machine = ManufacturingData.machines.find(m => m.id === machineId);
    if (!machine) return;
    
    if (machine.status === "Running") {
      machine.status = "Idle";
    } else if (machine.status === "Idle") {
      machine.status = "Maintenance";
    } else {
      machine.status = "Running";
    }
    
    this.showToast(`Machine ${machine.name} status updated to: ${machine.status}`, "info");
    this.renderMachinesTab(document.getElementById("tabContentContainer"));
  },

  // ================= TAB 5: MATERIAL SHORTAGES & RADAR (Q5, Q6) =================
  renderInventoryTab(container) {
    const inventory = ManufacturingData.inventory;
    const criticalShortages = inventory.filter(i => i.available <= 0);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Answers to Questions 5 & 6</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Predictive Material Shortages & Multi-Channel Alert Dispatch</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                AI cross-references production schedules against live warehouse stock, daily burn rates, and vendor lead times to flag stockouts up to 7 days before physical starvation occurs.
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="App.openVivaModal('Q5')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
                <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                <span>Q5: Delay Predictions</span>
              </button>
              <button onclick="App.openVivaModal('Q6')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
                <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                <span>Q6: Notifications</span>
              </button>
            </div>
          </div>

          <!-- Predictive Burn Rate Trajectory Chart -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Forward 7-Day Material Burn-Rate & Depletion Curve</span>
              <span class="text-xs text-red-600 font-semibold">${criticalShortages.length} Imminent Stockouts Detected</span>
            </div>
            <div class="h-64 w-full">
              <canvas id="materialBurnChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Inventory Status Table -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Raw Material Warehouse Radar</h3>
            <button onclick="App.triggerAutoPurchaseOrder()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition">
              <i data-lucide="send" class="w-3.5 h-3.5"></i>
              <span>Auto-Draft Expedited POs</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                  <th class="py-3 px-3 font-semibold uppercase">Material Code</th>
                  <th class="py-3 px-3 font-semibold uppercase">Material Name & Category</th>
                  <th class="py-3 px-3 font-semibold uppercase">Physical Stock</th>
                  <th class="py-3 px-3 font-semibold uppercase">Scheduled Demand</th>
                  <th class="py-3 px-3 font-semibold uppercase">Net Available</th>
                  <th class="py-3 px-3 font-semibold uppercase">Depletion Time</th>
                  <th class="py-3 px-3 font-semibold uppercase">Supplier & Lead Time</th>
                  <th class="py-3 px-3 font-semibold uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                ${inventory.map(item => `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition ${item.available <= 0 ? 'bg-red-50/50 dark:bg-red-950/20' : ''}">
                    <td class="py-3 px-3 font-mono-code font-bold text-slate-900 dark:text-white">${item.id}</td>
                    <td class="py-3 px-3">
                      <div class="font-bold text-slate-900 dark:text-white">${item.name}</div>
                      <div class="text-slate-400">${item.category}</div>
                    </td>
                    <td class="py-3 px-3 font-bold">${item.currentStock} ${item.unit}</td>
                    <td class="py-3 px-3 text-slate-600 dark:text-slate-300">${item.allocated} ${item.unit}</td>
                    <td class="py-3 px-3">
                      <span class="font-extrabold ${item.available <= 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-emerald-600'}">
                        ${item.available} ${item.unit}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      ${item.stockoutInHours === 0 
                        ? `<span class="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold">Depleted Now</span>`
                        : item.stockoutInHours < 48
                        ? `<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-bold">In ${item.stockoutInHours} hrs</span>`
                        : `<span class="text-slate-500 font-medium">> ${Math.round(item.stockoutInHours / 24)} days</span>`
                      }
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-medium">${item.supplier}</div>
                      <div class="text-slate-400">${item.leadTimeDays} days lead time (Reliability: ${item.supplierReliability}%)</div>
                    </td>
                    <td class="py-3 px-3 text-right">
                      ${item.available <= 0 ? `
                        <button onclick="App.triggerExpeditedAlert('${item.id}')" class="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition">
                          Fast-Track PO
                        </button>
                      ` : `
                        <button class="px-2.5 py-1 text-slate-400 hover:text-slate-600 text-[11px]">
                          OK
                        </button>
                      `}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => ChartsManager.initMaterialBurnChart("materialBurnChart"), 50);
  },

  triggerAutoPurchaseOrder() {
    this.showToast("Generated 2 Expedited Purchase Orders: Sent via WhatsApp & Email to Salem Steel and Metals & Alloys India.", "success");
  },

  triggerExpeditedAlert(matId) {
    const item = ManufacturingData.inventory.find(i => i.id === matId);
    if (!item) return;
    this.showToast(`Expedited RFQ dispatched to 3 alternate vendors for ${item.name}. Expected turnaround: 24h.`, "success");
  },

  // ================= TAB 6: WHAT-IF DISRUPTION SIMULATOR (Q7) =================
  renderDisruptionsTab(container) {
    const scenarios = ManufacturingData.disruptionScenarios;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">Answer to Question 7</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Dynamic Rescheduling & "What-If" Disruption Sandbox</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                When unexpected breakdowns, supplier delays, or emergency rush orders occur, the AI rebalances jobs dynamically, avoiding late delivery penalties and costly downtime.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q7')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q7)</span>
            </button>
          </div>

          <!-- Sandbox Scenarios Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${scenarios.map(sc => `
              <div class="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50 hover:border-blue-500 transition space-y-3 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      sc.severity === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      sc.severity === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }">${sc.type}</span>
                    <span class="text-xs font-mono-code text-slate-400">${sc.id}</span>
                  </div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">${sc.title}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">${sc.description}</p>
                </div>

                <div class="pt-3 border-t border-slate-200/80 dark:border-slate-700">
                  <button 
                    onclick="App.runDisruptionSimulation('${sc.id}')"
                    class="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
                  >
                    <i data-lucide="play" class="w-3.5 h-3.5"></i>
                    <span>Simulate & Auto-Heal</span>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Simulation Results Container (Populated when user clicks simulate) -->
        <div id="simulationResultContainer" class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="text-center py-12 text-slate-400">
            <i data-lucide="sparkles" class="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600"></i>
            <h4 class="font-bold text-slate-600 dark:text-slate-300 text-sm">Select any Disruption Scenario above</h4>
            <p class="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Test how the AI dynamically handles thermal breakdown on Lathe #2, supply chain steel delays, or sudden emergency rush orders without human recalculation.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  runDisruptionSimulation(scenarioId) {
    const result = SchedulerEngine.simulateDisruption(scenarioId);
    if (!result) return;

    const container = document.getElementById("simulationResultContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-4 animate-fadeIn">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">AI Dynamic Rescheduling Output</h3>
          </div>
          <span class="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold">
            Resolved in ${result.autoHealedSchedule.metrics.rebalancingTimeSeconds}s
          </span>
        </div>

        <!-- Before & After Comparison Impact -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <span class="text-xs text-emerald-700 dark:text-emerald-300 font-semibold block">Production Hours Recovered:</span>
            <span class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">+${result.autoHealedSchedule.metrics.recoveredHours} hrs</span>
          </div>
          <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <span class="text-xs text-blue-700 dark:text-blue-300 font-semibold block">Avoided SLA Penalty Fees:</span>
            <span class="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${result.autoHealedSchedule.metrics.avoidedPenalties}</span>
          </div>
          <div class="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
            <span class="text-xs text-purple-700 dark:text-purple-300 font-semibold block">Manual Supervisor Re-planning Time:</span>
            <span class="text-2xl font-extrabold text-purple-600 dark:text-purple-400">0 minutes (100% automated)</span>
          </div>
        </div>

        <!-- Step-by-Step AI Resolution Actions -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Execution Plan Executed by AI Controller:</h4>
          <ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            ${result.scenario.aiResolutionPlan.map(step => `
              <li class="flex items-start space-x-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"></i>
                <span>${step}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    this.showToast(`Simulation Complete: Dynamic schedule auto-healed for ${result.scenario.title}!`, "success");
  },

  // ================= TAB 7: DATA REQUIREMENTS AUDIT (Q8) =================
  renderDataReadinessTab(container) {
    const pillars = ManufacturingData.dataRequirements;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">Answer to Question 8</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">What Data is Required to Make Accurate Production Plans?</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                To guarantee mathematical precision without "hallucinating" feasibility, the AI system relies on the 4 Core Data Pillars.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q8')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q8)</span>
            </button>
          </div>

          <!-- Overall Readiness Score Gauge -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-750 dark:to-indigo-950/40 border border-blue-200/60 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Factory Data Readiness Health</span>
              <div class="text-2xl font-extrabold text-slate-900 dark:text-white">86.2% Complete</div>
              <p class="text-xs text-slate-500 mt-1">High confidence for autonomous scheduling. (Pillars 1, 2, 3 fully verified).</p>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="App.downloadSampleCsv()" class="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                <span>Download Sample CSV Template</span>
              </button>
            </div>
          </div>
        </div>

        <!-- The 4 Pillars Accordion Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${pillars.map(p => `
            <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-base">${p.pillar}</h4>
                  <span class="text-xs text-slate-400">Primary Source: ${p.source}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${
                  p.readiness >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                }">${p.readiness}% Ready</span>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${p.description}</p>

              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Why Critical for AI:</span>
                <p class="text-slate-600 dark:text-slate-300 leading-snug">${p.whyImportant}</p>
              </div>

              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Required Schema Attributes:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${p.sampleFields.map(f => `
                    <span class="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      ${f}
                    </span>
                  `).join("")}
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Drag & Drop CSV / Excel Intake Simulator -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
          <i data-lucide="file-spreadsheet" class="w-10 h-10 text-blue-500 mx-auto"></i>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white text-sm">Simulate Small Business Excel / CSV Data Ingestion</h4>
            <p class="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Drag & drop your existing order schedule or warehouse sheet. The AI parser maps columns automatically without coding.
            </p>
          </div>
          <button onclick="App.simulateFileUpload()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">
            Test Upload Sample "Production_Orders.xlsx"
          </button>
        </div>
      </div>
    `;
  },

  downloadSampleCsv() {
    const csvContent = "data:text/csv;charset=utf-8,order_id,customer_name,sku_code,quantity,due_date,penalty_per_day,priority_tier,required_materials\nORD-9001,Bharat Heavy Electricals,SKU-TRN-101,150,2026-10-25,900,Tier 1 Strategic,MAT-STL-304:3.5kg\nORD-9002,L&T Valves,SKU-VLV-55,60,2026-10-22,450,Tier 2 High,MAT-BRZ-932:1.2kg";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "OptiManufact_Orders_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Downloaded sample CSV template!", "success");
  },

  simulateFileUpload() {
    this.showToast("Parsing 'Production_Orders.xlsx'... Auto-mapped 7 columns to BOM & Machine schema.", "info");
    setTimeout(() => {
      this.showToast("Successfully imported 14 new records into active scheduling engine!", "success");
    }, 600);
  },

  // ================= TAB 8: SME AFFORDABILITY & USABILITY (Q9) =================
  renderAffordabilityTab(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Answer to Question 9</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">How to Make the System Affordable & Easy to Use for SMEs?</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Small factories cannot afford \$100k SAP implementations or IT teams. Here is the 4-part architectural blueprint enabling immediate adoption.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q9')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q9)</span>
            </button>
          </div>

          <!-- The 4 Affordability Pillars -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                <i data-lucide="cloud" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Zero Server Hardware</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Runs completely in modern browsers. No expensive on-premise rack servers or specialized database licenses needed.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                <i data-lucide="tablet" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Budget Android Kiosk</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Machine operators log job starts and completions on $50 budget tablets or smartphones. No barcode guns or SCADA rewiring.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                <i data-lucide="file-spreadsheet" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Excel "Keep Your Workflow"</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Staff don't need retraining. They can continue updating their familiar Excel or Tally sheets; our agent synchronizes in the background.
              </p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                <i data-lucide="credit-card" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Micro-SaaS Pricing</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Priced at \$49-\$99/month per small factory, yielding immediate positive ROI within the very first month by preventing a single delayed order.
              </p>
            </div>
          </div>
        </div>

        <!-- 3-Step 15-Minute Onboarding Flow -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">15-Minute SME Fast-Track Setup Workflow</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <h5 class="font-bold text-sm text-slate-900 dark:text-white">Connect Tally or Drop Excel</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400">Sync customer orders and item master directly from existing bookkeeping.</p>
            </div>
            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <h5 class="font-bold text-sm text-slate-900 dark:text-white">Register Shop-Floor Machines</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400">List machine names, daily shift hours (8 or 16 hrs), and standard setup times.</p>
            </div>
            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              <h5 class="font-bold text-sm text-slate-900 dark:text-white">Click "Generate AI Schedule"</h5>
              <p class="text-xs text-slate-500 dark:text-slate-400">Get an optimized Gantt schedule immediately with real-time material validation.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ================= TAB 9: ERP & SOFTWARE INTEGRATION (Q10) =================
  renderIntegrationsTab(container) {
    const integrations = ManufacturingData.integrations;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Answer to Question 10</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Software Integration Hub: ERP, Accounting & Spreadsheets</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                OptiManufact AI operates as a non-invasive intelligent overlay on top of existing software like Tally, QuickBooks, Excel, and Zoho.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q10')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q10)</span>
            </button>
          </div>

          <!-- Connector Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${integrations.map(conn => `
              <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="font-bold text-base text-slate-900 dark:text-white">${conn.name}</h4>
                      <span class="text-xs text-slate-400">${conn.category}</span>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      conn.status === 'Connected' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }">${conn.status}</span>
                  </div>

                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-2">${conn.description}</p>

                  <div class="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 text-[11px] space-y-1">
                    <div class="flex justify-between">
                      <span class="text-slate-400">Protocol:</span>
                      <span class="font-mono-code font-bold text-slate-700 dark:text-slate-300">${conn.protocol}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">Last Synced:</span>
                      <span class="text-slate-600 dark:text-slate-300">${conn.lastSync}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">Payload:</span>
                      <span class="text-indigo-600 dark:text-indigo-400 font-semibold">${conn.recordsSynced}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-2">
                  <button onclick="App.triggerSyncConnector('${conn.name}')" class="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center justify-center space-x-1.5">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                    <span>Test Sync Connection</span>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Sample Integration Webhook / JSON Payload Inspector -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Live Inbound Webhook Payload (Tally XML -> JSON Pipeline)</h4>
            <span class="text-[10px] font-mono-code bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded">HTTP 200 OK</span>
          </div>
          <pre class="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono-code text-xs overflow-x-auto">
{
  "event": "sales_order_created",
  "source": "TallyPrime_Gateway_v3",
  "timestamp": "2026-10-17T09:42:15Z",
  "order": {
    "order_id": "ORD-8948",
    "customer": "Crompton Greaves Consumer",
    "sku": "SKU-MTR-350",
    "quantity": 180,
    "promised_delivery_date": "2026-10-26",
    "penalty_clause_daily": 500,
    "bom_linked": true
  }
}</pre>
        </div>
      </div>
    `;
  },

  triggerSyncConnector(name) {
    this.showToast(`Pinged ${name}: Connection healthy. Received 0 schema errors.`, "success");
  },

  // ================= TAB 10: KPI IMPACT & ROI CALCULATOR (Q11) =================
  renderAnalyticsTab(container) {
    const kpi = ManufacturingData.kpiMetrics;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header & Methodology Banner -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Answer to Question 11</span>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Measuring System Impact on Delays, Costs & Material Wastage</h2>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Continuous measurement of On-Time Delivery (OTIF), Scrap Reduction, Machine OEE, and financial savings.
              </p>
            </div>
            <button onclick="App.openVivaModal('Q11')" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
              <span>Viva Explanation (Q11)</span>
            </button>
          </div>

          <!-- KPI Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${Object.values(kpi).map(metric => `
              <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">${metric.label}</span>
                <div class="flex items-baseline space-x-2">
                  <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${metric.after} ${metric.unit}</span>
                  <span class="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">${metric.improvement}</span>
                </div>
                <div class="text-xs text-slate-400 pt-1">
                  Baseline before AI: <span class="font-bold text-slate-600 dark:text-slate-300">${metric.before} ${metric.unit}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Interactive ROI Calculator for Small Businesses -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Interactive SME Financial Savings Calculator</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Adjust parameters for your manufacturing plant to simulate projected monthly cost recovery.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <!-- Slider 1 -->
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Monthly Revenue:</span>
                <span id="calcRevDisplay" class="font-bold font-mono-code text-blue-600">$100,000</span>
              </div>
              <input id="calcRevSlider" type="range" min="20000" max="500000" step="10000" value="100000" class="w-full accent-blue-600 cursor-pointer" oninput="App.recalculateRoi()" />
            </div>

            <!-- Slider 2 -->
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Current Scrap / Wastage %:</span>
                <span id="calcScrapDisplay" class="font-bold font-mono-code text-blue-600">7.5%</span>
              </div>
              <input id="calcScrapSlider" type="range" min="2" max="15" step="0.5" value="7.5" class="w-full accent-blue-600 cursor-pointer" oninput="App.recalculateRoi()" />
            </div>

            <!-- Slider 3 -->
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="font-semibold text-slate-700 dark:text-slate-300">Late Penalty Incidents / Month:</span>
                <span id="calcPenaltiesDisplay" class="font-bold font-mono-code text-blue-600">6 Orders</span>
              </div>
              <input id="calcPenaltiesSlider" type="range" min="1" max="25" step="1" value="6" class="w-full accent-blue-600 cursor-pointer" oninput="App.recalculateRoi()" />
            </div>
          </div>

          <!-- Dynamic Output Card -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-750 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Projected Annual Factory Savings</span>
              <div id="calcAnnualSavings" class="text-3xl font-black text-slate-900 dark:text-white">$74,400 / year</div>
              <p class="text-xs text-slate-500 mt-0.5">Payback period on system subscription: <span class="font-bold text-emerald-600">Less than 5 days</span></p>
            </div>
            <button onclick="App.showToast('Generated executive PDF summary for your plant manager!', 'success')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition">
              Export Audit Report
            </button>
          </div>
        </div>
      </div>
    `;
  },

  recalculateRoi() {
    const rev = Number(document.getElementById("calcRevSlider").value);
    const scrap = Number(document.getElementById("calcScrapSlider").value);
    const penalties = Number(document.getElementById("calcPenaltiesSlider").value);

    document.getElementById("calcRevDisplay").innerText = "$" + rev.toLocaleString();
    document.getElementById("calcScrapDisplay").innerText = scrap + "%";
    document.getElementById("calcPenaltiesDisplay").innerText = penalties + " Orders";

    // Savings formula: 60% scrap reduction on material share (approx 40% of revenue) + 85% avoided penalties ($800 per incident)
    const materialCost = rev * 0.40;
    const monthlyScrapSavings = materialCost * (scrap / 100) * 0.65;
    const monthlyPenaltySavings = penalties * 850 * 0.85;
    const annualTotal = Math.round((monthlyScrapSavings + monthlyPenaltySavings) * 12);

    document.getElementById("calcAnnualSavings").innerText = "$" + annualTotal.toLocaleString() + " / year";
  },

  // ================= MODALS & DRAWERS =================
  openVivaModal(filterKey = "ALL") {
    const modalEl = document.getElementById("vivaModal");
    if (!modalEl) return;
    
    let items = ManufacturingData.vivaGuide;
    if (filterKey !== "ALL") {
      items = items.filter(i => i.qNum === filterKey);
    }

    const contentEl = document.getElementById("vivaModalContent");
    contentEl.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            <div class="flex items-center space-x-2">
              <i data-lucide="graduation-cap" class="w-5 h-5 text-amber-500"></i>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">College Project Evaluation Guide</h3>
            </div>
            <p class="text-xs text-slate-500">Comprehensive answers mapped to the 11 evaluation questions from the problem statement.</p>
          </div>
          <button onclick="App.closeVivaModal()" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          ${items.map(item => `
            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50 space-y-2">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">${item.qNum}</span>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">${item.question}</h4>
              </div>
              <div class="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs font-semibold">
                Summary: ${item.shortAnswer}
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ${item.detailedAnswer}
              </p>
              <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span class="text-slate-400">Demonstrated in: <span class="font-semibold text-slate-700 dark:text-slate-300">${item.appFeature}</span></span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    modalEl.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  },

  closeVivaModal() {
    const modalEl = document.getElementById("vivaModal");
    if (modalEl) modalEl.classList.add("hidden");
  },

  showJobDetailModal(orderId) {
    const order = ManufacturingData.orders.find(o => o.id === orderId);
    if (!order) return;

    const modalEl = document.getElementById("genericModal");
    if (!modalEl) return;

    const contentEl = document.getElementById("genericModalContent");
    contentEl.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">${order.id}</span>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">${order.productName}</h3>
            </div>
            <span class="text-xs text-slate-400">${order.customer} · ${order.tier}</span>
          </div>
          <button onclick="App.closeGenericModal()" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750">
            <span class="text-slate-400 block">Delivery Deadline:</span>
            <span class="font-bold text-slate-900 dark:text-white">${order.dueDate} (${order.remainingDays} days left)</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750">
            <span class="text-slate-400 block">Delay Penalty Clause:</span>
            <span class="font-bold text-red-600">$${order.penaltyPerDay} / day</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750">
            <span class="text-slate-400 block">Assigned Machine:</span>
            <span class="font-mono-code font-bold text-blue-600">${order.assignedMachine}</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-750">
            <span class="text-slate-400 block">Critical Bottleneck:</span>
            <span class="font-bold text-amber-600">${order.bottleneckStage}</span>
          </div>
        </div>

        <!-- BOM Checklist -->
        <div>
          <h5 class="text-xs font-bold text-slate-900 dark:text-white mb-2">Bill of Materials (BOM) Requirements:</h5>
          <div class="space-y-1.5">
            ${order.requiredMaterials.map(mat => `
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span class="font-semibold text-slate-800 dark:text-slate-200">${mat.name}</span>
                  <div class="text-[10px] text-slate-400 font-mono-code">${mat.id}</div>
                </div>
                <span class="font-bold text-slate-700 dark:text-slate-300">${mat.qtyPerUnit * order.quantity} ${mat.unit} required</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    modalEl.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  },

  closeGenericModal() {
    const modalEl = document.getElementById("genericModal");
    if (modalEl) modalEl.classList.add("hidden");
  },

  showNewOrderModal() {
    const modalEl = document.getElementById("genericModal");
    if (!modalEl) return;

    const contentEl = document.getElementById("genericModalContent");
    contentEl.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Simulate Customer Order Ingestion</h3>
          <button onclick="App.closeGenericModal()" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Name:</label>
            <input type="text" value="Alstom Transport India" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Product SKU:</label>
              <input type="text" value="SKU-TRN-700" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity:</label>
              <input type="number" value="250" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Promised Due Date:</label>
              <input type="date" value="2026-10-23" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Delay Penalty ($/Day):</label>
              <input type="number" value="750" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end space-x-2">
          <button onclick="App.closeGenericModal()" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold">Cancel</button>
          <button onclick="App.insertMockOrder()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">Inject into AI Queue</button>
        </div>
      </div>
    `;

    modalEl.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  },

  insertMockOrder() {
    this.closeGenericModal();
    this.showToast("Injected Order ORD-8949 (Alstom Transport). Recalculating shop-floor priority rankings...", "success");
    setTimeout(() => {
      this.switchTab("orders");
    }, 400);
  },

  initNotifications() {
    const drawerEl = document.getElementById("notificationDrawer");
    if (!drawerEl) return;
    this.renderNotificationDrawer();
  },

  renderNotificationDrawer() {
    const contentEl = document.getElementById("notificationList");
    if (!contentEl) return;

    contentEl.innerHTML = `
      <div class="space-y-3 p-4">
        ${this.notifications.map(a => `
          <div class="p-3.5 rounded-2xl border ${
            a.severity === 'danger' ? 'bg-red-50/70 border-red-200 dark:bg-red-950/30 dark:border-red-900' :
            a.severity === 'warning' ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900' :
            'bg-slate-50 border-slate-200 dark:bg-slate-750 dark:border-slate-700'
          } space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold ${
                a.severity === 'danger' ? 'text-red-700 dark:text-red-300' :
                a.severity === 'warning' ? 'text-amber-700 dark:text-amber-300' :
                'text-slate-800 dark:text-slate-200'
              }">${a.title}</span>
              <span class="text-[10px] text-slate-400">${a.timestamp}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-snug">${a.message}</p>
            <div class="pt-1 flex items-center justify-between">
              <span class="text-[10px] text-slate-400">Src: ${a.source}</span>
              <button onclick="App.resolveAlert('${a.id}')" class="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                ${a.actionLabel}
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  resolveAlert(alertId) {
    const alert = this.notifications.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.showToast(`Action taken for: ${alert.title}`, "success");
      this.renderHeader();
      this.renderNotificationDrawer();
    }
  },

  toggleNotificationDrawer() {
    const drawer = document.getElementById("notificationDrawer");
    if (!drawer) return;
    drawer.classList.toggle("translate-x-full");
  },

  toggleKioskMode() {
    this.isKioskMode = !this.isKioskMode;
    document.body.classList.toggle("kiosk-mode", this.isKioskMode);
    this.showToast(this.isKioskMode ? "Operator Touch Screen Kiosk Mode Enabled" : "Exited Kiosk Mode", "info");
  },

  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `p-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center space-x-2 toast-slide-in pointer-events-auto ${
      type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
      type === 'danger' ? 'bg-red-600 text-white border-red-500' :
      'bg-slate-900 text-white border-slate-700'
    }`;
    
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'danger' ? 'alert-triangle' : 'info'}" class="w-4 h-4 flex-shrink-0"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-300");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  showShareModal() {
    const modalEl = document.getElementById("genericModal");
    if (!modalEl) return;

    const lanUrl = "http://192.168.160.107:8080";

    const contentEl = document.getElementById("genericModalContent");
    contentEl.innerHTML = `
      <div class="space-y-5">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
              <i data-lucide="share-2" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Share Website with Friends</h3>
              <p class="text-xs text-slate-500">Multiple instant ways to share this project</p>
            </div>
          </div>
          <button onclick="App.closeGenericModal()" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Option 1: Same Wi-Fi / Hotspot -->
        <div class="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center space-x-1.5">
              <i data-lucide="wifi" class="w-4 h-4"></i>
              <span>Option 1: Same Wi-Fi / Hotspot (Instant)</span>
            </span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">No Internet Required</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            Any friend or phone connected to the same Wi-Fi or mobile hotspot can open this link right now:
          </p>
          <div class="flex items-center space-x-2 pt-1">
            <input type="text" readonly value="${lanUrl}" id="shareLanInput" class="flex-1 font-mono-code text-xs px-3 py-2 rounded-xl border border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 font-bold" />
            <button onclick="navigator.clipboard.writeText('${lanUrl}'); App.showToast('Link copied to clipboard!', 'success');" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-sm">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>Copy</span>
            </button>
          </div>
        </div>

        <!-- Option 2: Free 24/7 Public Link via Netlify Drop -->
        <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
              <i data-lucide="globe" class="w-4 h-4"></i>
              <span>Option 2: Permanent Public Link (Worldwide 24/7)</span>
            </span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Recommended</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            Get a permanent link like <code class="font-mono-code text-emerald-700 dark:text-emerald-300">https://your-project.netlify.app</code> in 30 seconds for free:
          </p>
          <ol class="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside">
            <li>Open <a href="https://app.netlify.com/drop" target="_blank" class="font-bold text-blue-600 underline">app.netlify.com/drop</a> in your browser.</li>
            <li>Drag & drop the <code class="font-mono-code font-bold">frontend</code> folder into the drop zone.</li>
            <li>Copy your permanent live website link and share with your friend!</li>
          </ol>
        </div>

        <!-- Option 3: Double-click share_publicly.bat -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-2">
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
            <i data-lucide="terminal" class="w-4 h-4"></i>
            <span>Option 3: Instant Live Tunnel (from your PC)</span>
          </span>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            In your project folder, double-click <strong class="text-blue-600">share_publicly.bat</strong>. It creates a temporary public HTTPS link directly from your computer without any signup.
          </p>
        </div>
      </div>
    `;

    modalEl.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  },

  setupEventListeners() {
    document.getElementById("themeToggleBtn")?.addEventListener("click", () => this.toggleTheme());
    document.getElementById("openShareBtn")?.addEventListener("click", () => this.showShareModal());
    document.getElementById("notificationToggleBtn")?.addEventListener("click", () => this.toggleNotificationDrawer());
    document.getElementById("closeNotificationBtn")?.addEventListener("click", () => this.toggleNotificationDrawer());
    document.getElementById("openVivaBtn")?.addEventListener("click", () => this.openVivaModal("ALL"));
    document.getElementById("kioskToggleBtn")?.addEventListener("click", () => this.toggleKioskMode());
    
    // Mobile menu toggle
    document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
      const sidebar = document.getElementById("mainSidebar");
      sidebar.classList.toggle("hidden");
    });

    // Close user profile menu on click outside
    document.addEventListener("click", (e) => {
      const menu = document.getElementById("userProfileMenu");
      const btn = document.getElementById("userProfileBtn");
      if (menu && !menu.classList.contains("hidden") && !menu.contains(e.target) && !btn?.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });
  },

  setupAuthUI() {
    const tabLogin = document.getElementById("authTabLogin");
    const tabRegister = document.getElementById("authTabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    tabLogin?.addEventListener("click", () => this.switchAuthTab("login"));
    tabRegister?.addEventListener("click", () => this.switchAuthTab("register"));

    loginForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;
      const res = AuthManager.login(email, pass);
      if (res.success) {
        this.currentUser = res.user;
        this.enterDashboard();
        this.showToast(`Welcome back, ${res.user.name}! Connected to ${res.user.factoryName}`, "success");
      } else {
        this.showToast(res.message, "danger");
      }
    });

    registerForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const factoryName = document.getElementById("regFactory").value;
      const role = document.getElementById("regRole").value;

      const res = AuthManager.register({ name, email, password, factoryName, role });
      if (res.success) {
        this.currentUser = res.user;
        this.enterDashboard();
        this.showToast(`Account registered! Welcome to OptiManufact, ${res.user.name}!`, "success");
      } else {
        this.showToast(res.message, "danger");
      }
    });
  },

  switchAuthTab(tab) {
    const tabLogin = document.getElementById("authTabLogin");
    const tabRegister = document.getElementById("authTabRegister");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (tab === "login") {
      tabLogin?.classList.add("bg-blue-600", "text-white", "shadow-md");
      tabLogin?.classList.remove("text-slate-400");
      tabRegister?.classList.remove("bg-blue-600", "text-white", "shadow-md");
      tabRegister?.classList.add("text-slate-400");
      loginForm?.classList.remove("hidden");
      registerForm?.classList.add("hidden");
    } else {
      tabRegister?.classList.add("bg-blue-600", "text-white", "shadow-md");
      tabRegister?.classList.remove("text-slate-400");
      tabLogin?.classList.remove("bg-blue-600", "text-white", "shadow-md");
      tabLogin?.classList.add("text-slate-400");
      registerForm?.classList.remove("hidden");
      loginForm?.classList.add("hidden");
    }
    if (window.lucide) lucide.createIcons();
  },

  handleQuickDemo(roleCode) {
    const user = AuthManager.quickDemoLogin(roleCode);
    this.currentUser = user;
    document.getElementById("userProfileMenu")?.classList.add("hidden");
    this.enterDashboard();
    this.showToast(`Signed in as Demo Profile: ${user.name} (${user.role})`, "success");
  },

  handleLogout() {
    AuthManager.logout();
    this.currentUser = null;
    document.getElementById("userProfileMenu")?.classList.add("hidden");
    this.showAuthScreen();
    this.showToast("Signed out successfully. Session locked.", "info");
  },

  toggleProfileMenu() {
    const menuEl = document.getElementById("userProfileMenu");
    if (!menuEl) return;
    
    if (menuEl.classList.contains("hidden")) {
      this.renderUserProfileMenu();
      menuEl.classList.remove("hidden");
    } else {
      menuEl.classList.add("hidden");
    }
  },

  renderUserProfileMenu() {
    const menuEl = document.getElementById("userProfileMenu");
    if (!menuEl || !this.currentUser) return;

    menuEl.innerHTML = `
      <div class="p-4 border-b border-slate-100 dark:border-slate-700 space-y-2">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl ${this.currentUser.avatarBg || 'bg-blue-600'} text-white font-extrabold text-sm flex items-center justify-center shadow-md">
            ${this.getUserInitials(this.currentUser.name)}
          </div>
          <div class="truncate">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">${this.currentUser.name}</h4>
            <span class="text-xs text-slate-400 truncate block">${this.currentUser.email}</span>
          </div>
        </div>
        <div class="pt-2 flex items-center justify-between text-[11px]">
          <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold">${this.currentUser.role}</span>
          <span class="font-mono-code text-slate-400 font-bold">${this.currentUser.plantCode}</span>
        </div>
      </div>

      <div class="p-3 border-b border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Factory Plant:</span>
          <span class="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">${this.currentUser.factoryName}</span>
        </div>
        <div class="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Access Level:</span>
          <span class="text-emerald-600 dark:text-emerald-400 font-bold">Full Operations Suite</span>
        </div>
      </div>

      <!-- Quick Switch Role / Demo Profile -->
      <div class="p-3 border-b border-slate-100 dark:border-slate-700 space-y-1.5">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Switch Demo Profile:</span>
        <div class="grid grid-cols-3 gap-1.5 text-[11px]">
          <button onclick="App.handleQuickDemo('manager')" class="py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-center font-medium ${this.currentUser.roleCode === 'manager' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 border-blue-500' : 'text-slate-600 dark:text-slate-300'}">Manager</button>
          <button onclick="App.handleQuickDemo('planner')" class="py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-center font-medium ${this.currentUser.roleCode === 'planner' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 border-purple-500' : 'text-slate-600 dark:text-slate-300'}">Planner</button>
          <button onclick="App.handleQuickDemo('operator')" class="py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-center font-medium ${this.currentUser.roleCode === 'operator' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 border-emerald-500' : 'text-slate-600 dark:text-slate-300'}">Operator</button>
        </div>
      </div>

      <div class="p-2">
        <button onclick="App.handleLogout()" class="w-full py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition flex items-center justify-center space-x-2">
          <i data-lucide="log-out" class="w-4 h-4"></i>
          <span>Sign Out / Lock Session</span>
        </button>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  getUserInitials(name) {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    btn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    if (window.lucide) lucide.createIcons();
  }
};

// Initialize when DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

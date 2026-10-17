/**
 * OptiManufact AI - Authentication & User Management Engine
 * Handles user registration, login, role-based profiles, session persistence, and demo profiles.
 */

const AuthManager = {
  // Pre-seeded verified accounts for testing and demonstration
  defaultUsers: [
    {
      id: "USR-001",
      name: "Rajesh Kumar",
      email: "manager@apexengineering.com",
      password: "password123",
      role: "Plant Operations Manager",
      roleCode: "manager",
      factoryName: "Apex Precision Engineering Ltd.",
      plantCode: "APX-PLANT-01",
      avatarBg: "bg-blue-600",
      permissions: ["schedule_write", "disrupt_simulate", "orders_manage", "integrations_manage", "roi_view"]
    },
    {
      id: "USR-002",
      name: "Kavita Rao",
      email: "planner@apexengineering.com",
      password: "password123",
      role: "Lead Production Planner",
      roleCode: "planner",
      factoryName: "Apex Precision Engineering Ltd.",
      plantCode: "APX-PLANT-01",
      avatarBg: "bg-purple-600",
      permissions: ["schedule_write", "orders_manage", "inventory_view"]
    },
    {
      id: "USR-003",
      name: "Arun Patel",
      email: "operator@apexengineering.com",
      password: "password123",
      role: "Shop-Floor CNC Specialist",
      roleCode: "operator",
      factoryName: "Apex Precision Engineering Ltd.",
      plantCode: "APX-PLANT-01",
      avatarBg: "bg-emerald-600",
      permissions: ["kiosk_mode", "telemetry_view", "job_status_update"]
    }
  ],

  init() {
    this.ensureSeedUsers();
  },

  ensureSeedUsers() {
    const existing = localStorage.getItem("optimanufact_users_db");
    if (!existing) {
      localStorage.setItem("optimanufact_users_db", JSON.stringify(this.defaultUsers));
    }
  },

  getUsersDb() {
    this.ensureSeedUsers();
    try {
      return JSON.parse(localStorage.getItem("optimanufact_users_db")) || this.defaultUsers;
    } catch (e) {
      return this.defaultUsers;
    }
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem("optimanufact_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem("optimanufact_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("optimanufact_current_user");
    }
  },

  login(email, password) {
    const users = this.getUsersDb();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (!user) {
      return { success: false, message: "No account found with this email address." };
    }
    
    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  register(userData) {
    const users = this.getUsersDb();
    const emailExists = users.some(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    
    if (emailExists) {
      return { success: false, message: "An account with this email already exists. Please Sign In." };
    }

    const newUser = {
      id: "USR-" + (users.length + 1).toString().padStart(3, "0"),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role || "Plant Operations Manager",
      roleCode: (userData.role || "").toLowerCase().includes("operator") ? "operator" : 
                (userData.role || "").toLowerCase().includes("planner") ? "planner" : "manager",
      factoryName: userData.factoryName.trim() || "Apex Precision Engineering Ltd.",
      plantCode: "PLANT-" + Math.floor(100 + Math.random() * 900),
      avatarBg: "bg-indigo-600",
      permissions: ["schedule_write", "disrupt_simulate", "orders_manage", "integrations_manage", "roi_view"]
    };

    users.push(newUser);
    localStorage.setItem("optimanufact_users_db", JSON.stringify(users));
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  logout() {
    this.setCurrentUser(null);
  },

  quickDemoLogin(roleCode) {
    const users = this.getUsersDb();
    const target = users.find(u => u.roleCode === roleCode) || users[0];
    this.setCurrentUser(target);
    return target;
  }
};

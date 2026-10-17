/**
 * OptiManufact AI - Manufacturing Data Store
 * Grounded data models answering small manufacturing operational challenges
 */

const ManufacturingData = {
  // System metadata
  meta: {
    systemName: "OptiManufact AI",
    version: "2.4.0-Enterprise",
    factoryName: "Apex Precision Engineering & Fabrication Ltd.",
    currentShift: "Morning Shift (06:00 - 14:00)",
    activeOperators: 24,
    lastAiSync: "Just now",
  },

  // 1. Current vs AI Comparison (Answers Q1)
  currentVsFuture: [
    {
      dimension: "Order Management",
      traditional: "Siloed Excel spreadsheets, WhatsApp messages, paper job slips lost on shop floor.",
      aiPowered: "Unified Central Intake with automated BOM parsing, SLA tracking, and dynamic priority queues.",
      benefit: "Zero lost orders, 100% order traceability"
    },
    {
      dimension: "Production Scheduling",
      traditional: "Manual weekly whiteboard planning, subjective gut-feeling guesswork by shop supervisors.",
      aiPowered: "Multi-constraint heuristic & genetic algorithms considering machine speed, tooling, & worker skills.",
      benefit: "Schedules generated in seconds instead of 6+ hours"
    },
    {
      dimension: "Material Tracking",
      traditional: "Physical stock counting done only after production halts due to missing parts.",
      aiPowered: "Real-time stock reservation linked directly to BOM with automated 48-hour stockout alerts.",
      benefit: "82% reduction in material-induced work stoppages"
    },
    {
      dimension: "Machine Capacity",
      traditional: "Machines run blind; bottlenecks discovered only at the end of the shift.",
      aiPowered: "Live IoT / tablet telemetry tracking OEE, cycle times, temperature, and queue buildup.",
      benefit: "Machine utilization up from 58% to 88%"
    },
    {
      dimension: "Handling Disruptions",
      traditional: "Machine breaks down -> total chaos, phone calls, missed delivery deadlines.",
      aiPowered: "1-Click AI Auto-Rebalance re-routes jobs to alternate capable machines in real time.",
      benefit: "Recovers 85% of lost production time"
    },
    {
      dimension: "Cost & Wastage",
      traditional: "High scrap due to random batch sequencing and frequent setup changeovers.",
      aiPowered: "Sequence-dependent setup optimization grouping similar materials and tooling.",
      benefit: "Scrap reduced by 28%, setup times cut by 45%"
    }
  ],

  // 2. Customer Orders Master (Answers Q2, Q3)
  orders: [
    {
      id: "ORD-8941",
      customer: "Siemens Mobility",
      tier: "Tier 1 Strategic",
      tierWeight: 1.5,
      sku: "SKU-GBX-402",
      productName: "Heavy Duty Planetary Gearbox",
      quantity: 120,
      orderDate: "2026-10-10",
      dueDate: "2026-10-19", // Very tight!
      remainingDays: 2,
      penaltyPerDay: 850,
      status: "In-Progress",
      assignedMachine: "MCH-CNC-01",
      estHours: 28,
      progress: 68,
      materialsReady: true,
      riskLevel: "High",
      bottleneckStage: "Heat Treatment",
      requiredMaterials: [
        { id: "MAT-STL-304", name: "Grade 304 Stainless Steel Bar", qtyPerUnit: 2.5, unit: "kg" },
        { id: "MAT-BRG-6205", name: "High-Load Ball Bearings 6205", qtyPerUnit: 4, unit: "pcs" }
      ]
    },
    {
      id: "ORD-8942",
      customer: "Tata Motors Commercial",
      tier: "Tier 1 Strategic",
      tierWeight: 1.5,
      sku: "SKU-BRK-109",
      productName: "Air Brake Caliper Assembly",
      quantity: 450,
      orderDate: "2026-10-12",
      dueDate: "2026-10-21",
      remainingDays: 4,
      penaltyPerDay: 1200,
      status: "Scheduled",
      assignedMachine: "MCH-MIL-02",
      estHours: 36,
      progress: 15,
      materialsReady: true,
      riskLevel: "Medium",
      bottleneckStage: "CNC Milling",
      requiredMaterials: [
        { id: "MAT-ALU-6061", name: "Aluminum Ingot 6061-T6", qtyPerUnit: 3.2, unit: "kg" },
        { id: "MAT-FST-M8", name: "Grade 8.8 M8 Flange Bolts", qtyPerUnit: 8, unit: "pcs" }
      ]
    },
    {
      id: "ORD-8943",
      customer: "Kirloskar Pumps",
      tier: "Tier 2 High",
      tierWeight: 1.2,
      sku: "SKU-IMP-771",
      productName: "Bronze Fluid Impeller 180mm",
      quantity: 80,
      orderDate: "2026-10-14",
      dueDate: "2026-10-20",
      remainingDays: 3,
      penaltyPerDay: 400,
      status: "In-Progress",
      assignedMachine: "MCH-CNC-02",
      estHours: 18,
      progress: 45,
      materialsReady: false, // Material shortage!
      riskLevel: "Critical",
      bottleneckStage: "Raw Material Inbound",
      requiredMaterials: [
        { id: "MAT-BRZ-932", name: "SAE 660 Bronze Bushing Stock", qtyPerUnit: 1.8, unit: "kg" }
      ]
    },
    {
      id: "ORD-8944",
      customer: "Schneider Electric",
      tier: "Tier 1 Strategic",
      tierWeight: 1.5,
      sku: "SKU-ENC-501",
      productName: "IP66 Modular Electrical Enclosure",
      quantity: 300,
      orderDate: "2026-10-15",
      dueDate: "2026-10-25",
      remainingDays: 8,
      penaltyPerDay: 600,
      status: "Scheduled",
      assignedMachine: "MCH-LSR-01",
      estHours: 22,
      progress: 0,
      materialsReady: true,
      riskLevel: "Low",
      bottleneckStage: "Powder Coating",
      requiredMaterials: [
        { id: "MAT-SHT-CRCA", name: "1.6mm CRCA Sheet Metal", qtyPerUnit: 1.2, unit: "sheets" },
        { id: "MAT-PDR-RAL", name: "RAL 7035 Powder Coating", qtyPerUnit: 0.15, unit: "kg" }
      ]
    },
    {
      id: "ORD-8945",
      customer: "AgroTech Harvesters",
      tier: "Tier 3 Standard",
      tierWeight: 1.0,
      sku: "SKU-ROT-088",
      productName: "Hardened Tillage Rotor Flange",
      quantity: 200,
      orderDate: "2026-10-16",
      dueDate: "2026-10-28",
      remainingDays: 11,
      penaltyPerDay: 150,
      status: "Pending",
      assignedMachine: "MCH-CNC-01",
      estHours: 24,
      progress: 0,
      materialsReady: true,
      riskLevel: "Low",
      bottleneckStage: "None",
      requiredMaterials: [
        { id: "MAT-STL-304", name: "Grade 304 Stainless Steel Bar", qtyPerUnit: 4.0, unit: "kg" }
      ]
    },
    {
      id: "ORD-8946",
      customer: "Godrej Aerospace Subcontract",
      tier: "Tier 1 Strategic",
      tierWeight: 1.5,
      sku: "SKU-AER-904",
      productName: "Titanium Bracket Strut",
      quantity: 40,
      orderDate: "2026-10-15",
      dueDate: "2026-10-22",
      remainingDays: 5,
      penaltyPerDay: 2500,
      status: "In-Progress",
      assignedMachine: "MCH-MIL-01",
      estHours: 32,
      progress: 30,
      materialsReady: true,
      riskLevel: "Medium",
      bottleneckStage: "CMM Metrology Inspection",
      requiredMaterials: [
        { id: "MAT-TIT-TI6", name: "Ti-6Al-4V Aerospace Grade Rod", qtyPerUnit: 1.1, unit: "kg" }
      ]
    },
    {
      id: "ORD-8947",
      customer: "Local Hydraulic Services",
      tier: "Tier 3 Standard",
      tierWeight: 1.0,
      sku: "SKU-HYD-012",
      productName: "Custom Piston Rod 45mm x 600mm",
      quantity: 35,
      orderDate: "2026-10-16",
      dueDate: "2026-10-24",
      remainingDays: 7,
      penaltyPerDay: 200,
      status: "Pending",
      assignedMachine: "MCH-CNC-02",
      estHours: 14,
      progress: 0,
      materialsReady: true,
      riskLevel: "Low",
      bottleneckStage: "Hard Chrome Plating",
      requiredMaterials: [
        { id: "MAT-STL-304", name: "Grade 304 Stainless Steel Bar", qtyPerUnit: 6.2, unit: "kg" }
      ]
    }
  ],

  // 3. Machines & Real-Time Telemetry (Answers Q4)
  machines: [
    {
      id: "MCH-CNC-01",
      name: "Haas VF-4 CNC Center",
      type: "4-Axis CNC Machining",
      status: "Running", // Running, Idle, Maintenance, Fault
      oee: 89.4,
      availability: 94.2,
      performance: 96.0,
      quality: 98.8,
      currentOrder: "ORD-8941",
      currentSku: "SKU-GBX-402",
      operator: "Ramesh Sharma (L3 Cert)",
      tempC: 62.4,
      vibrationMmS: 1.4,
      powerKw: 14.8,
      shiftCapHours: 8,
      scheduledHours: 7.2,
      utilization: 90,
      maintenanceDueInDays: 14
    },
    {
      id: "MCH-CNC-02",
      name: "Mazak Quick Turn 250",
      type: "CNC Turning Lathe",
      status: "Running",
      oee: 84.1,
      availability: 88.0,
      performance: 97.2,
      quality: 98.2,
      currentOrder: "ORD-8943",
      currentSku: "SKU-IMP-771",
      operator: "Arun Patel (L2 Cert)",
      tempC: 71.8, // Slightly hot!
      vibrationMmS: 2.1,
      powerKw: 11.2,
      shiftCapHours: 8,
      scheduledHours: 7.8,
      utilization: 97,
      maintenanceDueInDays: 3 // Needs attention
    },
    {
      id: "MCH-MIL-01",
      name: "DMG Mori 5-Axis Mill",
      type: "Precision 5-Axis Milling",
      status: "Running",
      oee: 92.6,
      availability: 96.0,
      performance: 97.5,
      quality: 99.0,
      currentOrder: "ORD-8946",
      currentSku: "SKU-AER-904",
      operator: "Kavita Rao (Senior Specialist)",
      tempC: 54.0,
      vibrationMmS: 0.8,
      powerKw: 18.5,
      shiftCapHours: 8,
      scheduledHours: 6.8,
      utilization: 85,
      maintenanceDueInDays: 28
    },
    {
      id: "MCH-MIL-02",
      name: "BFW Agni Precision VMC",
      type: "Vertical Milling Center",
      status: "Idle",
      oee: 76.2,
      availability: 81.0,
      performance: 95.0,
      quality: 99.1,
      currentOrder: "ORD-8942 (Setup in progress)",
      currentSku: "SKU-BRK-109",
      operator: "Sanjay Verma (L2)",
      tempC: 41.2,
      vibrationMmS: 0.3,
      powerKw: 3.2,
      shiftCapHours: 8,
      scheduledHours: 5.5,
      utilization: 68,
      maintenanceDueInDays: 21
    },
    {
      id: "MCH-LSR-01",
      name: "Trumpf TruLaser 3030",
      type: "Fiber Laser Cutting (4kW)",
      status: "Running",
      oee: 91.0,
      availability: 93.5,
      performance: 98.0,
      quality: 99.4,
      currentOrder: "ORD-8944",
      currentSku: "SKU-ENC-501",
      operator: "Manoj Kumar",
      tempC: 48.5,
      vibrationMmS: 0.5,
      powerKw: 22.0,
      shiftCapHours: 8,
      scheduledHours: 7.0,
      utilization: 87,
      maintenanceDueInDays: 45
    },
    {
      id: "MCH-WLD-01",
      name: "Panasonic Robotic MIG Cell",
      type: "Automated Welding Station",
      status: "Maintenance",
      oee: 62.0,
      availability: 68.0,
      performance: 92.0,
      quality: 99.2,
      currentOrder: "None (Preventive Servicing)",
      currentSku: "-",
      operator: "Maintenance Tech (Anil)",
      tempC: 28.0,
      vibrationMmS: 0.0,
      powerKw: 0.8,
      shiftCapHours: 8,
      scheduledHours: 2.0,
      utilization: 25,
      maintenanceDueInDays: 0 // Active servicing
    }
  ],

  // 4. Raw Material Inventory & Shortage Radar (Answers Q5, Q6)
  inventory: [
    {
      id: "MAT-STL-304",
      name: "Stainless Steel 304 Round Bar 50mm",
      category: "Raw Metal",
      currentStock: 340,
      unit: "kg",
      safetyStock: 250,
      allocated: 300,
      available: 40, // Low available!
      unitCost: 4.80,
      leadTimeDays: 4,
      supplier: "Salem Steel Corp",
      supplierReliability: 94,
      status: "Warning",
      burnRatePerDay: 95,
      stockoutInHours: 32,
      linkedOrders: ["ORD-8941", "ORD-8945", "ORD-8947"]
    },
    {
      id: "MAT-BRZ-932",
      name: "SAE 660 Bronze Bushing Solid Stock",
      category: "Raw Metal",
      currentStock: 65,
      unit: "kg",
      safetyStock: 100,
      allocated: 144, // In deficit!
      available: -79, // Critical shortage!
      unitCost: 12.50,
      leadTimeDays: 7,
      supplier: "Metals & Alloys India",
      supplierReliability: 78,
      status: "Critical Shortage",
      burnRatePerDay: 48,
      stockoutInHours: 0, // Stockout already blocking
      linkedOrders: ["ORD-8943"]
    },
    {
      id: "MAT-ALU-6061",
      name: "Aluminum Ingot 6061-T6 Extrusion",
      category: "Raw Metal",
      currentStock: 1850,
      unit: "kg",
      safetyStock: 500,
      allocated: 1440,
      available: 410,
      unitCost: 3.20,
      leadTimeDays: 3,
      supplier: "Hindalco Industries",
      supplierReliability: 98,
      status: "Optimal",
      burnRatePerDay: 280,
      stockoutInHours: 120,
      linkedOrders: ["ORD-8942"]
    },
    {
      id: "MAT-SHT-CRCA",
      name: "1.6mm CRCA Sheet (2500x1250mm)",
      category: "Sheet Metal",
      currentStock: 480,
      unit: "sheets",
      safetyStock: 150,
      allocated: 360,
      available: 120,
      unitCost: 28.00,
      leadTimeDays: 2,
      supplier: "JSW Steel Ltd",
      supplierReliability: 96,
      status: "Optimal",
      burnRatePerDay: 75,
      stockoutInHours: 110,
      linkedOrders: ["ORD-8944"]
    },
    {
      id: "MAT-TIT-TI6",
      name: "Titanium Ti-6Al-4V Grade 5 Bar",
      category: "Specialty Alloys",
      currentStock: 95,
      unit: "kg",
      safetyStock: 40,
      allocated: 44,
      available: 51,
      unitCost: 85.00,
      leadTimeDays: 14,
      supplier: "Midhani High Temp Alloys",
      supplierReliability: 92,
      status: "Optimal",
      burnRatePerDay: 10,
      stockoutInHours: 168,
      linkedOrders: ["ORD-8946"]
    },
    {
      id: "MAT-BRG-6205",
      name: "SKF High Load Ball Bearing 6205-2RS",
      category: "Bought-Out Components",
      currentStock: 110,
      unit: "pcs",
      safetyStock: 200,
      allocated: 480,
      available: -370, // Deficit!
      unitCost: 6.40,
      leadTimeDays: 2,
      supplier: "SKF Industrial Distributors",
      supplierReliability: 99,
      status: "Critical Shortage",
      burnRatePerDay: 160,
      stockoutInHours: 8,
      linkedOrders: ["ORD-8941"]
    }
  ],

  // 5. Automated Alerts & Notifications (Answers Q6)
  alerts: [
    {
      id: "ALT-101",
      severity: "danger", // danger, warning, info, success
      title: "Imminent Material Stockout: SAE 660 Bronze",
      message: "Stock deficit of 79 kg will stall Order ORD-8943 for Kirloskar Pumps. Supplier lead time is 7 days.",
      timestamp: "12 mins ago",
      source: "Predictive Inventory AI",
      suggestedAction: "Trigger Fast-Track PO to Secondary Vendor or swap production queue with ORD-8945.",
      actionLabel: "Auto-Draft Expedited PO",
      resolved: false
    },
    {
      id: "ALT-102",
      severity: "warning",
      title: "Delivery SLA Breach Risk: Order ORD-8941",
      message: "Order has only 2 days remaining with 28 estimated hours required. Machine CNC-01 load is at 90%. Delay penalty: $850/day.",
      timestamp: "34 mins ago",
      source: "SLA Predictive Engine",
      suggestedAction: "Authorize 2 hours overtime on Shift 2 or offload secondary deburring to Bench 4.",
      actionLabel: "Rebalance Schedule",
      resolved: false
    },
    {
      id: "ALT-103",
      severity: "warning",
      title: "Telemetry Anomaly: Mazak Lathe Spindle Heat",
      message: "Spindle bearing temp reached 71.8°C with vibration index 2.1 mm/s (normal < 1.5). Preventive check recommended.",
      timestamp: "1 hr ago",
      source: "IoT Machine Sentry",
      suggestedAction: "Schedule 30-min lubrication lube cycle during 13:00 lunch changeover.",
      actionLabel: "Schedule Maintenance Slot",
      resolved: false
    },
    {
      id: "ALT-104",
      severity: "info",
      title: "TallyPrime ERP Sync Completed",
      message: "Synchronized 14 new sales inquiries, 6 updated purchase receipts, and live inventory ledger.",
      timestamp: "2 hrs ago",
      source: "ERP Bridge",
      suggestedAction: "View mapped orders",
      actionLabel: "View Sync Log",
      resolved: true
    }
  ],

  // 6. Data Requirements Checklist (Answers Q8)
  dataRequirements: [
    {
      pillar: "1. Customer Orders Master",
      readiness: 95,
      status: "Ready",
      description: "Customer ID, Due Date SLA, Product SKU, Ordered Quantity, Agreed Penalty Clauses, Priority Tier.",
      whyImportant: "Defines the scheduling objective function, urgency deadlines, and financial penalty boundaries.",
      source: "Sales Orders / ERP / Excel Invoices",
      sampleFields: ["order_id", "customer_name", "delivery_due_date", "sku_code", "quantity", "penalty_per_day", "priority_tier"]
    },
    {
      pillar: "2. Bill of Materials (BOM) & Routing",
      readiness: 90,
      status: "Ready",
      description: "Hierarchical sub-assemblies, raw material quantities per unit, sequential workcenter route (Cut -> Turn -> Mill -> Weld -> Inspect).",
      whyImportant: "Prevents creating schedules for which raw components or sub-assembly steps are missing or out of order.",
      source: "Engineering CAD/CAM / PLM / BOM Spreadsheets",
      sampleFields: ["parent_sku", "component_mat_id", "qty_per_unit", "operation_sequence_step", "standard_cycle_time_mins", "setup_time_mins"]
    },
    {
      pillar: "3. Machine & Workcenter Capacity",
      readiness: 85,
      status: "Ready",
      description: "Machine speeds, compatible operations, tooling changeover matrices, shift working hours (1, 2 or 3 shifts), planned maintenance windows.",
      whyImportant: "Provides physical feasibility bounds. AI cannot allocate jobs to machines that lack proper tooling or are down.",
      source: "Shop Floor Registers / Equipment Manuals / Maintenance Schedule",
      sampleFields: ["machine_id", "machine_type", "shift_hours_per_day", "hourly_operating_cost", "changeover_matrix_minutes", "planned_downtime"]
    },
    {
      pillar: "4. Live Inventory & Supply Lead Times",
      readiness: 75,
      status: "Action Required",
      description: "On-hand stock levels, safety stock thresholds, purchase orders in transit, expected vendor delivery dates, supplier reliability score.",
      whyImportant: "Stops work centers from scheduling jobs that will get starved 2 hours into production due to missing stock.",
      source: "Warehouse Stores / Purchase Orders / Tally Stock",
      sampleFields: ["material_id", "current_physical_qty", "allocated_qty", "po_in_transit_qty", "vendor_lead_time_days", "supplier_reliability_pct"]
    }
  ],

  // 7. Software Integration Connectors (Answers Q10)
  integrations: [
    {
      name: "TallyPrime / Tally ERP 9",
      category: "Accounting & Inventory",
      logo: "tally",
      status: "Connected",
      badge: "Active Real-Time Sync",
      protocol: "XML / ODBC Gateway",
      lastSync: "3 mins ago",
      recordsSynced: "1,420 items & 38 sales orders",
      description: "The gold standard for small Indian manufacturing. Syncs sales orders, purchase receipts, and stock ledger automatically."
    },
    {
      name: "QuickBooks Online",
      category: "Order Management & Invoicing",
      logo: "quickbooks",
      status: "Connected",
      badge: "REST Webhook",
      lastSync: "15 mins ago",
      recordsSynced: "24 customer accounts",
      description: "Extracts international purchase orders, delivery milestones, and invoice settlement dates."
    },
    {
      name: "Excel & Google Sheets Live Folder",
      category: "Legacy Spreadsheet Sync",
      logo: "excel",
      status: "Connected",
      badge: "Auto-Watcher (10s)",
      lastSync: "Continuous",
      recordsSynced: "3 workbooks monitored",
      description: "SMEs don't have to change their habits: supervisors keep updating their Excel sheet, our background agent parses updates instantly."
    },
    {
      name: "Zoho Books & Inventory",
      category: "Cloud ERP & CRM",
      logo: "zoho",
      status: "Ready to Connect",
      badge: "API Available",
      lastSync: "Never",
      recordsSynced: "0 records",
      description: "One-click OAuth connection to fetch live inventory balances, reorder points, and bill of materials."
    },
    {
      name: "Shop-Floor Barcode / QR Scanner App",
      category: "Shop Floor IoT & Data Intake",
      logo: "barcode",
      status: "Connected",
      badge: "WebRTC / Tablet Camera",
      lastSync: "Just now",
      recordsSynced: "8 active operator terminals",
      description: "Zero expensive hardware needed. Machine operators scan job traveler QR codes with budget Android smartphones or tablets."
    }
  ],

  // 8. ROI, Cost & Wastage Impact Metrics (Answers Q11)
  kpiMetrics: {
    otif: {
      label: "On-Time In-Full (OTIF) Delivery",
      before: 68.4,
      after: 96.2,
      unit: "%",
      improvement: "+27.8%",
      color: "emerald"
    },
    leadTime: {
      label: "Average Order Cycle Time",
      before: 8.5,
      after: 5.2,
      unit: "days",
      improvement: "-38.8%",
      color: "blue"
    },
    machineUtilization: {
      label: "Overall Machine Utilization (OEE)",
      before: 58.2,
      after: 86.4,
      unit: "%",
      improvement: "+28.2%",
      color: "purple"
    },
    materialWastage: {
      label: "Material Scrap & Changeover Wastage",
      before: 7.8,
      after: 2.3,
      unit: "%",
      improvement: "-70.5%",
      color: "emerald"
    },
    monthlyDelays: {
      label: "Orders Stalled Due to Stockouts",
      before: 14,
      after: 1,
      unit: "orders/mo",
      improvement: "-92.8%",
      color: "emerald"
    },
    costSavings: {
      label: "Estimated Monthly Savings (Expediting & Scrap)",
      before: 0,
      after: 14250,
      unit: "$ / month",
      improvement: "$171,000 / year",
      color: "amber"
    }
  },

  // 9. Interactive Disruption Sandbox (Answers Q7)
  disruptionScenarios: [
    {
      id: "DISRUPT-01",
      title: "Scenario 1: CNC Lathe #2 Overheating Failure",
      severity: "High",
      type: "Machine Breakdown",
      description: "Mazak Quick Turn 250 trips thermal overload. Spindle motor requires 6 hours for emergency cooldown and bearing replacement.",
      impactedMachine: "MCH-CNC-02",
      impactedOrder: "ORD-8943 (Kirloskar Impeller)",
      aiResolutionPlan: [
        "1. Automatically halt MCH-CNC-02 queue and freeze execution timer.",
        "2. Query capability matrix: Haas VF-4 (MCH-CNC-01) can execute the identical 4-axis turning pass.",
        "3. Re-route remaining 44 units of ORD-8943 to MCH-CNC-01 starting at 14:00.",
        "4. Shift non-critical stock order ORD-8945 to tomorrow's night shift (absorbing 0 penalty).",
        "5. Result: 0 hours customer delay on Kirloskar delivery."
      ]
    },
    {
      id: "DISRUPT-02",
      title: "Scenario 2: Supplier Steel Delay (+3 Days)",
      severity: "Medium",
      type: "Material Supply Chain Delay",
      description: "Salem Steel informs that Grade 304 Stainless shipment is delayed by 72 hours due to highway transport strike.",
      impactedMachine: "MCH-CNC-01",
      impactedOrder: "ORD-8941 & ORD-8945",
      aiResolutionPlan: [
        "1. Identify active orders depending on Grade 304 steel.",
        "2. Calculate current on-hand buffer (40 kg remaining -> sufficient for 16 more hours).",
        "3. Promote fully-stocked Aluminum Order ORD-8942 into current slot on Milling line.",
        "4. Auto-generate dispatch request to local reserve warehouse in nearby industrial estate.",
        "5. Result: Prevents shop-floor starvation without paying rush procurement premiums."
      ]
    },
    {
      id: "DISRUPT-03",
      title: "Scenario 3: High-Priority Emergency Order Inserted",
      severity: "Critical",
      type: "Rush Order Insertion",
      description: "ISRO Subcontractor places emergency order for 20 Rocket Valve Bushings with 18-hour turnaround and 3x price multiplier.",
      impactedMachine: "MCH-MIL-01",
      impactedOrder: "ORD-8946",
      aiResolutionPlan: [
        "1. Calculate marginal revenue ($8,500 premium) vs postponement penalty of regular queue ($0).",
        "2. Dynamically allocate Priority Index 99.8 to Rush Order.",
        "3. Pause non-interrupted batch on DMG Mori 5-Axis at clean changeover step #3.",
        "4. Load emergency G-code program and assign Senior Specialist Operator.",
        "5. Result: 100% on-time emergency delivery with zero disruption to Tier-1 contracts."
      ]
    }
  ],

  // 10. AI Algorithm Specifications (Answers Q2)
  algorithms: [
    {
      id: "algo-hybrid",
      name: "Hybrid Genetic Algorithm + Constraint Propagation (Recommended)",
      badge: "Optimal (Global Minimum)",
      speed: "Fast (1.4s)",
      makespanReduction: "34%",
      description: "Combines strict physical constraint rules (BOM dependencies, machine tooling) with evolutionary genetic chromosomes to find the global optimum for delivery deadlines."
    },
    {
      id: "algo-cr",
      name: "Dynamic Critical Ratio (CR) Dispatching",
      badge: "Real-time Reactive",
      speed: "Instant (0.1s)",
      makespanReduction: "22%",
      description: "Calculates CR = (Due Date - Now) / Remaining Lead Time. Jobs with CR < 1.0 are instantly given priority lanes."
    },
    {
      id: "algo-setup",
      name: "Sequence-Dependent Setup Minimizer",
      badge: "Cost & Scrap Focused",
      speed: "Medium (0.8s)",
      makespanReduction: "28%",
      description: "Clusters jobs using identical raw metals, drill chucks, and paint colors together to cut machine idle changeover by up to 55%."
    }
  ],

  // 11. Comprehensive Answers to User Questions (For Student / Presentation Modal)
  vivaGuide: [
    {
      qNum: "Q1",
      question: "How do small manufacturing companies currently manage customer orders and production schedules?",
      shortAnswer: "They rely on fragmented Excel files, whiteboard markers, verbal shop-floor instructions, and emergency phone calls.",
      detailedAnswer: "In most small manufacturing enterprises (SMEs), customer orders are entered into desktop software like Tally or Excel, while machine scheduling is done manually on physical whiteboards or in supervisors' heads. Because the warehouse inventory, machine capacities, and promised shipping dates live in separate silos, supervisors only discover shortages or machine conflicts after work has already stalled.",
      appFeature: "Overview Dashboard -> 'Current vs AI-Powered' comparison matrix."
    },
    {
      qNum: "Q2",
      question: "How can AI automatically create an efficient production schedule?",
      shortAnswer: "Using multi-objective constraint optimization algorithms (Genetic Algorithms & Heuristics) to balance delivery SLAs, machine changeovers, and BOM readiness.",
      detailedAnswer: "The AI formalizes the factory as a Resource-Constrained Job Shop Scheduling Problem (RCJSSP). It maps each order into a Directed Acyclic Graph (DAG) of BOM dependencies, calculates sequence-dependent tooling setup times between consecutive jobs, and tests thousands of permutations in seconds to produce an optimal Gantt schedule that minimizes total tardiness and machine idle time.",
      appFeature: "AI Schedule Generator -> Real-time visual Gantt chart with 1-click generation."
    },
    {
      qNum: "Q3",
      question: "How should customer orders be prioritised based on delivery deadlines and urgency?",
      shortAnswer: "Using a multi-factor Critical Ratio (CR) formula weighted by customer tier and daily delay penalties.",
      detailedAnswer: "Orders cannot be prioritized by simple First-In-First-Out (FIFO) or due-date alone. The system computes a dynamic Priority Score: Priority = (Customer Tier Weight) × [ (Penalty Risk) / (Critical Ratio) ] × (Material Readiness). Orders with CR < 1.0 are mathematically late unless accelerated, automatically bumping them to the front of compatible machine queues.",
      appFeature: "Order Priority Matrix -> Live Critical Ratio calculation, urgency color coding, and penalty risk trackers."
    },
    {
      qNum: "Q4",
      question: "How can we monitor machine availability and production capacity in real time?",
      shortAnswer: "Through low-cost IoT edge sensors or operator tablet kiosks capturing cycle times, power, temperature, and OEE.",
      detailedAnswer: "Instead of expensive multimillion-dollar SCADA systems, SMEs deploy $50 budget Android tablets at each workcenter where operators tap 'Start Job', 'Hold/Setup', and 'Complete Job', or install clamp-on non-invasive CT current sensors. The frontend translates this telemetry into live OEE (Availability × Performance × Quality) and real-time machine capacity load gauges.",
      appFeature: "Shop-Floor Machines & Telemetry -> Live status badges, OEE gauges, and sensor heatmaps."
    },
    {
      qNum: "Q5",
      question: "How can AI predict possible production delays?",
      shortAnswer: "By analyzing queue congestion, supplier lead-time variance, machine cycle-time drift, and remaining time slack.",
      detailedAnswer: "The AI monitors four leading indicators: (1) Workcenter queue build-up exceeding shift hours, (2) Historical supplier delay rates for specific raw materials, (3) Micro-stoppages detected via cycle-time telemetry, and (4) Shrinking buffer slack. When an order's projected completion timestamp crosses the promised SLA, a predictive delay probability is generated days in advance.",
      appFeature: "Material Shortage & Risk Radar -> Predictive delay probabilities and bottleneck stage identification."
    },
    {
      qNum: "Q6",
      question: "How can the system automatically notify managers about material shortages and approaching deadlines?",
      shortAnswer: "Through an event-driven notification engine supporting in-app toasts, WhatsApp bot dispatches, and automated PO drafting.",
      detailedAnswer: "When scheduled jobs deplete on-hand material below safety thresholds within a 48-hour forward horizon, or when an order's Critical Ratio drops below 1.0, the alert engine triggers instant push notifications, logs an actionable card with suggested remedies, and pre-fills an expedited Purchase Order ready for manager approval with one click.",
      appFeature: "Smart Alert Notification Center & Drawer -> Severity filters and 1-click resolution actions."
    },
    {
      qNum: "Q7",
      question: "How can the system adjust production schedules when unexpected problems occur?",
      shortAnswer: "Through 1-Click Dynamic Rescheduling that re-routes orphaned operations to alternate compatible machines.",
      detailedAnswer: "When a machine breakdown or urgent rush order occurs, the AI freezes finished operations, unlocks downstream pending tasks, checks the factory's alternate machine capability matrix, and reshuffles the schedule. Non-critical jobs with high slack are postponed, while urgent jobs are dynamically rerouted with zero human recalculation stress.",
      appFeature: "What-If Disruption Simulator -> Interactive sandbox simulating breakdowns and auto-healing the schedule."
    },
    {
      qNum: "Q8",
      question: "What data is required to make accurate production plans?",
      shortAnswer: "The 4 Pillars: (1) Customer Orders Master, (2) Bill of Materials & Routing, (3) Machine Capacities, and (4) Live Inventory.",
      detailedAnswer: "Accurate AI planning requires: Order Master (due date, quantity, SLA penalties), BOM & Routing (component breakdown, operation sequence, standard cycle times, setup minutes), Machine Data (compatible operations, shift calendars, maintenance windows), and Inventory Data (on-hand quantities, safety stock, open POs, and vendor lead times).",
      appFeature: "Data Readiness & Audit Hub -> Interactive 4-pillar audit checklist and downloadable sample CSV templates."
    },
    {
      qNum: "Q9",
      question: "How can we make the system affordable and easy to use for small manufacturing companies?",
      shortAnswer: "By using cloud web apps, browser-based operator tablets, Excel drag-and-drop import, and micro-SaaS pricing.",
      detailedAnswer: "Small companies cannot afford $100k enterprise ERPs or dedicated IT staff. Our frontend runs on standard web browsers without local installation, supports 1-click spreadsheet imports so staff can keep familiar workflows, provides simple touch-friendly operator screens, and operates on an affordable monthly subscription model ($49-$99/month).",
      appFeature: "Affordability & Usability Blueprint -> 3-step setup walkthrough and low-barrier architecture summary."
    },
    {
      qNum: "Q10",
      question: "How can we integrate the system with existing inventory and order management software?",
      shortAnswer: "Through native connectors for TallyPrime (ODBC/XML), QuickBooks, Zoho, CSV auto-watchers, and REST APIs.",
      detailedAnswer: "Rather than forcing companies to replace their existing accounting or inventory software, OptiManufact AI acts as an intelligent orchestration layer on top. It connects to Tally via local XML/ODBC gateways, connects to cloud tools via webhooks, and watches designated shared folders for updated Excel sheets.",
      appFeature: "Software Integration Hub -> Live connector statuses, sync logs, and API payload inspectors."
    },
    {
      qNum: "Q11",
      question: "How can we measure whether the system reduces production delays, costs, and material wastage?",
      shortAnswer: "Through executive KPI dashboards tracking OTIF %, average cycle days, machine OEE, scrap rates, and overtime costs.",
      detailedAnswer: "The system establishes an automated baseline comparison: (1) OTIF Delivery tracks % of orders delivered without delay, (2) Scrap Rate tracks material discarded during setup and changeover, (3) OEE tracks true machine productivity, and (4) Financial Savings calculates avoided delay penalties and overtime labor reductions.",
      appFeature: "KPI Impact & ROI Analytics -> Interactive Before vs After comparisons and dynamic ROI calculator."
    }
  ]
};

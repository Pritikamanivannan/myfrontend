/**
 * OptiManufact AI - Charts & Visual Analytics Integration
 * Powered by Chart.js (CDN)
 */

const ChartsManager = {
  instances: {},

  initCapacityChart(canvasId = "machineCapacityChart") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (this.instances.capacity) this.instances.capacity.destroy();

    const machines = ManufacturingData.machines;
    const labels = machines.map(m => m.name.split(" ")[0] + " (" + m.id.split("-")[1] + ")");
    const scheduledHours = machines.map(m => m.scheduledHours);
    const capacityHours = machines.map(m => m.shiftCapHours);

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

    const ctx = canvas.getContext("2d");
    this.instances.capacity = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Scheduled Hours (Load)",
            data: scheduledHours,
            backgroundColor: "rgba(59, 130, 246, 0.85)",
            borderRadius: 6,
            borderWidth: 0
          },
          {
            label: "Shift Max Capacity",
            data: capacityHours,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(203, 213, 225, 0.6)",
            borderRadius: 6,
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: textColor, font: { family: "Inter", size: 12 } }
          },
          tooltip: {
            callbacks: {
              afterBody: function(context) {
                const idx = context[0].dataIndex;
                const util = Math.round((scheduledHours[idx] / capacityHours[idx]) * 100);
                return `Current Utilization: ${util}%`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              color: textColor,
              stepSize: 2,
              callback: val => val + " hrs"
            },
            grid: { color: gridColor }
          }
        }
      }
    });
  },

  initBeforeAfterChart(canvasId = "beforeAfterKpiChart") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (this.instances.beforeAfter) this.instances.beforeAfter.destroy();

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

    const ctx = canvas.getContext("2d");
    this.instances.beforeAfter = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "On-Time Delivery (OTIF)",
          "Machine Utilization (OEE)",
          "Schedule Adherence",
          "Material Availability",
          "Order Traceability",
          "Scrap Minimization"
        ],
        datasets: [
          {
            label: "Traditional / Manual Excel Scheduling",
            data: [68, 58, 52, 60, 45, 55],
            fill: true,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderColor: "rgba(239, 68, 68, 0.8)",
            pointBackgroundColor: "rgba(239, 68, 68, 1)",
            pointBorderColor: "#fff",
            borderWidth: 2
          },
          {
            label: "OptiManufact AI Autonomous Scheduling",
            data: [96, 88, 94, 95, 99, 92],
            fill: true,
            backgroundColor: "rgba(16, 185, 129, 0.25)",
            borderColor: "rgba(16, 185, 129, 0.9)",
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
            pointBorderColor: "#fff",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, font: { family: "Inter", size: 12 } }
          }
        },
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            suggestedMin: 30,
            suggestedMax: 100,
            ticks: {
              color: textColor,
              backdropColor: "transparent",
              stepSize: 20
            },
            pointLabels: {
              color: textColor,
              font: { family: "Inter", size: 11, weight: "bold" }
            }
          }
        }
      }
    });
  },

  initMaterialBurnChart(canvasId = "materialBurnChart") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (this.instances.materialBurn) this.instances.materialBurn.destroy();

    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

    const labels = ["Day 1 (Today)", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    // Steel 304 burn trajectory
    const steelStock = [340, 245, 150, 55, 0, 0, 250]; // replenishment arrives day 7
    // Bronze 932 (starts below deficit)
    const bronzeStock = [65, 17, 0, 0, 0, 0, 100];

    const ctx = canvas.getContext("2d");
    this.instances.materialBurn = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Steel 304 Bar (kg)",
            data: steelStock,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 4
          },
          {
            label: "Bronze 932 Bushing Stock (kg - Imminent Deficit)",
            data: bronzeStock,
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderDash: [5, 5],
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: "#ef4444"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: textColor, font: { family: "Inter", size: 12 } }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              callback: val => val + " kg"
            },
            grid: { color: gridColor }
          }
        }
      }
    });
  },

  refreshAll() {
    this.initCapacityChart();
    this.initBeforeAfterChart();
    this.initMaterialBurnChart();
  }
};

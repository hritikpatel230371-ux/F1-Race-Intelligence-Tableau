/* Set these values only after the public project URLs are available. */
const TABLEAU_DASHBOARD_URL = "";
const GITHUB_REPOSITORY_URL = "https://github.com/hritikpatel230371-ux/F1-Race-Intelligence-Tableau";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const floatingTop = document.querySelector(".floating-top");
  const year = document.querySelector("#copyright-year");

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navigation.classList.contains("is-open")) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
        menuButton.focus();
      }
    });
  }

  if (floatingTop) {
    const updateBackToTop = () => floatingTop.classList.toggle("is-visible", window.scrollY > 520);
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }

  configureDashboard();
  configureRepositoryLink();
  initializeDemoCharts();

  function configureDashboard() {
    const iframe = document.querySelector(".tableau-embed");
    const placeholder = document.querySelector(".dashboard-placeholder");
    const openLink = document.querySelector(".dashboard-open");
    const fallbackLink = document.querySelector(".fallback-dashboard-link");
    const validUrl = isValidPublicUrl(TABLEAU_DASHBOARD_URL, ["public.tableau.com"]);

    if (!iframe || !placeholder || !openLink || !fallbackLink) return;

    if (!validUrl) {
      openLink.setAttribute("aria-disabled", "true");
      openLink.setAttribute("tabindex", "-1");
      return;
    }

    iframe.src = TABLEAU_DASHBOARD_URL;
    iframe.hidden = false;
    iframe.title = "F1 Race Intelligence Tableau Public dashboard";
    placeholder.hidden = true;
    openLink.hidden = false;
    openLink.href = TABLEAU_DASHBOARD_URL;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    fallbackLink.href = TABLEAU_DASHBOARD_URL;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.hidden = false;
  }

  function configureRepositoryLink() {
    const validUrl = isValidPublicUrl(GITHUB_REPOSITORY_URL, ["github.com"]);
    const repoLabel = document.querySelector(".footer-link-pending");
    if (!validUrl || !repoLabel) return;

    const link = document.createElement("a");
    link.href = GITHUB_REPOSITORY_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "footer-link-pending";
    link.textContent = "GITHUB REPOSITORY ↗";
    repoLabel.replaceWith(link);
  }

  function isValidPublicUrl(value, allowedHosts) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && allowedHosts.includes(url.hostname);
    } catch {
      return false;
    }
  }

  function initializeDemoCharts() {
    const status = document.querySelector("#chart-status");
    const canvases = ["driver-chart", "team-chart", "tyre-chart", "dnf-chart"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!window.Chart) {
      canvases.forEach(showChartFallback);
      if (status) status.textContent = "Chart library unavailable. Illustrative chart previews could not be loaded.";
      return;
    }

    const palette = {
      red: "#ee252b",
      redSoft: "rgba(238, 37, 43, .23)",
      orange: "#c98a4b",
      pale: "#d6d7d4",
      muted: "#8b8e92",
      grid: "rgba(255, 255, 255, .08)"
    };
    const seasons = ["2010", "2016", "2020", "2026"];
    const teams = ["Team A", "Team B", "Team C"];
    const driverChart = createChart("driver-chart", {
      type: "bar",
      data: { labels: ["Driver 01", "Driver 02", "Driver 03", "Driver 04", "Driver 05"], datasets: [] },
      options: chartOptions(palette, { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: "Illustrative points" } } } })
    });
    const teamChart = createChart("team-chart", {
      type: "bar",
      data: { labels: teams, datasets: [] },
      options: chartOptions(palette, { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: "Illustrative points" } } } })
    });
    const tyreChart = createChart("tyre-chart", {
      type: "doughnut",
      data: { labels: ["Soft", "Medium", "Hard", "Intermediate"], datasets: [{ data: [], backgroundColor: [palette.red, palette.orange, palette.pale, "#58636d"], borderColor: "#191b1e", borderWidth: 3, hoverOffset: 5 }] },
      options: chartOptions(palette, { cutout: "68%", plugins: { legend: { position: "bottom", labels: { padding: 16, boxWidth: 8, usePointStyle: true } } } })
    });
    const dnfChart = createChart("dnf-chart", {
      type: "bar",
      data: { labels: ["Mechanical", "Collision", "Handling", "Other"], datasets: [] },
      options: chartOptions(palette, { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, title: { display: true, text: "Illustrative count" } } } })
    });

    if (![driverChart, teamChart, tyreChart, dnfChart].every(Boolean)) {
      if (status) status.textContent = "One or more charts could not be initialized. Try reloading the page.";
      return;
    }

    const seasonFilter = document.querySelector("#season-filter");
    const teamFilter = document.querySelector("#team-filter");
    const samplePoints = {
      "2010": [220, 184, 142, 96, 71],
      "2016": [203, 192, 159, 117, 82],
      "2020": [246, 171, 136, 113, 74],
      "2026": [188, 166, 131, 102, 67]
    };
    const sampleTeams = {
      "2010": [405, 321, 214],
      "2016": [374, 348, 236],
      "2020": [417, 295, 248],
      "2026": [359, 312, 227]
    };
    const sampleDnfs = {
      "2010": [12, 8, 5, 4],
      "2016": [9, 11, 4, 6],
      "2020": [7, 9, 6, 3],
      "2026": [10, 6, 4, 5]
    };
    const driverLabels = ["Driver 01", "Driver 02", "Driver 03", "Driver 04", "Driver 05"];
    const driverTeams = ["Team A", "Team A", "Team B", "Team B", "Team C"];
    const dnfLabels = ["Mechanical", "Collision", "Handling", "Other"];
    const sampleTyres = {
      "2010": [40, 32, 20, 8],
      "2016": [36, 34, 22, 8],
      "2020": [42, 30, 19, 9],
      "2026": [35, 33, 24, 8]
    };

    function refreshCharts() {
      const selectedSeason = seasonFilter ? seasonFilter.value : "all";
      const selectedTeam = teamFilter ? teamFilter.value : "all";
      const activeSeasons = selectedSeason === "all" ? seasons : [selectedSeason];
      const drivers = activeSeasons.flatMap((season) => {
        return samplePoints[season].map((points, index) => ({
          name: `${season.slice(-2)} · ${driverLabels[index]}`,
          points,
          team: driverTeams[index]
        })).filter((driver) => selectedTeam === "all" || driver.team === selectedTeam);
      }).slice(0, selectedSeason === "all" ? 8 : 5);

      driverChart.data.labels = drivers.map((driver) => driver.name);
      driverChart.data.datasets = [{
        data: drivers.map((driver) => driver.points),
        backgroundColor: drivers.map((_, index) => index === 0 ? palette.red : palette.redSoft),
        borderColor: drivers.map((_, index) => index === 0 ? palette.red : "rgba(238,37,43,.38)"),
        borderWidth: 1,
        borderRadius: 2
      }];

      const totals = teams.map((team, index) => {
        if (selectedTeam !== "all" && selectedTeam !== team) return null;
        const sum = activeSeasons.reduce((total, season) => total + sampleTeams[season][index], 0);
        return selectedSeason === "all" ? Math.round(sum / activeSeasons.length) : sum;
      });
      teamChart.data.datasets = [{
        data: totals,
        backgroundColor: teams.map((team) => team === selectedTeam || selectedTeam === "all" && team === "Team A" ? palette.red : palette.redSoft),
        borderRadius: 2
      }];

      const teamTyreFactors = { "Team A": 1, "Team B": 0.82, "Team C": 0.68 };
      const selectedTyreFactor = selectedTeam === "all" ? 1 : teamTyreFactors[selectedTeam];
      const tyreTotals = [0, 0, 0, 0];
      activeSeasons.forEach((season) => {
        sampleTyres[season].forEach((value, index) => {
          tyreTotals[index] += value * selectedTyreFactor;
        });
      });
      tyreChart.data.datasets[0].data = tyreTotals.map((value) => Math.round(value));

      dnfChart.data.labels = dnfLabels;
      dnfChart.data.datasets = [{
        data: dnfLabels.map((_, index) => {
          const count = activeSeasons.reduce((total, season) => total + sampleDnfs[season][index], 0);
          const selectedTeamFactor = selectedTeam === "all" ? 1 : 0.58 + teams.indexOf(selectedTeam) * 0.14;
          return Math.round(count * selectedTeamFactor);
        }),
        backgroundColor: [palette.red, palette.orange, "#7e8790", "#51565c"],
        borderRadius: 2
      }];

      [driverChart, teamChart, dnfChart].forEach((chart) => chart.update());
      if (status) {
        const seasonText = selectedSeason === "all" ? "all sample seasons" : `sample season ${selectedSeason}`;
        const teamText = selectedTeam === "all" ? "all sample teams" : selectedTeam;
        status.textContent = `Illustrative sample data · ${seasonText} · ${teamText}. These values are not verified F1 findings.`;
      }
    }

    if (seasonFilter) seasonFilter.addEventListener("change", refreshCharts);
    if (teamFilter) teamFilter.addEventListener("change", refreshCharts);
    refreshCharts();
  }

  function createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    try {
      return new window.Chart(canvas, config);
    } catch (error) {
      showChartFallback(canvas);
      return null;
    }
  }

  function chartOptions(palette, overrides) {
    const baseScales = {
      x: { ticks: { color: palette.muted, font: { family: "DM Sans", size: 9 }, maxRotation: 0 }, grid: { color: palette.grid } },
      y: { ticks: { color: palette.muted, font: { family: "DM Sans", size: 9 } }, grid: { color: palette.grid } }
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        legend: { labels: { color: palette.muted, font: { family: "DM Sans", size: 10 } } },
        tooltip: { backgroundColor: "#0b0c0d", titleColor: "#fff", bodyColor: "#c4c5c6", borderColor: "rgba(255,255,255,.16)", borderWidth: 1 }
      },
      ...overrides
    };
    options.scales = {
      x: { ...baseScales.x, ...(overrides.scales?.x || {}) },
      y: { ...baseScales.y, ...(overrides.scales?.y || {}) }
    };
    return options;
  }

  function showChartFallback(canvas) {
    if (!canvas || !canvas.parentElement) return;
    const fallback = document.createElement("p");
    fallback.className = "chart-fallback";
    fallback.textContent = "Illustrative chart preview is unavailable. The data has not been verified.";
    canvas.replaceWith(fallback);
  }
});

// Trading Journal App - Main JavaScript
class TradingJournal {
    constructor() {
        this.currentPage = 'dashboard';
        this.trades = [];
        this.goals = [];
        this.dailyNotes = [];
        this.tradingPlan = {};
        this.stats = {};
        this.motivationalQuotes = [];
        this.currentEditingTrade = null;
        this.timerInterval = null;
        this.timerMinutes = 25;
        this.timerSeconds = 0;
        this.isTimerRunning = false;

        this.init();
    }

    init() {
        this.loadMockData();
        this.setupEventListeners();
        this.initCharts();
        this.renderCurrentPage();
        this.updateStats();
    }

    loadMockData() {
        // Load trades data
        this.trades = [
            {
                id: 1,
                date: "2024-12-28",
                symbol: "EURUSD",
                direction: "Long",
                entry: 1.0542,
                exit: 1.0587,
                sl: 1.0520,
                tp: 1.0580,
                rr: 2.05,
                pnl: 450,
                comments: "Strong bullish momentum after ECB news",
                rating: 4,
                emotion: "Confident",
                tags: ["ECB", "News Trading"]
            },
            {
                id: 2,
                date: "2024-12-27",
                symbol: "GBPUSD",
                direction: "Short",
                entry: 1.2658,
                exit: 1.2695,
                sl: 1.2680,
                tp: 1.2620,
                rr: -1.68,
                pnl: -370,
                comments: "Stopped out, market reversed unexpectedly",
                rating: 2,
                emotion: "Frustrated",
                tags: ["Stop Loss", "Reversal"]
            },
            {
                id: 3,
                date: "2024-12-26",
                symbol: "GOLD",
                direction: "Long",
                entry: 2335.50,
                exit: 2348.20,
                sl: 2328.00,
                tp: 2350.00,
                rr: 1.69,
                pnl: 635,
                comments: "Perfect support bounce, textbook setup",
                rating: 5,
                emotion: "Calm",
                tags: ["Support", "Technical Analysis"]
            },
            {
                id: 4,
                date: "2024-12-25",
                symbol: "SPY",
                direction: "Long",
                entry: 428.50,
                exit: 432.80,
                sl: 425.20,
                tp: 435.00,
                rr: 1.30,
                pnl: 430,
                comments: "Earnings season momentum play",
                rating: 3,
                emotion: "Excited",
                tags: ["Earnings", "Momentum"]
            },
            {
                id: 5,
                date: "2024-12-24",
                symbol: "AAPL",
                direction: "Short",
                entry: 192.45,
                exit: 189.20,
                sl: 194.50,
                tp: 188.00,
                rr: 1.59,
                pnl: 325,
                comments: "Overvalued after recent rally",
                rating: 4,
                emotion: "Confident",
                tags: ["Overvalued", "Tech"]
            }
        ];

        // Load goals data
        this.goals = [
            {
                id: 1,
                title: "Target Mensile di Profitto",
                target: 5000,
                current: 3250,
                category: "Profit",
                deadline: "2024-12-31"
            },
            {
                id: 2,
                title: "Win Rate Sopra il 65%",
                target: 65,
                current: 68,
                category: "Consistency",
                deadline: "2024-12-31"
            },
            {
                id: 3,
                title: "Max Drawdown Sotto l'8%",
                target: 8,
                current: 5.2,
                category: "Risk Management",
                deadline: "2024-12-31"
            }
        ];

        // Load trading plan
        this.tradingPlan = {
            strategy: "Focus on major forex pairs and gold during London/NY overlap. Look for momentum breaks and support/resistance bounces.",
            riskManagement: "Risk max 2% per trade. Use 1:2 minimum risk-reward ratio. No more than 3 trades per day.",
            goals: "Target 15% monthly return with max 10% drawdown."
        };

        // Load daily notes
        this.dailyNotes = [
            {
                date: "2024-12-28",
                note: "Great trading day! Followed my plan perfectly and stayed disciplined.",
                emotion: "Confident",
                tags: ["Discipline", "Plan Following"]
            },
            {
                date: "2024-12-27",
                note: "Tough day, got stopped out early. Need to be more patient with entries.",
                emotion: "Frustrated",
                tags: ["Patience", "Entry Timing"]
            }
        ];

        // Load motivational quotes
        this.motivationalQuotes = [
            "The market rewards patience and punishes emotion.",
            "Your worst enemy in trading is yourself.",
            "Plan your trade and trade your plan.",
            "Risk comes from not knowing what you're doing.",
            "In trading, you have to be defensive and aggressive at the same time.",
            "Cut your losses short and let your profits run.",
            "The trend is your friend until the end when it bends.",
            "Never risk more than you can afford to lose."
        ];

        // Calculate stats
        this.calculateStats();
    }

    calculateStats() {
        const totalPnl = this.trades.reduce((sum, trade) => sum + trade.pnl, 0);
        const winningTrades = this.trades.filter(trade => trade.pnl > 0);
        const losingTrades = this.trades.filter(trade => trade.pnl < 0);
        
        const winRate = this.trades.length > 0 ? (winningTrades.length / this.trades.length) * 100 : 0;
        const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length : 0;
        const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length) : 0;
        const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

        this.stats = {
            totalTrades: this.trades.length,
            winRate: winRate,
            profitFactor: profitFactor,
            totalPnl: totalPnl,
            maxDrawdown: 5.2,
            sharpeRatio: 1.67,
            avgWin: avgWin,
            avgLoss: avgLoss
        };
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }

        // Trade modal
        const addTradeBtn = document.getElementById('addTradeBtn');
        const tradeModal = document.getElementById('tradeModal');
        const closeModal = document.getElementById('closeModal');
        const cancelTrade = document.getElementById('cancelTrade');
        const tradeForm = document.getElementById('tradeForm');

        if (addTradeBtn) {
            addTradeBtn.addEventListener('click', () => {
                this.openTradeModal();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeTradeModal();
            });
        }

        if (cancelTrade) {
            cancelTrade.addEventListener('click', () => {
                this.closeTradeModal();
            });
        }

        if (tradeForm) {
            tradeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTrade();
            });
        }

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (prevMonth) {
            prevMonth.addEventListener('click', () => {
                this.navigateCalendar(-1);
            });
        }

        if (nextMonth) {
            nextMonth.addEventListener('click', () => {
                this.navigateCalendar(1);
            });
        }

        // Journal form
        const saveJournal = document.getElementById('saveJournal');
        if (saveJournal) {
            saveJournal.addEventListener('click', () => {
                this.saveJournalEntry();
            });
        }

        // Trading plan
        const savePlan = document.getElementById('savePlan');
        if (savePlan) {
            savePlan.addEventListener('click', () => {
                this.saveTradingPlan();
            });
        }

        // Focus timer
        const startTimer = document.getElementById('startTimer');
        const pauseTimer = document.getElementById('pauseTimer');
        const resetTimer = document.getElementById('resetTimer');
        const newQuote = document.getElementById('newQuote');

        if (startTimer) {
            startTimer.addEventListener('click', () => {
                this.startFocusTimer();
            });
        }

        if (pauseTimer) {
            pauseTimer.addEventListener('click', () => {
                this.pauseFocusTimer();
            });
        }

        if (resetTimer) {
            resetTimer.addEventListener('click', () => {
                this.resetFocusTimer();
            });
        }

        if (newQuote) {
            newQuote.addEventListener('click', () => {
                this.showNewQuote();
            });
        }

        // Analytics filters
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterAnalytics(e.target.dataset.period);
            });
        });

        // Trade filters
        const symbolFilter = document.getElementById('symbolFilter');
        const directionFilter = document.getElementById('directionFilter');
        const dateFromFilter = document.getElementById('dateFromFilter');
        const dateToFilter = document.getElementById('dateToFilter');

        [symbolFilter, directionFilter, dateFromFilter, dateToFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => {
                    this.filterTrades();
                });
            }
        });

        // Modal backdrop click
        tradeModal?.addEventListener('click', (e) => {
            if (e.target === tradeModal) {
                this.closeTradeModal();
            }
        });
    }

    navigateToPage(page) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page visibility
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');

        // Update page title
        const pageTitles = {
            dashboard: 'Dashboard',
            calendar: 'Calendario',
            journal: 'Journal',
            trades: 'Operazioni',
            analytics: 'Analytics',
            plan: 'Trading Plan',
            goals: 'Obiettivi',
            focus: 'Focus'
        };

        document.getElementById('pageTitle').textContent = pageTitles[page];
        this.currentPage = page;

        // Render page-specific content
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        switch (this.currentPage) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
            case 'journal':
                this.renderJournal();
                break;
            case 'trades':
                this.renderTrades();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'plan':
                this.renderTradingPlan();
                break;
            case 'goals':
                this.renderGoals();
                break;
            case 'focus':
                this.renderFocus();
                break;
        }
    }

    renderDashboard() {
        this.renderRecentTrades();
        if (typeof Chart !== 'undefined') {
            this.initCharts();
        }
    }

    renderRecentTrades() {
        const tbody = document.getElementById('recentTradesBody');
        if (!tbody) return;

        const recentTrades = this.trades.slice(0, 5);
        tbody.innerHTML = '';

        recentTrades.forEach(trade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(trade.date)}</td>
                <td>${trade.symbol}</td>
                <td>${trade.direction}</td>
                <td class="${trade.pnl >= 0 ? 'profit-cell' : 'loss-cell'}">
                    €${trade.pnl.toFixed(0)}
                </td>
                <td>${this.renderStars(trade.rating)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Create calendar days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header-day';
            header.textContent = day;
            header.style.fontWeight = '600';
            header.style.textAlign = 'center';
            header.style.padding = '12px';
            header.style.color = 'var(--color-text-secondary)';
            calendarGrid.appendChild(header);
        });

        // Add calendar days
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = currentDate.getDate();

            // Check if this date has trades
            const dateStr = this.formatDateForStorage(currentDate);
            const dayTrades = this.trades.filter(trade => trade.date === dateStr);
            
            if (dayTrades.length > 0) {
                const totalPnl = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
                if (totalPnl > 0) {
                    dayEl.classList.add('profit');
                } else {
                    dayEl.classList.add('loss');
                }
            }

            // Check if today
            if (currentDate.toDateString() === now.toDateString()) {
                dayEl.classList.add('today');
            }

            // Check if current month
            if (currentDate.getMonth() !== month) {
                dayEl.style.opacity = '0.3';
            }

            calendarGrid.appendChild(dayEl);
        }
    }

    renderJournal() {
        const dateInput = document.getElementById('journalDate');
        if (dateInput) {
            dateInput.value = this.formatDateForStorage(new Date());
        }
    }

    renderTrades() {
        const tbody = document.getElementById('tradesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.trades.forEach(trade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(trade.date)}</td>
                <td>${trade.symbol}</td>
                <td>${trade.direction}</td>
                <td>${trade.entry}</td>
                <td>${trade.exit || '-'}</td>
                <td>${trade.sl || '-'}</td>
                <td>${trade.tp || '-'}</td>
                <td>${trade.rr ? trade.rr.toFixed(2) : '-'}</td>
                <td class="${trade.pnl >= 0 ? 'profit-cell' : 'loss-cell'}">
                    €${trade.pnl.toFixed(0)}
                </td>
                <td>${this.renderStars(trade.rating)}</td>
                <td>
                    <button class="action-btn edit" onclick="app.editTrade(${trade.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="app.deleteTrade(${trade.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderAnalytics() {
        // Analytics is mostly static with the current stats
        // In a real app, this would filter data based on selected period
    }

    renderTradingPlan() {
        const strategyText = document.getElementById('strategyText');
        const riskText = document.getElementById('riskText');
        const goalsText = document.getElementById('goalsText');

        if (strategyText) strategyText.value = this.tradingPlan.strategy || '';
        if (riskText) riskText.value = this.tradingPlan.riskManagement || '';
        if (goalsText) goalsText.value = this.tradingPlan.goals || '';
    }

    renderGoals() {
        const goalsGrid = document.getElementById('goalsGrid');
        if (!goalsGrid) return;

        goalsGrid.innerHTML = '';

        this.goals.forEach(goal => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = goal.current >= goal.target;

            const goalCard = document.createElement('div');
            goalCard.className = 'goal-card';
            goalCard.innerHTML = `
                <div class="goal-header">
                    <h4 class="goal-title">${goal.title}</h4>
                    <span class="goal-category">${goal.category}</span>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="goal-stats">
                    <span>Progresso: ${goal.current}${goal.category === 'Profit' ? '€' : '%'}</span>
                    <span>Target: ${goal.target}${goal.category === 'Profit' ? '€' : '%'}</span>
                </div>
            `;

            if (isCompleted) {
                goalCard.style.borderLeft = '4px solid var(--color-finance-green)';
            }

            goalsGrid.appendChild(goalCard);
        });
    }

    renderFocus() {
        this.showNewQuote();
        this.updateTimerDisplay();
    }

    initCharts() {
        // Only initialize if Chart.js is available
        if (typeof Chart === 'undefined') {
            // Create simple placeholder charts with CSS
            this.createPlaceholderCharts();
            return;
        }

        // Equity Curve Chart
        const equityCtx = document.getElementById('equityChart');
        if (equityCtx) {
            new Chart(equityCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Equity',
                        data: [1000, 1200, 1150, 1400, 1350, 1470],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }

        // Win/Loss Chart
        const winLossCtx = document.getElementById('winLossChart');
        if (winLossCtx) {
            const winningTrades = this.trades.filter(trade => trade.pnl > 0).length;
            const losingTrades = this.trades.filter(trade => trade.pnl < 0).length;

            new Chart(winLossCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Vincenti', 'Perdenti'],
                    datasets: [{
                        data: [winningTrades, losingTrades],
                        backgroundColor: ['#10b981', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    createPlaceholderCharts() {
        // Create simple CSS-based chart placeholders
        const equityChart = document.getElementById('equityChart');
        const winLossChart = document.getElementById('winLossChart');

        if (equityChart) {
            equityChart.innerHTML = `
                <div style="display: flex; align-items: end; height: 100%; justify-content: space-around; padding: 20px;">
                    <div style="width: 20px; height: 60%; background: var(--color-finance-green); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 80%; background: var(--color-finance-green); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 70%; background: var(--color-finance-red); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 90%; background: var(--color-finance-green); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 85%; background: var(--color-finance-green); border-radius: 2px;"></div>
                    <div style="width: 20px; height: 95%; background: var(--color-finance-green); border-radius: 2px;"></div>
                </div>
            `;
        }

        if (winLossChart) {
            winLossChart.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column;">
                    <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(var(--color-finance-green) 0deg 245deg, var(--color-finance-red) 245deg 360deg); margin-bottom: 20px;"></div>
                    <div style="display: flex; gap: 20px; font-size: 14px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 12px; height: 12px; background: var(--color-finance-green); border-radius: 2px;"></div>
                            <span>Vincenti</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 12px; height: 12px; background: var(--color-finance-red); border-radius: 2px;"></div>
                            <span>Perdenti</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    updateStats() {
        // Update dashboard stats if on dashboard page
        if (this.currentPage === 'dashboard') {
            // Stats are already rendered in HTML, this would update them dynamically
        }
    }

    // Trade Management
    openTradeModal(trade = null) {
        const modal = document.getElementById('tradeModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (trade) {
            modalTitle.textContent = 'Modifica Operazione';
            this.currentEditingTrade = trade.id;
            this.populateTradeForm(trade);
        } else {
            modalTitle.textContent = 'Nuova Operazione';
            this.currentEditingTrade = null;
            this.clearTradeForm();
        }
        
        modal.classList.add('active');
    }

    closeTradeModal() {
        const modal = document.getElementById('tradeModal');
        modal.classList.remove('active');
        this.currentEditingTrade = null;
        this.clearTradeForm();
    }

    populateTradeForm(trade) {
        document.getElementById('tradeDate').value = trade.date;
        document.getElementById('tradeSymbol').value = trade.symbol;
        document.getElementById('tradeDirection').value = trade.direction;
        document.getElementById('tradeEntry').value = trade.entry;
        document.getElementById('tradeExit').value = trade.exit || '';
        document.getElementById('tradeSL').value = trade.sl || '';
        document.getElementById('tradeTP').value = trade.tp || '';
        document.getElementById('tradePnL').value = trade.pnl;
        document.getElementById('tradeComments').value = trade.comments || '';
        document.getElementById('tradeRating').value = trade.rating || '';
        document.getElementById('tradeEmotion').value = trade.emotion || '';
    }

    clearTradeForm() {
        document.getElementById('tradeForm').reset();
        document.getElementById('tradeDate').value = this.formatDateForStorage(new Date());
    }

    saveTrade() {
        const formData = {
            date: document.getElementById('tradeDate').value,
            symbol: document.getElementById('tradeSymbol').value,
            direction: document.getElementById('tradeDirection').value,
            entry: parseFloat(document.getElementById('tradeEntry').value),
            exit: parseFloat(document.getElementById('tradeExit').value) || null,
            sl: parseFloat(document.getElementById('tradeSL').value) || null,
            tp: parseFloat(document.getElementById('tradeTP').value) || null,
            pnl: parseFloat(document.getElementById('tradePnL').value) || 0,
            comments: document.getElementById('tradeComments').value,
            rating: parseInt(document.getElementById('tradeRating').value) || null,
            emotion: document.getElementById('tradeEmotion').value
        };

        // Calculate R:R ratio
        if (formData.entry && formData.exit && formData.sl) {
            const risk = Math.abs(formData.entry - formData.sl);
            const reward = Math.abs(formData.exit - formData.entry);
            formData.rr = risk > 0 ? reward / risk : 0;
        }

        if (this.currentEditingTrade) {
            // Update existing trade
            const index = this.trades.findIndex(t => t.id === this.currentEditingTrade);
            if (index !== -1) {
                this.trades[index] = { ...this.trades[index], ...formData };
            }
        } else {
            // Add new trade
            formData.id = Date.now();
            formData.tags = [];
            this.trades.unshift(formData);
        }

        this.calculateStats();
        this.closeTradeModal();
        this.renderCurrentPage();
    }

    editTrade(id) {
        const trade = this.trades.find(t => t.id === id);
        if (trade) {
            this.openTradeModal(trade);
        }
    }

    deleteTrade(id) {
        if (confirm('Sei sicuro di voler eliminare questa operazione?')) {
            this.trades = this.trades.filter(t => t.id !== id);
            this.calculateStats();
            this.renderCurrentPage();
        }
    }

    filterTrades() {
        // This would filter the trades table based on selected filters
        // For now, just re-render all trades
        this.renderTrades();
    }

    // Calendar Navigation
    navigateCalendar(direction) {
        // For simplicity, just re-render current month
        // In a real app, this would change the month
        this.renderCalendar();
    }

    // Journal
    saveJournalEntry() {
        const date = document.getElementById('journalDate').value;
        const note = document.getElementById('journalNotes').value;
        const emotion = document.getElementById('journalEmotion').value;
        const tags = document.getElementById('journalTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (!date || !note) {
            alert('Per favore, compila tutti i campi obbligatori.');
            return;
        }

        const entry = { date, note, emotion, tags };
        
        // Check if entry for this date already exists
        const existingIndex = this.dailyNotes.findIndex(n => n.date === date);
        if (existingIndex !== -1) {
            this.dailyNotes[existingIndex] = entry;
        } else {
            this.dailyNotes.push(entry);
        }

        alert('Entry salvata con successo!');
        this.clearJournalForm();
    }

    clearJournalForm() {
        document.getElementById('journalNotes').value = '';
        document.getElementById('journalEmotion').value = '';
        document.getElementById('journalTags').value = '';
    }

    // Trading Plan
    saveTradingPlan() {
        this.tradingPlan = {
            strategy: document.getElementById('strategyText').value,
            riskManagement: document.getElementById('riskText').value,
            goals: document.getElementById('goalsText').value
        };

        alert('Piano di trading salvato con successo!');
    }

    // Focus Timer
    startFocusTimer() {
        if (!this.isTimerRunning) {
            this.isTimerRunning = true;
            this.timerInterval = setInterval(() => {
                if (this.timerSeconds === 0) {
                    if (this.timerMinutes === 0) {
                        this.timerCompleted();
                        return;
                    }
                    this.timerMinutes--;
                    this.timerSeconds = 59;
                } else {
                    this.timerSeconds--;
                }
                this.updateTimerDisplay();
            }, 1000);
        }
    }

    pauseFocusTimer() {
        this.isTimerRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetFocusTimer() {
        this.pauseFocusTimer();
        this.timerMinutes = 25;
        this.timerSeconds = 0;
        this.updateTimerDisplay();
    }

    timerCompleted() {
        this.pauseFocusTimer();
        alert('Timer completato! Prenditi una pausa di 5 minuti.');
        this.resetFocusTimer();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (display) {
            const minutes = this.timerMinutes.toString().padStart(2, '0');
            const seconds = this.timerSeconds.toString().padStart(2, '0');
            display.textContent = `${minutes}:${seconds}`;
        }
    }

    showNewQuote() {
        const quoteElement = document.getElementById('motivationText');
        if (quoteElement && this.motivationalQuotes.length > 0) {
            const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
            quoteElement.textContent = randomQuote;
        }
    }

    // Analytics
    filterAnalytics(period) {
        // This would filter analytics data based on period
        // For now, just show static data
        console.log('Filtering analytics for period:', period);
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatDateForStorage(date) {
        return date.toISOString().split('T')[0];
    }

    renderStars(rating) {
        if (!rating) return '-';
        
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star star"></i>';
            } else {
                stars += '<i class="fas fa-star star empty"></i>';
            }
        }
        return `<div class="rating-stars">${stars}</div>`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TradingJournal();
});

// Load Chart.js dynamically
const chartScript = document.createElement('script');
chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
chartScript.onload = () => {
    if (window.app) {
        window.app.initCharts();
    }
};
document.head.appendChild(chartScript);
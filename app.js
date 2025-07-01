// Trading Journal App - Complete Implementation
class TradingJournalApp {
    constructor() {
        // Simulated data storage (replacing localStorage for sandbox compatibility)
        this.data = {
            trades: [],
            journalEntries: [],
            goals: [],
            initialized: false
        };
        
        // Initialize sample data
        this.initializeSampleData();
        
        // Current state
        this.currentPage = 'dashboard';
        this.currentMonth = new Date();
        this.charts = {};
        this.timer = {
            minutes: 25,
            seconds: 0,
            isRunning: false,
            interval: null
        };
        
        // Motivational quotes
        this.motivationalQuotes = [
            "The market rewards patience and discipline",
            "Plan your trade and trade your plan",
            "Risk management is the key to longevity",
            "Stay focused on the process, not the outcome",
            "Every loss is a learning opportunity"
        ];
        
        this.init();
    }
    
    initializeSampleData() {
        // Sample trades data
        this.data.trades = [
            {
                id: 1,
                date: "2024-12-15",
                symbol: "EURUSD",
                direction: "Long",
                entry: 1.0850,
                stopLoss: 1.0800,
                takeProfit: 1.0950,
                quantity: 100000,
                pnl: 750,
                strategy: "Breakout",
                comments: "Clean breakout above resistance",
                rating: 4
            },
            {
                id: 2,
                date: "2024-12-14",
                symbol: "GBPUSD",
                direction: "Short",
                entry: 1.2650,
                stopLoss: 1.2700,
                takeProfit: 1.2550,
                quantity: 50000,
                pnl: -200,
                strategy: "Reversal",
                comments: "False signal, stopped out",
                rating: 2
            },
            {
                id: 3,
                date: "2024-12-13",
                symbol: "GOLD",
                direction: "Long",
                entry: 2650.50,
                stopLoss: 2630.00,
                takeProfit: 2690.00,
                quantity: 10,
                pnl: 395,
                strategy: "Trend Following",
                comments: "Strong bullish momentum",
                rating: 5
            },
            {
                id: 4,
                date: "2024-12-12",
                symbol: "EURUSD",
                direction: "Short",
                entry: 1.0920,
                stopLoss: 1.0970,
                takeProfit: 1.0820,
                quantity: 75000,
                pnl: 600,
                strategy: "Breakout",
                comments: "Perfect reversal setup",
                rating: 5
            },
            {
                id: 5,
                date: "2024-12-11",
                symbol: "SPY",
                direction: "Long",
                entry: 485.20,
                stopLoss: 480.00,
                takeProfit: 495.00,
                quantity: 100,
                pnl: -520,
                strategy: "Trend Following",
                comments: "Market turned against trend",
                rating: 2
            },
            {
                id: 6,
                date: "2024-12-10",
                symbol: "AAPL",
                direction: "Long",
                entry: 195.50,
                stopLoss: 190.00,
                takeProfit: 205.00,
                quantity: 50,
                pnl: 475,
                strategy: "Earnings Play",
                comments: "Great earnings reaction",
                rating: 4
            }
        ];
        
        // Sample journal entries
        this.data.journalEntries = [
            {
                id: 1,
                date: "2024-12-15",
                mood: "Confident",
                notes: "Market showed clear direction today. Followed my plan perfectly.",
                tags: ["disciplined", "patient", "profitable"]
            },
            {
                id: 2,
                date: "2024-12-14",
                mood: "Frustrated",
                notes: "Got stopped out on a good setup. Need to review entry timing.",
                tags: ["learning", "improvement", "review"]
            },
            {
                id: 3,
                date: "2024-12-13",
                mood: "Excited",
                notes: "GOLD trade worked perfectly. Great momentum play.",
                tags: ["momentum", "gold", "profitable"]
            }
        ];
        
        // Sample goals
        this.data.goals = [
            {
                id: 1,
                title: "Monthly Profit Target",
                description: "Achieve €5000 profit this month",
                category: "Profit",
                target: 5000,
                current: 3250,
                deadline: "2024-12-31",
                completed: false
            },
            {
                id: 2,
                title: "Win Rate Improvement",
                description: "Maintain 65% win rate",
                category: "Consistency",
                target: 65,
                current: 68,
                deadline: "2024-12-31",
                completed: true
            },
            {
                id: 3,
                title: "Risk Management",
                description: "Never risk more than 2% per trade",
                category: "Risk Management",
                target: 100,
                current: 85,
                deadline: "2024-12-31",
                completed: false
            }
        ];
    }
    
    init() {
        this.setupEventListeners();
        this.showPage('dashboard');
        this.updateHeaderStats();
        this.setupTimer();
        this.rotateMotivationalQuote();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.showPage(page);
            });
        });
        
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Overlay click
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeSidebar();
        });
        
        // Form submissions
        document.getElementById('tradeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTrade();
        });
        
        document.getElementById('journalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addJournalEntry();
        });
        
        document.getElementById('goalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
        });
        
        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.navigateMonth(-1);
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.navigateMonth(1);
        });
        
        // Timer controls
        document.getElementById('startTimer').addEventListener('click', () => {
            this.startTimer();
        });
        
        document.getElementById('pauseTimer').addEventListener('click', () => {
            this.pauseTimer();
        });
        
        document.getElementById('resetTimer').addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Set default date for forms
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tradeDate').value = today;
        document.getElementById('journalDate').value = today;
    }
    
    showPage(pageName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        // Update pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageName).classList.add('active');
        
        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            calendar: 'Calendario',
            journal: 'Diario',
            trades: 'Operazioni',
            analytics: 'Analytics',
            plan: 'Piano Trading',
            goals: 'Obiettivi',
            focus: 'Focus'
        };
        document.getElementById('pageTitle').textContent = titles[pageName];
        
        // Load page-specific content
        this.loadPageContent(pageName);
        this.currentPage = pageName;
    }
    
    loadPageContent(pageName) {
        switch(pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'calendar':
                this.loadCalendar();
                break;
            case 'journal':
                this.loadJournal();
                break;
            case 'trades':
                this.loadTrades();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'goals':
                this.loadGoals();
                break;
        }
    }
    
    loadDashboard() {
        const metrics = this.calculateMetrics();
        
        // Update stat cards
        document.getElementById('totalPnL').textContent = `€${metrics.totalPnL}`;
        document.getElementById('totalPnL').className = `stat-number ${metrics.totalPnL >= 0 ? 'positive' : 'negative'}`;
        
        document.getElementById('winRate').textContent = `${metrics.winRate}%`;
        document.getElementById('profitFactor').textContent = metrics.profitFactor;
        document.getElementById('maxDrawdown').textContent = `€${metrics.maxDrawdown}`;
        
        // Load recent trades
        this.loadRecentTrades();
        
        // Create charts
        setTimeout(() => {
            this.createEquityChart();
            this.createDistributionChart();
        }, 100);
    }
    
    loadRecentTrades() {
        const recentTrades = this.data.trades.slice(-5).reverse();
        const container = document.getElementById('recentTrades');
        
        container.innerHTML = recentTrades.map(trade => `
            <div class="trade-item">
                <div>
                    <span class="trade-symbol">${trade.symbol}</span>
                    <span>${trade.direction}</span>
                </div>
                <div class="trade-pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}">
                    €${trade.pnl}
                </div>
            </div>
        `).join('');
    }
    
    loadCalendar() {
        this.renderCalendar();
    }
    
    renderCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Update month header
        const monthNames = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Create calendar grid
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.textContent = day;
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';
            header.style.padding = '8px';
            grid.appendChild(header);
        });
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            grid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'calendar-day';
            
            const dayDate = new Date(year, month, day);
            const dateString = dayDate.toISOString().split('T')[0];
            
            // Check if this day has trades
            const dayTrades = this.data.trades.filter(trade => trade.date === dateString);
            if (dayTrades.length > 0) {
                const dayPnL = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
                dayElement.classList.add(dayPnL >= 0 ? 'profit' : 'loss');
            }
            
            // Mark today
            if (dayDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            grid.appendChild(dayElement);
        }
    }
    
    navigateMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.renderCalendar();
    }
    
    loadJournal() {
        this.renderJournalEntries();
    }
    
    renderJournalEntries() {
        const container = document.getElementById('journalEntries');
        const entries = this.data.journalEntries.slice().reverse();
        
        container.innerHTML = entries.map(entry => `
            <div class="journal-entry">
                <div class="entry-header">
                    <span class="entry-date">${this.formatDate(entry.date)}</span>
                    <span class="entry-mood">${entry.mood}</span>
                </div>
                <div class="entry-notes">${entry.notes}</div>
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
    
    loadTrades() {
        this.renderTradesTable();
    }
    
    renderTradesTable() {
        const tbody = document.getElementById('tradesTableBody');
        const trades = this.data.trades.slice().reverse();
        
        tbody.innerHTML = trades.map(trade => `
            <tr>
                <td>${this.formatDate(trade.date)}</td>
                <td>${trade.symbol}</td>
                <td>${trade.direction}</td>
                <td class="pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}">€${trade.pnl}</td>
                <td>${trade.strategy}</td>
                <td>${'⭐'.repeat(trade.rating)}</td>
                <td>
                    <button class="delete-btn" onclick="app.deleteTrade(${trade.id})">
                        Elimina
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    loadAnalytics() {
        const metrics = this.calculateAdvancedMetrics();
        
        document.getElementById('sharpeRatio').textContent = metrics.sharpeRatio;
        document.getElementById('maxConsecutiveWins').textContent = metrics.maxConsecutiveWins;
        document.getElementById('maxConsecutiveLosses').textContent = metrics.maxConsecutiveLosses;
        document.getElementById('avgWin').textContent = `€${metrics.avgWin}`;
        
        // Create strategy performance chart
        setTimeout(() => {
            this.createStrategyChart();
        }, 100);
    }
    
    loadGoals() {
        this.renderGoals();
    }
    
    renderGoals() {
        const container = document.getElementById('goalsList');
        
        container.innerHTML = this.data.goals.map(goal => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <div class="goal-title">${goal.title}</div>
                        <div class="goal-category">${goal.category}</div>
                    </div>
                    <div class="goal-description">${goal.description}</div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">
                            ${goal.current} / ${goal.target} (${Math.round(progress)}%)
                        </div>
                    </div>
                    ${goal.deadline ? `<div class="goal-deadline">Scadenza: ${this.formatDate(goal.deadline)}</div>` : ''}
                </div>
            `;
        }).join('');
    }
    
    // CRUD Operations
    addTrade() {
        const form = document.getElementById('tradeForm');
        const formData = new FormData(form);
        
        const trade = {
            id: Date.now(),
            date: document.getElementById('tradeDate').value,
            symbol: document.getElementById('tradeSymbol').value.toUpperCase(),
            direction: document.getElementById('tradeDirection').value,
            entry: parseFloat(document.getElementById('tradeEntry').value),
            stopLoss: parseFloat(document.getElementById('tradeStopLoss').value) || null,
            takeProfit: parseFloat(document.getElementById('tradeTakeProfit').value) || null,
            quantity: parseInt(document.getElementById('tradeQuantity').value),
            pnl: parseFloat(document.getElementById('tradePnL').value),
            strategy: document.getElementById('tradeStrategy').value,
            comments: document.getElementById('tradeComments').value,
            rating: parseInt(document.getElementById('tradeRating').value)
        };
        
        this.data.trades.push(trade);
        form.reset();
        
        // Set today's date again
        document.getElementById('tradeDate').value = new Date().toISOString().split('T')[0];
        
        // Refresh current page content
        this.loadPageContent(this.currentPage);
        this.updateHeaderStats();
        
        // Show success feedback
        this.showNotification('Operazione aggiunta con successo!', 'success');
    }
    
    deleteTrade(id) {
        if (confirm('Sei sicuro di voler eliminare questa operazione?')) {
            this.data.trades = this.data.trades.filter(trade => trade.id !== id);
            this.loadPageContent(this.currentPage);
            this.updateHeaderStats();
            this.showNotification('Operazione eliminata!', 'success');
        }
    }
    
    addJournalEntry() {
        const entry = {
            id: Date.now(),
            date: document.getElementById('journalDate').value,
            mood: document.getElementById('journalMood').value,
            notes: document.getElementById('journalNotes').value,
            tags: document.getElementById('journalTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        this.data.journalEntries.push(entry);
        document.getElementById('journalForm').reset();
        document.getElementById('journalDate').value = new Date().toISOString().split('T')[0];
        
        this.renderJournalEntries();
        this.showNotification('Entry del diario salvata!', 'success');
    }
    
    addGoal() {
        const goal = {
            id: Date.now(),
            title: document.getElementById('goalTitle').value,
            description: document.getElementById('goalDescription').value,
            category: document.getElementById('goalCategory').value,
            target: parseFloat(document.getElementById('goalTarget').value),
            current: parseFloat(document.getElementById('goalCurrent').value),
            deadline: document.getElementById('goalDeadline').value,
            completed: false
        };
        
        this.data.goals.push(goal);
        document.getElementById('goalForm').reset();
        
        this.renderGoals();
        this.showNotification('Obiettivo aggiunto!', 'success');
    }
    
    // Calculations
    calculateMetrics() {
        const trades = this.data.trades;
        const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
        const winningTrades = trades.filter(trade => trade.pnl > 0);
        const losingTrades = trades.filter(trade => trade.pnl < 0);
        
        const winRate = trades.length > 0 ? Math.round((winningTrades.length / trades.length) * 100) : 0;
        
        const totalWins = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0);
        const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0));
        const profitFactor = totalLosses > 0 ? (totalWins / totalLosses).toFixed(2) : 'N/A';
        
        // Calculate max drawdown
        let peak = 0;
        let maxDrawdown = 0;
        let runningPnL = 0;
        
        trades.forEach(trade => {
            runningPnL += trade.pnl;
            if (runningPnL > peak) {
                peak = runningPnL;
            }
            const drawdown = peak - runningPnL;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        });
        
        return {
            totalPnL: Math.round(totalPnL),
            winRate,
            profitFactor,
            maxDrawdown: Math.round(maxDrawdown)
        };
    }
    
    calculateAdvancedMetrics() {
        const trades = this.data.trades;
        const winningTrades = trades.filter(trade => trade.pnl > 0);
        const losingTrades = trades.filter(trade => trade.pnl < 0);
        
        const avgWin = winningTrades.length > 0 ? 
            Math.round(winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length) : 0;
        
        // Calculate consecutive wins/losses
        let maxConsecutiveWins = 0;
        let maxConsecutiveLosses = 0;
        let currentWins = 0;
        let currentLosses = 0;
        
        trades.forEach(trade => {
            if (trade.pnl > 0) {
                currentWins++;
                currentLosses = 0;
                maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWins);
            } else {
                currentLosses++;
                currentWins = 0;
                maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLosses);
            }
        });
        
        // Simple Sharpe ratio calculation
        const returns = trades.map(trade => trade.pnl);
        const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
        const stdDev = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);
        const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev).toFixed(2) : '0.00';
        
        return {
            sharpeRatio,
            maxConsecutiveWins,
            maxConsecutiveLosses,
            avgWin
        };
    }
    
    updateHeaderStats() {
        const metrics = this.calculateMetrics();
        
        const pnlElement = document.getElementById('headerPnL');
        pnlElement.textContent = `€${metrics.totalPnL}`;
        pnlElement.className = `stat-value ${metrics.totalPnL >= 0 ? 'positive' : 'negative'}`;
        
        document.getElementById('headerWinRate').textContent = `${metrics.winRate}%`;
    }
    
    // Charts
    createEquityChart() {
        const ctx = document.getElementById('equityChart').getContext('2d');
        
        // Calculate cumulative P&L
        const sortedTrades = this.data.trades.sort((a, b) => new Date(a.date) - new Date(b.date));
        let cumulativePnL = 0;
        const equityData = sortedTrades.map(trade => {
            cumulativePnL += trade.pnl;
            return {
                x: trade.date,
                y: cumulativePnL
            };
        });
        
        if (this.charts.equity) {
            this.charts.equity.destroy();
        }
        
        this.charts.equity = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Equity Curve',
                    data: equityData,
                    borderColor: '#00d4aa',
                    backgroundColor: 'rgba(0, 212, 170, 0.1)',
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
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    createDistributionChart() {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        
        const winningTrades = this.data.trades.filter(trade => trade.pnl > 0).length;
        const losingTrades = this.data.trades.filter(trade => trade.pnl <= 0).length;
        
        if (this.charts.distribution) {
            this.charts.distribution.destroy();
        }
        
        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Vincenti', 'Perdenti'],
                datasets: [{
                    data: [winningTrades, losingTrades],
                    backgroundColor: ['#00d4aa', '#ff4757'],
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
    
    createStrategyChart() {
        const ctx = document.getElementById('strategyChart').getContext('2d');
        
        // Group trades by strategy
        const strategyData = {};
        this.data.trades.forEach(trade => {
            if (!strategyData[trade.strategy]) {
                strategyData[trade.strategy] = 0;
            }
            strategyData[trade.strategy] += trade.pnl;
        });
        
        if (this.charts.strategy) {
            this.charts.strategy.destroy();
        }
        
        this.charts.strategy = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(strategyData),
                datasets: [{
                    label: 'P&L per Strategia',
                    data: Object.values(strategyData),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderWidth: 0
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
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Timer functionality
    setupTimer() {
        this.updateTimerDisplay();
    }
    
    startTimer() {
        if (!this.timer.isRunning) {
            this.timer.isRunning = true;
            this.timer.interval = setInterval(() => {
                if (this.timer.seconds === 0) {
                    if (this.timer.minutes === 0) {
                        this.timerComplete();
                        return;
                    }
                    this.timer.minutes--;
                    this.timer.seconds = 59;
                } else {
                    this.timer.seconds--;
                }
                this.updateTimerDisplay();
            }, 1000);
        }
    }
    
    pauseTimer() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);
    }
    
    resetTimer() {
        this.pauseTimer();
        this.timer.minutes = 25;
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        const display = `${this.timer.minutes.toString().padStart(2, '0')}:${this.timer.seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;
    }
    
    timerComplete() {
        this.resetTimer();
        this.showNotification('Sessione di focus completata! 🎉', 'success');
        this.rotateMotivationalQuote();
    }
    
    rotateMotivationalQuote() {
        const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        document.getElementById('motivationalText').textContent = `"${randomQuote}"`;
    }
    
    // Mobile sidebar
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
    
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
    
    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('it-IT');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#00d4aa' : '#1a1d29'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
const app = new TradingJournalApp();

// ========== DATA ========== 
const ordersData = [
    { id: '#ORD-001', customer: 'Alice Johnson', product: 'Laptop Pro', amount: 1299, status: 'completed', date: '2025-02-08' },
    { id: '#ORD-002', customer: 'Bob Smith', product: 'Wireless Mouse', amount: 45, status: 'pending', date: '2025-02-08' },
    { id: '#ORD-003', customer: 'Carol White', product: 'USB-C Hub', amount: 89, status: 'shipped', date: '2025-02-07' },
    { id: '#ORD-004', customer: 'David Brown', product: 'Mechanical Keyboard', amount: 159, status: 'completed', date: '2025-02-07' },
    { id: '#ORD-005', customer: 'Emma Davis', product: '4K Monitor', amount: 599, status: 'pending', date: '2025-02-06' },
    { id: '#ORD-006', customer: 'Frank Miller', product: 'Laptop Stand', amount: 79, status: 'completed', date: '2025-02-06' }
];

const activityEvents = [
    { text: 'Order #ORD-006 was completed', time: '5 minutes ago', icon: '📦', color: '#e3f2fd' },
    { text: 'New user registered: Sarah Anderson', time: '12 minutes ago', icon: '👤', color: '#f3e5f5' },
    { text: 'Payment received from Bob Smith', time: '25 minutes ago', icon: '💳', color: '#e8f5e9' },
    { text: 'Sales reached $45,230 this month', time: '1 hour ago', icon: '📈', color: '#fff3e0' },
    { text: 'Project milestone reached: 3,850 users', time: '2 hours ago', icon: '🎉', color: '#fce4ec' }
];

let currentSortField = 'date';
let isAscending = true;
let filteredData = [...ordersData];

// ========== THEME TOGGLE ========== 
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('dashboard-theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
});

// Load saved theme
function initTheme() {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
}

// ========== SIDEBAR TOGGLE ========== 
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');

hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Close sidebar when clicking menu items on mobile
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
        // Update active state
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        item.classList.add('active');
    });
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ========== SEARCH & FILTER ========== 
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredData = ordersData.filter(order => 
        order.customer.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
    );
    renderTable(filteredData);
});

// ========== SORTING ========== 
const sortSelect = document.getElementById('sortSelect');
const sortOrderBtn = document.getElementById('sortOrder');

sortSelect.addEventListener('change', (e) => {
    currentSortField = e.target.value;
    renderTable(filteredData);
});

sortOrderBtn.addEventListener('click', () => {
    isAscending = !isAscending;
    sortOrderBtn.textContent = isAscending ? '↑ Ascending' : '↓ Descending';
    renderTable(filteredData);
});

// ========== TABLE RENDERING ========== 
function renderTable(data) {
    let sortedData = [...data];
    
    // Sort
    sortedData.sort((a, b) => {
        let aVal, bVal;
        
        if (currentSortField === 'date') {
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        } else if (currentSortField === 'amount') {
            aVal = a.amount;
            bVal = b.amount;
        } else if (currentSortField === 'customer') {
            aVal = a.customer.toLowerCase();
            bVal = b.customer.toLowerCase();
        }
        
        if (isAscending) {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = sortedData.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>$${order.amount}</td>
            <td><span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td>${order.date}</td>
        </tr>
    `).join('');
}

// ========== KPI UPDATE ========== 
function generateKPIData() {
    return {
        revenue: Math.floor(Math.random() * (50000 - 30000 + 1)) + 30000,
        orders: Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000,
        users: Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000,
        conversion: (Math.random() * (5 - 2) + 2).toFixed(2)
    };
}

function updateKPIs() {
    const kpi = generateKPIData();
    document.getElementById('kpiRevenue').textContent = `$${kpi.revenue.toLocaleString()}`;
    document.getElementById('kpiOrders').textContent = kpi.orders.toLocaleString();
    document.getElementById('kpiUsers').textContent = kpi.users.toLocaleString();
    document.getElementById('kpiConversion').textContent = `${kpi.conversion}%`;
}

// ========== CHART RENDERING ========== 
function drawChart() {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Sample data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = [12, 19, 8, 15, 22, 18];
    const maxValue = Math.max(...data);
    
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // Draw grid lines and labels
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        const label = maxValue - (maxValue / 5) * i;
        ctx.fillText(label.toFixed(0), padding - 20, y + 4);
    }
    
    // Draw bars
    const barWidth = chartWidth / (months.length * 1.5);
    const barSpacing = chartWidth / months.length;
    
    months.forEach((month, idx) => {
        const barHeight = (data[idx] / maxValue) * chartHeight;
        const x = padding + idx * barSpacing + (barSpacing - barWidth) / 2;
        const y = height - padding - barHeight;
        
        // Bar with gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#4318ff');
        gradient.addColorStop(1, '#7551ff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Month label
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.fillText(month, x + barWidth / 2, height - padding + 20);
    });
}

// Redraw chart on window resize
window.addEventListener('resize', drawChart);

// ========== REFRESH BUTTON ========== 
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', () => {
    refreshBtn.style.animation = 'spin 0.6s ease-in-out';
    setTimeout(() => {
        refreshBtn.style.animation = '';
    }, 600);
    updateKPIs();
    drawChart();
});

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========== INITIALIZATION ========== 
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTable(filteredData);
    updateKPIs();
    setTimeout(drawChart, 100); // Small delay to ensure canvas is ready
});

// Auto-update KPIs every 5 seconds (optional)
// setInterval(updateKPIs, 5000);
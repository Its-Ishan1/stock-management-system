const kpiData = [
    {
        id: 1,
        icon: '📦',
        label: 'Total Products',
        value: '1,247',
        change: '+12% from last month',
        changeType: 'positive',
        cardClass: 'card-blue'
    },
    {
        id: 2,
        icon: '⚠️',
        label: 'Low Stock Items',
        value: '23',
        change: 'Needs attention',
        changeType: 'negative',
        cardClass: 'card-orange'
    },
    {
        id: 3,
        icon: '📥',
        label: 'Pending Receipts',
        value: '8',
        change: '2 arriving today',
        changeType: 'neutral',
        cardClass: 'card-green'
    },
    {
        id: 4,
        icon: '📤',
        label: 'Pending Deliveries',
        value: '15',
        change: '5 ready to ship',
        changeType: 'neutral',
        cardClass: 'card-purple'
    },
    {
        id: 5,
        icon: '🔄',
        label: 'Internal Transfers',
        value: '6',
        change: 'Scheduled today',
        changeType: 'neutral',
        cardClass: 'card-cyan'
    },
    {
        id: 6,
        icon: '🏭',
        label: 'Active Warehouses',
        value: '4',
        change: 'All operational',
        changeType: 'positive',
        cardClass: 'card-pink'
    }
];

const KPICards = () => {
    return (
        <div className="kpi-grid">
            {kpiData.map((kpi) => (
                <div key={kpi.id} className={`kpi-card ${kpi.cardClass}`}>
                    <div className="kpi-icon">{kpi.icon}</div>
                    <div className="kpi-content">
                        <p className="kpi-label">{kpi.label}</p>
                        <h3 className="kpi-value">{kpi.value}</h3>
                        <p className={`kpi-change ${kpi.changeType}`}>{kpi.change}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KPICards;

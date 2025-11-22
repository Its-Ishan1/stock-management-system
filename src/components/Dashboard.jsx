import KPICards from './KPICards';
import ActivityTable from './ActivityTable';
import QuickActions from './QuickActions';

const Dashboard = () => {
    return (
        <div className="dashboard-content">
            <div className="page-header">
                <h2>Inventory Dashboard</h2>
                <p className="page-subtitle">Real-time overview of your stock operations</p>
            </div>

            <KPICards />
            <ActivityTable />
            <QuickActions />
        </div>
    );
};

export default Dashboard;

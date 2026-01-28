# Implementation Plan - Enhancements

## Goal
Add editing capability for transactions, improve navigation with a persistent sidebar, and make dashboard charts dynamic.

## Proposed Changes

### Backend
#### [MODIFY] [transactions.js](file:///d:/DevOps%20project/Personal%20Finance%20Tracker/Piggy%20Bank/Fullstack-Backend/routes/transactions.js)
- Add `PUT /update/:id` endpoint to modify existing transactions.

### Frontend
#### [NEW] [Sidebar.jsx](file:///d:/DevOps%20project/Personal%20Finance%20Tracker/Piggy%20Bank/Fullstack-Frontend/src/components/Sidebar.jsx)
- Extract the sidebar UI from `DashBoard.jsx` into a reusable component.
- Props: `activeItem`, `sidebarOpen`, `toggleSidebar`, `user`.

#### [MODIFY] [DashBoard.jsx](file:///d:/DevOps%20project/Personal%20Finance%20Tracker/Piggy%20Bank/Fullstack-Frontend/src/pages/DashBoard.jsx)
- Replace inline sidebar with `<Sidebar />`.
- **Charts Logic**:
    - `processChartData(transactions)` function.
    - **Category Pie Chart**: Group expenses by `category` and sum amounts.
    - **Monthly Bar Chart**: Group transactions by Month (Jan, Feb, etc.) and sum `income` and `expense` separately.
- Remove hardcoded `monthlyData` and `categoryData`.

#### [MODIFY] [Transactions.jsx](file:///d:/DevOps%20project/Personal%20Finance%20Tracker/Piggy%20Bank/Fullstack-Frontend/src/pages/Transactions.jsx)
- Add `<Sidebar />` layout.
- **Edit Logic**:
    - Add `editTransaction(tx)` function.
    - When clicked, open Modal, fill `formData` with `tx` data, set `editingId`.
    - Update `handleSubmit` to call `PUT /update` if `editingId` exists.

## Verification Plan
1.  **Sidebar**: Check if Sidebar appears on both pages and highlights correct item.
2.  **Edit**:
    - Click "Edit" on a transaction.
    - Change amount.
    - Save.
    - Verify update in list and DB.
3.  **Charts**:
    - Add a few transactions with different dates/categories.
    - Verify Pie Chart shows correct category distribution.
    - Verify Bar Chart shows correct monthly totals.

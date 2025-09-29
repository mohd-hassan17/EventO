'use client'

import React, { useState, useMemo } from 'react';
import { Search, Users, Calendar, DollarSign, IndianRupee, Menu, Sun, Moon, ChevronLeft, ChevronRight, Check, X, Eye, Trash2 } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useRedirect";

// Import your context - replace with actual import
// import { useUserContext } from "@/context/userContext";

// Mock context for demo - replace with your actual useUserContext


export default function AdminDashboard() {
  const { logout, user, bookings, getBookings, loading, deleteUser, deleteBooking } = useUserContext();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useRedirect("/");
   const { name, photo, } = user
  // Calculate stats
  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.guests * b.budget), 0);
    
    const eventTypeCounts = bookings.reduce((acc, b) => {
      const eventName = b.eventType === 'Other' ? b.otherEventText : b.eventType;
      acc[eventName] = (acc[eventName] || 0) + 1;
      return acc;
    }, {});
    
    const mostPopularEvent = Object.entries(eventTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    return { totalBookings, totalRevenue, mostPopularEvent };
  }, [bookings]);

  // Chart data
  const eventTypeData = useMemo(() => {
    const counts = bookings.reduce((acc, b) => {
      const eventName = b.eventType === 'Other' ? b.otherEventText : b.eventType;
      acc[eventName] = (acc[eventName] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Table setup
  const columnHelper = createColumnHelper();
  
  const bookingColumns = [
    columnHelper.accessor('user.name', {
      header: 'Customer',
      cell: info => (
        <div>
          <div className="font-medium">{info.getValue()}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{info.row.original.user.email}</div>
        </div>
      ),
    }),
    columnHelper.accessor(row => row.eventType === 'Other' ? row.otherEventText : row.eventType, {
      id: 'eventType',
      header: 'Event Type',
    }),
    columnHelper.accessor('date', {
      header: 'Date & Time',
      cell: info => (
        <div>
          <div>{new Date(info.getValue()).toLocaleDateString()}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {info.row.original.time.hour}:{info.row.original.time.minute} {info.row.original.time.period}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('guests', {
      header: 'Guests',
    }),
    columnHelper.accessor('budget', {
      header: 'Budget/Guest',
      cell: info => `${info.getValue()}`,
    }),
    columnHelper.accessor(row => row.guests * row.budget, {
      id: 'total',
      header: 'Total Cost',
      cell: info => `${info.getValue().toLocaleString()}`,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedBooking(info.row.original)}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this booking?')) {
                deleteBooking(info.row.original._id);
              }
            }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: bookings,
    columns: bookingColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // if (user.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p className="text-xl">Access denied. Admin only.</p>
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} z-50`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Event Admin</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Calendar },
            { id: 'bookings', label: 'All Bookings', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentView === item.id ? 'bg-blue-50 dark:bg-blue-900 border-r-4 border-blue-600' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold">
              {currentView === 'dashboard' && 'Dashboard Overview'}
              {currentView === 'bookings' && 'All Bookings'}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {user.photo && (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-xl">Loading bookings...</p>
            </div>
          ) : (
            <>
              {currentView === 'dashboard' && (
                <div>
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={Calendar} title="Total Bookings" value={stats.totalBookings} color="bg-blue-500" />
                    <StatCard icon={IndianRupee} title="Total Revenue" value={`${stats.totalRevenue.toLocaleString()}`} color="bg-green-500" />
                    <StatCard icon={Users} title="Popular Event" value={stats.mostPopularEvent} color="bg-purple-500" />
                  </div>

                  {/* Chart */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
                    <h3 className="text-lg font-semibold mb-4">Bookings by Event Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={eventTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#1f2937' : '#fff',
                            border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                          }} 
                        />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {currentView === 'bookings' && (
                <div>
                  {/* Search */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Search bookings by name, email, or event type..."
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                          {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map(header => (
                                <th
                                  key={header.id}
                                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                  onClick={header.column.getToggleSortingHandler()}
                                >
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                {row.getVisibleCells().map(cell => (
                                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                No bookings found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {table.getRowModel().rows.length > 0 && (
                      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500">
                          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, bookings.length)} of {bookings.length} results
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Customer Information</h3>
                <div className="space-y-2 pl-4">
                  <p><span className="font-medium">Name:</span> {selectedBooking.contact.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedBooking.contact.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedBooking.contact.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Event Details</h3>
                <div className="space-y-2 pl-4">
                  <p><span className="font-medium">Event Type:</span> {selectedBooking.eventType === 'Other' ? selectedBooking.otherEventText : selectedBooking.eventType}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {selectedBooking.time.hour}:{selectedBooking.time.minute} {selectedBooking.time.period}</p>
                  <p><span className="font-medium">Total Guests:</span> {selectedBooking.guests}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Financial Details</h3>
                <div className="space-y-2 pl-4">
                  <p><span className="font-medium">Budget per Guest:</span> ${selectedBooking.budget}</p>
                  <p className="text-xl"><span className="font-medium">Estimated Total:</span> <span className="text-green-600 dark:text-green-400 font-bold">${(selectedBooking.guests * selectedBooking.budget).toLocaleString()}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function StatCard({title, value, subtitle}){
  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  )
}

function OrdersTable({orders}){
  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">
      <div className="font-semibold mb-3">Dernières commandes</div>
      <table className="w-full text-left">
        <thead className="text-xs text-gray-500">
          <tr><th>Nom</th><th>Date</th><th>Montant</th><th>Produits</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t">
              <td className="py-2">{o.name}</td>
              <td className="py-2">{new Date(o.created_at).toLocaleString()}</td>
              <td className="py-2">{o.total_price} {o.currency || ''}</td>
              <td className="py-2">{o.line_items.map(li => `${li.qty}× ${li.title}`).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App(){
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    axios.get(`${api}/api/stats`).then(r=>setStats(r.data)).catch(()=>{})
    axios.get(`${api}/api/orders`).then(r=>setOrders(r.data.orders || [])).catch(()=>{})
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord — Coffre à jouets Montessori</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Visiteurs" value={stats && stats.visitors !== null ? stats.visitors : '—'} subtitle="(source: Reports/Analytics)" />
          <StatCard title="Commandes" value={stats ? stats.orders_count : '—'} />
          <StatCard title="Chiffre d\'affaires" value={stats ? `${stats.revenue} €` : '—'} />
          <StatCard title="Taux conversion" value={stats && stats.conversion_rate !== null ? `${stats.conversion_rate}%` : '—'} subtitle="(orders / visitors)" />
        </div>

        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}

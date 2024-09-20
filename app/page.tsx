'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from '@/types/order';
import { MenuItem } from '@/types/menuItem';

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState({ tableNumber: 1, menuItem: '', quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    setError(null);
    try {
      const response = await fetch('/api/menu-items');  // プロキシAPI経由でリクエスト
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
    } catch (error) {
      setError('Error fetching menu items');
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    setError(null);
    try {
      const response = await fetch('/api/orders');  // プロキシAPI経由でリクエスト
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      setError('Error fetching orders');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const createdOrder: Order = await response.json();
      setOrders((prevOrders) => [createdOrder, ...prevOrders]);
      setNewOrder({ tableNumber: 1, menuItem: '', quantity: 1 });
    } catch (error) {
      setError('Error placing order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cafe Ordering System</h1>
        <Link href="/menu-management">
          <Button>Menu Management</Button>
        </Link>
      </header>

      {error && <p className="text-red-500">{error}</p>}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                value={newOrder.tableNumber}
                onChange={(e) => setNewOrder({ ...newOrder, tableNumber: Math.max(1, parseInt(e.target.value)) })}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="menuItem">Menu Item</Label>
              <select
                id="menuItem"
                value={newOrder.menuItem}
                onChange={(e) => setNewOrder({ ...newOrder, menuItem: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select an item</option>
                {menuItems.map((item) => (
                  <option key={item.menuId} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({ ...newOrder, quantity: Math.max(1, parseInt(e.target.value)) })}
                min="1"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Placing Order...' : 'Place Order'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Table Number</TableHead>
                <TableHead>Menu Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.tableNumber}</TableCell>
                  <TableCell>{order.menuItem}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

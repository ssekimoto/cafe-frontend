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
import { useDataFetcher } from '@/lib/data-fetcher';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState({ tableNumber: 1, menuItem: '', quantity: 1 });
  const { fetchData, handleFormSubmission, loading, error, setError, setLoading } = useDataFetcher();

  const fetchMenuItems = async () => {
    const data = await fetchData<MenuItem[]>('/api/menu-items');
    setMenuItems(data);
  };

  const fetchOrders = async () => {
    const data = await fetchData<Order[]>('/api/orders');
    setOrders(data);
  };

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

  const { fetchData, handleFormSubmission, loading, error, setError, setLoading } = useDataFetcher();

  const fetchMenuItems = async () => {
    const data = await fetchData<MenuItem[]>('/api/menu-items');
    setMenuItems(data);
  };

  const fetchOrders = async () => {
    const data = await fetchData<Order[]>('/api/orders');
    setOrders(data);
  };

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

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

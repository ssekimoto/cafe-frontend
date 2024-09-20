'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MenuItem } from '@/types/menuItem';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    available: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    setError(null);
    try {
      const response = await fetch('/api/menu-items'); // プロキシAPI経由でリクエスト
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

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMenuItem),
      });
      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }

      const createdMenuItem: MenuItem = await response.json();
      setMenuItems((prevItems) => [createdMenuItem, ...prevItems]);
      setNewMenuItem({ name: '', description: '', price: 0, available: true });
    } catch (error) {
      setError('Error adding menu item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <Link href="/">
          <Button>Back to Order Page</Button>
        </Link>
      </header>

      {error && <p className="text-red-500">{error}</p>}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newMenuItem.name}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="itemDescription">Description</Label>
              <Input
                id="itemDescription"
                value={newMenuItem.description}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="itemPrice">Price</Label>
              <Input
                id="itemPrice"
                type="number"
                value={newMenuItem.price}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    price: Math.max(0, parseFloat(e.target.value)),
                  })
                }
                min="0"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="itemAvailable"
                checked={newMenuItem.available}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, available: e.target.checked })
                }
              />
              <Label htmlFor="itemAvailable">Available</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Menu Item'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.menuId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

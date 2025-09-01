"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { IconArrowLeft, IconEdit, IconBan, IconPlayerPause, IconPlayerPlay, IconWallet, IconCoins, IconDeviceMobile, IconBuildingBank, IconTrash, IconShield, IconSettings, IconCreditCard } from "@tabler/icons-react";
import { mockCharges } from "@/components/admin/charges/types";

// Mock merchant data - in a real app, this would come from an API
const merchantData = {
  id: "1",
  name: "Banco Limited",
  code: "BLUPAY1000",
  status: "Active",
  email: "info@bancolimited.com",
  phone: "+233 55 123 4567",
  address: "123 Main Street, Accra, Ghana",
  businessType: "Financial Institution",
  registrationNumber: "REG12345678",
  taxId: "TAX8765432",
  dateCreated: "2023-07-15",
  bankDetails: {
    bankName: "First Bank",
    accountNumber: "1234567890",
    accountName: "Banco Limited",
    swiftCode: "FBGHACAC"
  },
  surchargeDetails: {
    hasGlobalSurcharge: true,
    globalSurchargeValue: "2.5%",
    cardSchemes: [
      { name: "CARD", surcharge: "2.5%" },
      { name: "MOMO", surcharge: "1.5%" }
    ]
  },
  ovaSettings: {
    enabled: true,
    accountNumber: "9876543210",
    balanceLimit: "10000.00",
    mtn: "mtn-ova-001",
    airtel: "airtel-ova-001", 
    telecel: "telecel-ova-001"
  },
  settlementFrequency: "daily",
  momoDetails: {
    provider: "mtn",
    number: "024 123 4567",
    accountName: "John Doe"
  },
  recentTransactions: [
    { id: 1, date: "2023-09-15", reference: "TRX123456", amount: "5,000.00", status: "Completed" },
    { id: 2, date: "2023-09-14", reference: "TRX123455", amount: "1,200.00", status: "Completed" },
    { id: 3, date: "2023-09-13", reference: "TRX123454", amount: "3,500.00", status: "Failed" },
    { id: 4, date: "2023-09-12", reference: "TRX123453", amount: "800.00", status: "Pending" }
  ],
  users: [
    { id: 1, name: "John Doe", email: "john@bancolimited.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@bancolimited.com", role: "Manager" },
    { id: 3, name: "Mark Wilson", email: "mark@bancolimited.com", role: "Accountant" }
  ]
};

// Define badge variant type
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

// Define User type
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function MerchantDetailPage() {
  const params = useParams();
  const [merchant, setMerchant] = useState(merchantData);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'suspend' | 'deactivate' | 'activate' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User'
  });
  
  useEffect(() => {
    // In a real app, fetch merchant data based on ID
    // For now using mock data
    setMerchant(merchantData);
    setLoading(false);
  }, [params.id]);
  
  const handleStatusChange = (action: 'suspend' | 'deactivate' | 'activate') => {
    setStatusAction(action);
    setStatusDialogOpen(true);
  };
  
  const executeStatusChange = () => {
    // Here you would call the API to update the merchant's status
    let newStatus;
    
    switch (statusAction) {
      case 'suspend':
        newStatus = 'Suspended';
        break;
      case 'deactivate':
        newStatus = 'Inactive';
        break;
      case 'activate':
        newStatus = 'Active';
        break;
      default:
        return;
    }
    
    setMerchant(prev => ({
      ...prev,
      status: newStatus
    }));
    
    setStatusDialogOpen(false);
    setActionReason('');
    
    // In a real app, you would show a success notification here
  };
  
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch(status) {
      case 'Active':
        return 'secondary';
      case 'Suspended':
        return 'destructive';
      case 'Inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const handleEditMerchant = () => {
    // Navigate to the create merchant page with edit mode
    window.location.href = `/admin/dashboard/merchant?tab=create&id=${params.id}`;
  };
  
  const handleAddUser = () => {
    // Here you would call the API to add a new user
    
    // Update local state for demo purposes
    const newUserId = merchant.users.length + 1;
    
    setMerchant(prev => ({
      ...prev,
      users: [
        ...prev.users,
        {
          id: newUserId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      ]
    }));
    
    // Reset form and close modal
    setNewUser({
      name: '',
      email: '',
      role: 'User'
    });
    setAddUserOpen(false);
  };
  
  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteUserOpen(true);
  };

  const initiateUserDeletion = () => {
    setDeleteUserOpen(false);
    setOtpDialogOpen(true);
    setOtpCode('');
    setOtpError('');
    // In a real app, you would send OTP to admin's registered email/phone
    console.log('OTP sent for user deletion verification');
  };

  const verifyOtpAndDeleteUser = () => {
    setIsVerifyingOtp(true);
    setOtpError('');

    // Simulate OTP verification (in real app, this would be an API call)
    setTimeout(() => {
      if (otpCode === '123456') { // Mock OTP for demo
        // Delete the user
        setMerchant(prev => ({
          ...prev,
          users: prev.users.filter(u => u.id !== userToDelete?.id)
        }));
        
        setOtpDialogOpen(false);
        setUserToDelete(null);
        setOtpCode('');
        setIsVerifyingOtp(false);
        
        // Show success message
        console.log('User deleted successfully');
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setIsVerifyingOtp(false);
      }
    }, 1500);
  };

  const cancelUserDeletion = () => {
    setDeleteUserOpen(false);
    setOtpDialogOpen(false);
    setUserToDelete(null);
    setOtpCode('');
    setOtpError('');
  };
  
  if (loading) {
    return <div className="p-6">Loading merchant details...</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/dashboard/merchant">
              <IconArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{merchant.name}</h1>
          <Badge variant={getStatusBadgeVariant(merchant.status)}>
            {merchant.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {merchant.status === 'Active' && (
            <>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
                onClick={() => handleStatusChange('suspend')}
              >
                <IconPlayerPause className="h-4 w-4" />
                Suspend
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleStatusChange('deactivate')}
              >
                <IconBan className="h-4 w-4" />
                Deactivate
              </Button>
            </>
          )}
          
          {(merchant.status === 'Suspended' || merchant.status === 'Inactive') && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-green-500 text-green-500 hover:bg-green-50"
              onClick={() => handleStatusChange('activate')}
            >
              <IconPlayerPlay className="h-4 w-4" />
              Activate
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEditMerchant}
          >
            <IconEdit className="h-4 w-4 mr-2" />
            Edit Merchant
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Merchant Code</CardDescription>
            <CardTitle>{merchant.code}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Date Created</CardDescription>
            <CardTitle>{new Date(merchant.dateCreated).toLocaleDateString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Account Status</CardDescription>
            <CardTitle>{merchant.status}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-4 h-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="surcharge">Surcharge</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                  <p>{merchant.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Type</p>
                  <p>{merchant.businessType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                  <p>{merchant.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tax ID</p>
                  <p>{merchant.taxId}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{merchant.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{merchant.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{merchant.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                  <p>{merchant.bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                  <p>{merchant.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Name</p>
                  <p>{merchant.bankDetails.accountName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Swift Code</p>
                  <p>{merchant.bankDetails.swiftCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="surcharge" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Surcharge Configuration</CardTitle>
              <CardDescription>
                Detailed view of all applied charges and surcharge settings for this merchant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Global Surcharge Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconSettings className="h-5 w-5" />
                  Global Settings
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Surcharge Type</div>
                    <div className="text-lg font-semibold">Default</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Applied To</div>
                    <div className="text-lg font-semibold">Merchant</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Partner Bank Split</div>
                    <div className="text-lg font-semibold">Enabled</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Applied Charges */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <IconCreditCard className="h-5 w-5" />
                  Applied Charges
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(mockCharges).map(([key, charge]) => (
                    <div key={key} className="p-4 bg-background rounded-lg border shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        {key.includes('wallet') && <IconWallet className="h-5 w-5 text-blue-600" />}
                        {key.includes('momo') && !key.includes('Collection') && <IconDeviceMobile className="h-5 w-5 text-green-600" />}
                        {key.includes('bank') && !key.includes('Collection') && <IconBuildingBank className="h-5 w-5 text-purple-600" />}
                        {key.includes('Collection') && key.includes('momo') && <IconCoins className="h-5 w-5 text-orange-600" />}
                        {key.includes('Collection') && key.includes('bank') && <IconCoins className="h-5 w-5 text-red-600" />}
                        <span className="font-medium text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Type</span>
                          <Badge variant="secondary" className="text-xs">
                            {charge.chargeType}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Rate</span>
                          <span className="font-medium text-sm">
                            {charge.chargeType === "fixed" 
                              ? `GHS${charge.amount.toFixed(2)}` 
                              : `${charge.percentage}%`}
                          </span>
                        </div>
                        {charge.chargeType === "percentage" && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Cap</span>
                            <span className="text-sm font-medium">GHS{charge.cap.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Status</span>
                          <Badge variant={charge.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {charge.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Accounts</CardTitle>
              <Button size="sm" onClick={() => setAddUserOpen(true)}>Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchant.users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{user.role}</Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Most recent transactions for this merchant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchant.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{transaction.reference}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">GHS{transaction.amount}</p>
                      <Badge 
                        variant={
                          transaction.status === "Completed" ? "secondary" :
                          transaction.status === "Pending" ? "outline" : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'suspend' && 'Suspend Merchant'}
              {statusAction === 'deactivate' && 'Deactivate Merchant'}
              {statusAction === 'activate' && 'Activate Merchant'}
            </DialogTitle>
            <DialogDescription>
              {statusAction === 'suspend' && 'This will temporarily suspend the merchant\'s account. They will not be able to process transactions until activated again.'}
              {statusAction === 'deactivate' && 'This will deactivate the merchant\'s account. All services will be disabled.'}
              {statusAction === 'activate' && 'This will activate the merchant\'s account and restore all services.'}
            </DialogDescription>
          </DialogHeader>
          
          {(statusAction === 'suspend' || statusAction === 'deactivate') && (
            <div className="py-4">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason
              </label>
              <textarea
                id="reason"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="Please provide a reason for this action"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              ></textarea>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeStatusChange}
              variant={statusAction === 'activate' ? 'default' : 'destructive'}
              disabled={(statusAction === 'suspend' || statusAction === 'deactivate') && !actionReason.trim()}
            >
              {statusAction === 'suspend' && 'Suspend'}
              {statusAction === 'deactivate' && 'Deactivate'}
              {statusAction === 'activate' && 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account for this merchant
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newUser.name} 
                onChange={(e) => handleNewUserChange('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address</Label>
              <Input 
                id="userEmail" 
                type="email" 
                value={newUser.email} 
                onChange={(e) => handleNewUserChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <select 
                id="userRole" 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newUser.role} 
                onChange={(e) => handleNewUserChange('role', e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={!newUser.name || !newUser.email}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconTrash className="h-5 w-5 text-destructive" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone and will require OTP verification.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <IconShield className="h-4 w-4" />
                <span className="text-sm font-medium">Security Notice</span>
              </div>
              <p className="text-sm text-destructive/80 mt-1">
                This action requires OTP verification sent to your registered email address.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelUserDeletion}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={initiateUserDeletion}>
              Proceed to OTP Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconShield className="h-5 w-5 text-primary" />
              OTP Verification
            </DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to your registered email address to confirm user deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className={otpError ? "border-destructive" : ""}
              />
              {otpError && (
                <p className="text-sm text-destructive">{otpError}</p>
              )}
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>User to delete:</strong> {userToDelete?.name} ({userToDelete?.email})
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              Demo OTP: 123456 (In production, this would be sent to your email)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelUserDeletion} disabled={isVerifyingOtp}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={verifyOtpAndDeleteUser}
              disabled={!otpCode || otpCode.length !== 6 || isVerifyingOtp}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  IconSend, 
  IconRefresh, 
  IconCheck, 
  IconBuildingBank,
  IconClock,
  IconLockAccess
} from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"
import { useCurrency } from "@/lib/currency-context"

// Mock data for partner banks with MOMO details
const mockPartnerBanks = [
  {
    id: 1,
    bankName: "GCB Bank Ltd",
    momoProvider: "MTN",
    momoNumber: "0244123456",
    momoName: "GCB Bank Settlement",
    balance: 50000.00,
    status: "Active"
  },
  {
    id: 2,
    bankName: "Ecobank Ghana",
    momoProvider: "Telecel",
    momoNumber: "0501234567",
    momoName: "Ecobank Settlement",
    balance: 75000.00,
    status: "Active"
  },
  {
    id: 3,
    bankName: "Absa Bank Ghana",
    momoProvider: "MTN",
    momoNumber: "0554123456",
    momoName: "Absa Settlement",
    balance: 25000.00,
    status: "Active"
  },
  {
    id: 4,
    bankName: "Standard Chartered",
    momoProvider: "AirtelTigo",
    momoNumber: "0277123456",
    momoName: "SC Settlement",
    balance: 10000.00,
    status: "Inactive"
  }
]

// Mock disbursement history
const mockDisbursementHistory = [
  {
    id: 1,
    bankName: "GCB Bank Ltd",
    amount: 5000.00,
    momoNumber: "0244123456",
    momoProvider: "MTN",
    status: "Completed",
    date: "2024-01-15 14:30:00",
    reference: "REM20240115001"
  },
  {
    id: 2,
    bankName: "Ecobank Ghana",
    amount: 10000.00,
    momoNumber: "0501234567",
    momoProvider: "Telecel",
    status: "Pending",
    date: "2024-01-15 10:15:00",
    reference: "REM20240115002"
  },
  {
    id: 3,
    bankName: "Absa Bank Ghana",
    amount: 7500.00,
    momoNumber: "0554123456",
    momoProvider: "MTN",
    status: "Failed",
    date: "2024-01-14 16:45:00",
    reference: "REM20240114001"
  }
]

export default function DisbursementPage() {
  const { currency } = useCurrency()
  const [selectedBank, setSelectedBank] = useState<typeof mockPartnerBanks[0] | null>(null)
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedOva, setSelectedOva] = useState("EGANOW") // Selected OVA account
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpProcessing, setOtpProcessing] = useState(false)

  // Mock OVA accounts with EGANOW/BLUPAY
  const ovaAccounts = [
    { id: "EGANOW", name: "EGANOW", balance: 250000.00 },
    { id: "BLUPAY", name: "BLUPAY", balance: 180000.00 }
  ]

  const getCurrentOvaBalance = () => {
    const account = ovaAccounts.find(acc => acc.id === selectedOva)
    return account?.balance || 0
  }

  const handleSendDisbursement = () => {
    if (!selectedBank) {
      toast.error("Please select a partner bank")
      return
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    
    if (parseFloat(amount) > getCurrentOvaBalance()) {
      toast.error(`Insufficient ${selectedOva} balance`)
      return
    }
    
    // Show OTP dialog instead of directly processing
    setShowOtpDialog(true)
  }

  const handleOtpSubmit = () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setOtpProcessing(true)
    
    // Simulate OTP verification and disbursement
    setTimeout(() => {
      toast.success(`Disbursement of ${currency}${parseFloat(amount).toFixed(2)} sent to ${selectedBank?.bankName}`)
      setAmount("")
      setSelectedBank(null)
      setOtp("")
      setShowOtpDialog(false)
      setOtpProcessing(false)
      setIsProcessing(false)
    }, 2000)
  }

  const handleOtpCancel = () => {
    setShowOtpDialog(false)
    setOtp("")
    setIsProcessing(false)
  }

  const formatAmount = (amount: number) => `${currency}${amount.toFixed(2)}`

  const renderStatus = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Completed: "default",
      Pending: "secondary",
      Failed: "destructive"
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const renderScheme = (scheme: string) => {
    const schemeColors: Record<string, string> = {
      MTN: "bg-yellow-500 text-white",
      Telecel: "bg-red-500 text-white", 
      AirtelTigo: "bg-blue-500 text-white"
    }
    return (
      <Badge className={schemeColors[scheme] || "bg-gray-500 text-white"}>
        {scheme}
      </Badge>
    )
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Disbursement</h1>
          <p className="text-muted-foreground">Disburse funds from OVA to Bank MOMO wallets</p>
        </div>
        <div className="text-right space-y-3">
          <div>
            <Label className="text-sm text-muted-foreground">Select Payout OVA account</Label>
            <Select
              value={selectedOva}
              onValueChange={setSelectedOva}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ovaAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between w-full">
                      <span>{account.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        {formatAmount(account.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Selected OVA Balance</p>
            <p className="text-lg font-bold text-green-600">{formatAmount(getCurrentOvaBalance())}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banks</CardTitle>
            <IconBuildingBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPartnerBanks.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockPartnerBanks.filter(b => b.status === "Active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Disbursements</CardTitle>
            <IconSend className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Transactions sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Send Disbursement Section */}
      <Card>
        <CardHeader>
          <CardTitle>Send Disbursement</CardTitle>
          <CardDescription>
            Select a bank and enter the amount to disburse from {ovaAccounts.find(acc => acc.id === selectedOva)?.name || "selected OVA"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partner Bank Selection */}
            <div className="space-y-4">
              <Label htmlFor="bankSelect">Select Bank</Label>
              <Select
                value={selectedBank?.id?.toString() || ""}
                onValueChange={(value) => {
                  const bank = mockPartnerBanks.find(b => b.id.toString() === value)
                  if (bank?.status === "Active") {
                    setSelectedBank(bank)
                  } else {
                    toast.error("Cannot select inactive partner bank")
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a partner bank" />
                </SelectTrigger>
                <SelectContent>
                  {mockPartnerBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id.toString()} disabled={bank.status !== "Active"}>
                      <div className="flex items-center justify-between w-full">
                        <span>{bank.bankName}</span>
                        <Badge variant={bank.status === "Active" ? "default" : "secondary"} className="ml-2">
                          {bank.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedBank && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium">Selected Bank Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Bank:</span>
                      <p className="font-medium">{selectedBank.bankName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Provider:</span>
                      <p className="font-medium">{selectedBank.momoProvider}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Number:</span>
                      <p className="font-medium">{selectedBank.momoNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Wallet Name:</span>
                      <p className="font-medium">{selectedBank.momoName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amount and Send */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({currency})</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={getCurrentOvaBalance()}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to send"
                />
                <p className="text-xs text-muted-foreground">
                  Available balance: {formatAmount(getCurrentOvaBalance())}
                </p>
              </div>

              <Button
                onClick={handleSendDisbursement}
                disabled={isProcessing || !amount || !selectedBank}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <IconSend className="h-4 w-4 mr-2" />
                    Send Disbursement
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Disbursement History</CardTitle>
          <CardDescription>View all disbursement transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Reference</th>
                    <th className="text-left p-2 font-medium">Bank</th>
                    <th className="text-left p-2 font-medium">Amount</th>
                    <th className="text-left p-2 font-medium">MOMO Number</th>
                    <th className="text-left p-2 font-medium">Scheme</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDisbursementHistory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-sm">{item.reference}</td>
                      <td className="p-2">{item.bankName}</td>
                      <td className="p-2 font-medium">{formatAmount(item.amount)}</td>
                      <td className="p-2 font-mono">{item.momoNumber}</td>
                      <td className="p-2">{renderScheme(item.momoProvider)}</td>
                      <td className="p-2">{renderStatus(item.status)}</td>
                      <td className="p-2 text-sm">{new Date(item.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OTP Authorization Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconLockAccess className="h-5 w-5" />
              OTP Authorization
            </DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to your registered mobile number to authorize this disbursement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-wider"
              />
            </div>
            
            {selectedBank && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p><strong>Amount:</strong> {currency}{parseFloat(amount).toFixed(2)}</p>
                <p><strong>To:</strong> {selectedBank.bankName}</p>
                <p><strong>From:</strong> {selectedOva} OVA</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleOtpCancel} disabled={otpProcessing}>
              Cancel
            </Button>
            <Button onClick={handleOtpSubmit} disabled={otpProcessing || otp.length !== 6}>
              {otpProcessing ? (
                <>
                  <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <IconCheck className="h-4 w-4 mr-2" />
                  Confirm Disbursement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
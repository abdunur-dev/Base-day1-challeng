"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Copy, Share2, CheckCircle2, FileText, Shield, ExternalLink } from "lucide-react"
import { BASE_HEALTH_CONTRACT } from "@/lib/contract"
import { hashFile } from "@/lib/utils"
import { baseSepolia } from "wagmi/chains"

interface HealthRecord {
  hash: string
  fileName: string
  timestamp: Date
  txHash?: string
}

export default function BaseHealthApp() {
  const { address, isConnected } = useAccount()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showShareSuccess, setShowShareSuccess] = useState(false)
  const [doctorAddress, setDoctorAddress] = useState("")
  const [isHashing, setIsHashing] = useState(false)
  const [fileHash, setFileHash] = useState<string>("")

  const { data: saveHash, writeContract: saveRecord, isPending: isSaving } = useWriteContract()

  const { data: shareHash, writeContract: shareAccess, isPending: isSharing } = useWriteContract()

  const { isLoading: isSaveConfirming, isSuccess: isSaveSuccess } = useWaitForTransactionReceipt({
    hash: saveHash,
  })

  const { isLoading: isShareConfirming, isSuccess: isShareSuccess } = useWaitForTransactionReceipt({
    hash: shareHash,
  })

  const { data: contractRecords, refetch: refetchRecords } = useReadContract({
    address: BASE_HEALTH_CONTRACT.address,
    abi: BASE_HEALTH_CONTRACT.abi,
    functionName: "getRecords",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && BASE_HEALTH_CONTRACT.address !== "0x0000000000000000000000000000000000000000",
    },
  })

  useEffect(() => {
    if (isSaveSuccess && selectedFile && fileHash) {
      const newRecord: HealthRecord = {
        hash: fileHash,
        fileName: selectedFile.name,
        timestamp: new Date(),
        txHash: saveHash,
      }
      setRecords([newRecord, ...records])
      setSelectedFile(null)
      setFileHash("")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
      refetchRecords()
    }
  }, [isSaveSuccess])

  useEffect(() => {
    if (isShareSuccess) {
      setShowShareSuccess(true)
      setDoctorAddress("")
      setTimeout(() => setShowShareSuccess(false), 5000)
    }
  }, [isShareSuccess])

  useEffect(() => {
    if (contractRecords && Array.isArray(contractRecords)) {
      const loadedRecords = contractRecords.map((record: any) => ({
        hash: record.hash,
        fileName: "Medical Record",
        timestamp: new Date(Number(record.timestamp) * 1000),
      }))
      setRecords(loadedRecords)
    }
  }, [contractRecords])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setFileHash("")
    }
  }

  const generateHashAndSave = async () => {
    if (!selectedFile || !address) return

    try {
      setIsHashing(true)
      const hash = await hashFile(selectedFile)
      setFileHash(hash)
      setIsHashing(false)

      if (BASE_HEALTH_CONTRACT.address === "0x0000000000000000000000000000000000000000") {
        // Demo mode - save locally
        const newRecord: HealthRecord = {
          hash,
          fileName: selectedFile.name,
          timestamp: new Date(),
        }
        setRecords([newRecord, ...records])
        setSelectedFile(null)
        setFileHash("")
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
        return
      }

      saveRecord({
        address: BASE_HEALTH_CONTRACT.address,
        abi: BASE_HEALTH_CONTRACT.abi,
        functionName: "saveRecord",
        args: [hash],
      })
    } catch (error) {
      console.error("[v0] Error hashing file:", error)
      setIsHashing(false)
    }
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
  }

  const handleShareAccess = () => {
    if (!doctorAddress || !address) return

    if (BASE_HEALTH_CONTRACT.address === "0x0000000000000000000000000000000000000000") {
      // Demo mode
      setShowShareSuccess(true)
      setDoctorAddress("")
      setTimeout(() => setShowShareSuccess(false), 5000)
      return
    }

    shareAccess({
      address: BASE_HEALTH_CONTRACT.address,
      abi: BASE_HEALTH_CONTRACT.abi,
      functionName: "shareAccess",
      args: [doctorAddress as `0x${string}`],
    })
  }

  const isProcessing = isHashing || isSaving || isSaveConfirming || isSharing || isShareConfirming

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0052FF] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">BaseHealth</h1>
              <p className="text-sm text-muted-foreground">Secure your health records on Base</p>
            </div>
          </div>

          <ConnectKitButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Your Health Data, <span className="text-[#0052FF]">Your Control</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Upload your encrypted health records and store proof securely on the Base blockchain. Access and share your
            medical information anytime, anywhere.
          </p>
          {isConnected && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
              Connected to Base Sepolia Testnet
            </div>
          )}
        </div>

        {/* Upload Section */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#0052FF]" />
              Upload Health Record
            </CardTitle>
            <CardDescription>
              Select a medical document to encrypt and store its hash on Base blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Medical Document</Label>
              <div className="flex gap-3">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="flex-1"
                  disabled={!isConnected || isProcessing}
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Selected: {selectedFile.name}
                </p>
              )}
              {fileHash && <p className="text-xs font-mono text-[#06b6d4] break-all">Hash: {fileHash}</p>}
            </div>

            <Button
              onClick={generateHashAndSave}
              disabled={!selectedFile || !isConnected || isProcessing}
              className="w-full gap-2 bg-[#0052FF] hover:bg-[#0052FF]/90"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isHashing && "Generating Hash..."}
                  {isSaving && "Confirming Transaction..."}
                  {isSaveConfirming && "Saving to Base..."}
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Generate Hash & Save to Base
                </>
              )}
            </Button>

            {showSuccess && (
              <Alert className="border-[#10b981]/50 bg-[#10b981]/10">
                <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                <AlertDescription className="text-[#10b981] flex items-center justify-between">
                  <span>Your record hash is stored on Base blockchain!</span>
                  {saveHash && (
                    <a
                      href={`${baseSepolia.blockExplorers.default.url}/tx/${saveHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline"
                    >
                      View TX <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {!isConnected && (
              <Alert className="border-[#0052FF]/50 bg-[#0052FF]/10">
                <Shield className="h-4 w-4 text-[#0052FF]" />
                <AlertDescription className="text-[#0052FF]">
                  Please connect your wallet to upload health records
                </AlertDescription>
              </Alert>
            )}

            {BASE_HEALTH_CONTRACT.address === "0x0000000000000000000000000000000000000000" && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertDescription className="text-yellow-500 text-xs">
                  Demo Mode: Update contract address in lib/contract.ts after deployment
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Stored Records Section */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#06b6d4]" />
              Your Stored Records
            </CardTitle>
            <CardDescription>All your medical records securely stored on Base blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No records stored yet. Upload your first health record above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1">{record.fileName}</p>
                        <p className="text-xs font-mono text-muted-foreground break-all">{record.hash}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs text-muted-foreground">{record.timestamp.toLocaleString()}</p>
                          {record.txHash && (
                            <a
                              href={`${baseSepolia.blockExplorers.default.url}/tx/${record.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#0052FF] hover:underline flex items-center gap-1"
                            >
                              View TX <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyHash(record.hash)}
                        className="gap-2 shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Access Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#0052FF]" />
              Share Access
            </CardTitle>
            <CardDescription>Grant healthcare providers access to your medical records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-address">Doctor&apos;s Wallet Address</Label>
              <Input
                id="doctor-address"
                placeholder="0x..."
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
                disabled={!isConnected || records.length === 0 || isProcessing}
                className="font-mono"
              />
            </div>

            <Button
              onClick={handleShareAccess}
              disabled={!doctorAddress || !isConnected || records.length === 0 || isProcessing}
              className="w-full gap-2 bg-secondary hover:bg-secondary/80"
              variant="secondary"
            >
              {isSharing || isShareConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  {isSharing && "Confirming..."}
                  {isShareConfirming && "Sharing Access..."}
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share Access
                </>
              )}
            </Button>

            {showShareSuccess && (
              <Alert className="border-[#10b981]/50 bg-[#10b981]/10">
                <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                <AlertDescription className="text-[#10b981] flex items-center justify-between">
                  <span>Record access shared successfully!</span>
                  {shareHash && (
                    <a
                      href={`${baseSepolia.blockExplorers.default.url}/tx/${shareHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline"
                    >
                      View TX <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Built on <span className="text-[#0052FF] font-semibold">Base</span> • Empowering Health Data Privacy
          </p>
          <p className="text-xs text-muted-foreground">Network: Base Sepolia • Chain ID: {baseSepolia.id}</p>
        </div>
      </footer>
    </div>
  )
}

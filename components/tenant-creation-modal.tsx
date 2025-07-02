"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TenantOnboardingForm } from "@/components/tenant-onboarding-form"

interface TenantCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TenantCreationModal({ open, onOpenChange }: TenantCreationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Tenant</DialogTitle>
          <DialogDescription>
            Fill in the information below to onboard a new tenant.
          </DialogDescription>
        </DialogHeader>
        <TenantOnboardingForm />
      </DialogContent>
    </Dialog>
  )
}

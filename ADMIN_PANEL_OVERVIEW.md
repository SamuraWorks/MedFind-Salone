# 🏥 MedFind Salone — Admin Panel Page Overview

The Admin Panel is the secure backend interface of MedFind Salone, designed for hospital staff and administrators to manage their facility's critical data in real-time.

It ensures that the public always has access to accurate information regarding bed capacity, oxygen supplies, and emergency service availability.

## 🔐 Authentication & Security

*   **Login System:** Hospital staff must select their specific facility and log in (currently simulated for demonstration; robust auth planned for production).
*   **Secure Access:** The panel is restricted to authorized personnel to prevent unauthorized data changes.

## 📊 Dashboard & Live Stats

Upon logging in, administrators are presented with a live dashboard showing their hospital's current status:

*   **Beds Available:** Real-time count of free beds vs. total capacity.
*   **Oxygen Supply:** Current status (Yes/No/Limited).
*   **Staffing:** Number of surgeons and specialists currently on duty.
*   **Ambulance:** Availability status of emergency transport.

## ⚡ Quick Update Actions

Designed for high-pressure emergency situations, the panel offers "One-Tap" updates:

*   **"Beds Full"**: Instantly marks the hospital as at capacity to divert incoming ambulances.
*   **"Oxygen Restored"**: Quickly updates status when supplies arrive.
*   **"Emergency Alert"**: Can trigger a status that warns users of critical overcrowding or resource shortages.

## 📝 Comprehensive Data Management

For detailed daily reporting, administrators can use the full update form to modify:

*   Exact number of available beds.
*   Specific notes on ward closures or maintenance.
*   Operating theatre status.
*   Detailed list of available specialists.

## 🕒 History & Audit Logs

*   **Update Tracking:** Every change made is logged with a timestamp and the user who made it.
*   **Audit Trail:** This history allows for accountability and helps analyze trends in hospital capacity over time.

## 💾 Offline Capability & Data Sync

*   **Offline-First:** Administrators can make updates even without an internet connection. Changes are saved locally.
*   **Auto-Sync:** When the device reconnects to the network, all local changes are automatically synchronized with the central database.

## 📐 Design & Usability

*   **Desktop & Mobile Optimized:** The interface works seamlessly on hospital desktop computers and staff mobile phones.
*   **High Contrast & Clear UI:** Designed to be readable in various lighting conditions typical of hospital environments.
*   **Minimalist Workflow:** Focused on speed and efficiency to minimize administrative burden during emergencies.

## 🏁 Summary

The Admin Panel (`/admin.html`) is the control center of MedFind Salone. It empowers healthcare workers to keep the nation informed, enabling efficient patient routing and potentially saving lives by directing emergencies to facilities with actual capacity.

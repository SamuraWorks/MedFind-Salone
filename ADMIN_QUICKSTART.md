# 🔐 MedFind Salone - Admin Portal Quick Start Guide

## 📖 Overview

The **MedFind Salone Admin Portal** allows hospital staff to update real-time availability data that patients see in the MedFind app. This ensures accurate, life-saving information.

---

## 🚀 Quick Start

### 1. **Access the Admin Portal**

**URL:** [https://medfind-salone.vercel.app/admin.html](https://medfind-salone.vercel.app/admin.html)

Or locally: Open `admin.html` in your browser

### 2. **Login**

- **Demo Mode Active:** Use any username/password
- **Select your hospital** from the dropdown
- Click **Login**

**Production Setup:** Contact support@medfindsalone.sl for secure credentials

---

## ⚡ Quick Updates (Most Common)

Use these **one-click buttons** for fast updates:

### Critical Status Updates:

| Button | Use When | Patient Sees |
|--------|----------|--------------|
| 🛏️ **Beds Full** | No beds available | Red "0 Beds" |
| 🆓 **Beds Available** | Beds become free | Green bed count |
| 💨 **No Oxygen** | Oxygen depleted | Red "Oxygen ✗" |
| ✅ **Oxygen OK** | Oxygen restocked | Green "Oxygen ✓" |
| 👨‍⚕️ **Surgeon Available** | Surgeon on-site | Green "Yes" |
| ⏰ **Surgeon On-Call** | Surgeon available but not on-site | Yellow "On Call" |
| 🚑 **Ambulance Out** | Ambulance dispatched | Red "Ambulance ✗" |
| 🚐 **Ambulance Ready** | Ambulance returned | Green "Ambulance ✓" |

**Just click the button → Confirm → Done!** 🎉

---

## 📝 Detailed Updates (Full Form)

When you need to update multiple fields at once:

1. **Fill in the form fields:**
   - Beds Available Now
   - Oxygen Availability (Yes/Limited/No)
   - Surgeons on Duty (Yes/On Call/No)
   - Operating Theatre Status
   - Ambulance Availability
   - Additional Notes (optional)

2. **Click "Save All Changes"**

3. **Confirm** and you're done!

---

## 📊 Key Features

### ✅ **Real-Time Sync**
- Updates appear instantly in the patient app
- Offline updates queued and synced automatically

### ✅ **Update History**
- See all changes made
- Track who updated what and when
- Export for hospital records

### ✅ **Offline Support**
- Continue working without internet
- Changes sync when connection restored

### ✅ **Data Management**
- Download hospital data (JSON)
- View all hospitals
- Reset to defaults if needed

---

## ⏰ Recommended Update Schedule

### **Every 4 Hours:**
- Bed availability
- Oxygen status
- Ambulance availability

### **Every Shift Change:**
- Surgeon on-duty status
- Operating theatre status

### **Immediately (Within 5 minutes):**
- ⚠️ Oxygen depletion
- ⚠️ Last bed occupied
- ⚠️ Emergency equipment failure

---

## 🔒 Security Best Practices

✅ **DO:**
- Change password on first login
- Log out after each session
- Keep credentials secure
- Update promptly and accurately

❌ **DON'T:**
- Share login credentials
- Leave session unattended
- Update without verifying information

---

## 📞 Support

### **Technical Issues:**
- Email: support@medfindsalone.sl
- Check update history for troubleshooting

### **Common Problems:**

**Can't login?**
1. Check username spelling
2. Verify hospital selection
3. Clear browser cache and retry

**Updates not saving?**
1. Check internet connection
2. Look for offline banner
3. Updates will sync when online

**Wrong data showing?**
1. Refresh the page
2. Check update history
3. Make corrective update

---

## 🎯 Your Impact

Every update you make:

✅ **Helps patients find the right hospital faster**  
✅ **Reduces wasted trips to full hospitals**  
✅ **Saves lives in emergencies**  
✅ **Improves healthcare access nationwide**

**Thank you for keeping MedFind data accurate and saving lives!** 🙏

---

## 📚 Additional Resources

- **Full Admin Guide:** See `ADMIN_GUIDE.md` for comprehensive documentation
- **Training:** Contact training@medfindsalone.sl
- **SOP Manual:** Standard operating procedures for emergencies

---

**Version 1.0 | December 2025**  
**MedFind Salone - Making Healthcare Accessible for All Sierra Leoneans** 🇸🇱
